/* ==========================================
   LOVE DOODLE — REALTIME SHARED CANVAS LOGIC
   ========================================== */

(function () {
    const canvas = document.getElementById('doodleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const wrapper = document.querySelector('.canvas-wrapper');
    const partnerCursor = document.getElementById('partnerCursor');

    // Drawing State
    let isDrawing = false;
    let currentColor = '#ff4b91';
    let currentBrushSize = 6;
    let isGlow = true;
    let isEraser = false;
    let lastX = 0;
    let lastY = 0;

    // Resize Canvas with Retina DPR
    function resizeCanvas() {
        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Save current drawing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Restore image scaled
        if (tempCanvas.width > 0) {
            ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function getCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
            normX: (clientX - rect.left) / rect.width,
            normY: (clientY - rect.top) / rect.height
        };
    }

    function drawLine(x0, y0, x1, y1, color, size, glow, erase) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);

        if (erase) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = size * 2.5;
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            if (glow) {
                ctx.shadowColor = color;
                ctx.shadowBlur = size * 2;
            } else {
                ctx.shadowBlur = 0;
            }
        }

        ctx.stroke();
        ctx.restore();
    }

    // Local Drawing Handlers
    function startDraw(e) {
        e.preventDefault();
        isDrawing = true;
        const coords = getCoords(e);
        lastX = coords.x;
        lastY = coords.y;

        // Draw dot on click/tap
        drawLine(lastX, lastY, lastX + 0.1, lastY + 0.1, currentColor, currentBrushSize, isGlow, isEraser);

        if (window.RealtimeClient) {
            window.RealtimeClient.emit('love_doodle_stroke', {
                x0: coords.normX,
                y0: coords.normY,
                x1: coords.normX,
                y1: coords.normY,
                color: currentColor,
                size: currentBrushSize,
                glow: isGlow,
                erase: isEraser
            });
        }
    }

    function moveDraw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const coords = getCoords(e);

        drawLine(lastX, lastY, coords.x, coords.y, currentColor, currentBrushSize, isGlow, isEraser);

        if (window.RealtimeClient) {
            const rect = canvas.getBoundingClientRect();
            window.RealtimeClient.emit('love_doodle_stroke', {
                x0: lastX / rect.width,
                y0: lastY / rect.height,
                x1: coords.normX,
                y1: coords.normY,
                color: currentColor,
                size: currentBrushSize,
                glow: isGlow,
                erase: isEraser
            });
        }

        lastX = coords.x;
        lastY = coords.y;
    }

    function endDraw(e) {
        if (!isDrawing) return;
        isDrawing = false;
    }

    // Mouse & Touch Listeners
    canvas.addEventListener('mousedown', startDraw);
    window.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    window.addEventListener('touchmove', moveDraw, { passive: false });
    window.addEventListener('touchend', endDraw);

    // Socket.io Realtime Listener for Remote Strokes
    if (window.RealtimeClient) {
        window.RealtimeClient.on('love_doodle_stroke', (data) => {
            if (!data) return;
            const rect = canvas.getBoundingClientRect();
            const x0 = data.x0 * rect.width;
            const y0 = data.y0 * rect.height;
            const x1 = data.x1 * rect.width;
            const y1 = data.y1 * rect.height;

            drawLine(x0, y0, x1, y1, data.color, data.size, data.glow, data.erase);

            // Move partner cursor
            if (partnerCursor) {
                partnerCursor.style.display = 'block';
                partnerCursor.style.left = `${x1}px`;
                partnerCursor.style.top = `${y1}px`;
            }
        });

        window.RealtimeClient.on('love_doodle_clear', () => {
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            showBannerNotification("✨ Partner just refreshed the canvas!");
        });

        window.RealtimeClient.on('love_doodle_heart', (data) => {
            spawnHeartBurst(data.x, data.y, data.emoji || '💖');
            if (navigator.vibrate) navigator.vibrate([40, 80, 40]);
        });
    }

    // Floating Heart Bursts
    function spawnHeartBurst(normX, normY, emoji = '💖') {
        const rect = canvas.getBoundingClientRect();
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.textContent = emoji;

        const left = (typeof normX === 'number' ? normX * rect.width : rect.width / 2);
        const top = (typeof normY === 'number' ? normY * rect.height : rect.height / 2);

        heart.style.left = `${left}px`;
        heart.style.top = `${top}px`;
        wrapper.appendChild(heart);

        setTimeout(() => heart.remove(), 1800);
    }

    window.sendDoodleHeart = function () {
        spawnHeartBurst(0.5, 0.6, '💖');
        if (window.RealtimeClient) {
            window.RealtimeClient.emit('love_doodle_heart', { x: 0.5, y: 0.6, emoji: '💖' });
        }
    };

    // Color Swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentColor = swatch.dataset.color;
            isEraser = false;
            document.getElementById('eraserBtn')?.classList.remove('active');
        });
    });

    // Brush Size
    const brushSlider = document.getElementById('brushSlider');
    if (brushSlider) {
        brushSlider.addEventListener('input', (e) => {
            currentBrushSize = parseInt(e.target.value, 10);
            const sizeLabel = document.getElementById('brushSizeLabel');
            if (sizeLabel) sizeLabel.textContent = `${currentBrushSize}px`;
        });
    }

    // Glow Mode Toggle
    window.toggleGlow = function () {
        isGlow = !isGlow;
        const btn = document.getElementById('glowBtn');
        if (btn) btn.classList.toggle('active', isGlow);
    };

    // Eraser Toggle
    window.toggleEraser = function () {
        isEraser = !isEraser;
        const btn = document.getElementById('eraserBtn');
        if (btn) btn.classList.toggle('active', isEraser);
    };

    // Clear Canvas
    window.clearCanvas = function () {
        if (!confirm("Are you sure you want to clear the canvas?")) return;
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        if (window.RealtimeClient) {
            window.RealtimeClient.emit('love_doodle_clear');
        }
    };

    // Save Artwork as PNG
    window.saveDoodle = function () {
        // Create temporary canvas to add watermark
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Dark background
        tempCtx.fillStyle = '#090314';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw artwork
        tempCtx.drawImage(canvas, 0, 0);

        // Add romantic watermark
        tempCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        tempCtx.font = '20px Poppins';
        tempCtx.textAlign = 'right';
        tempCtx.fillText('Harsh & Aradhya 💖 Love Doodle', tempCanvas.width - 24, tempCanvas.height - 24);

        const link = document.createElement('a');
        link.download = `love-doodle-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    };

    function showBannerNotification(text) {
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(255, 75, 145, 0.9); color: #fff; padding: 10px 24px;
            border-radius: 50px; font-size: 13px; font-weight: 600; z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease;
        `;
        banner.textContent = text;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2500);
    }
})();
