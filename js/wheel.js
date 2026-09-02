/* ==========================================
   SPIN THE LOVE WHEEL LOGIC
   ========================================== */

(function () {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resultText = document.getElementById('resultText');
    const spinBtn = document.getElementById('spinBtn');
    const winModal = document.getElementById('wheelWinModal');
    const winPrizeTitle = document.getElementById('winPrizeTitle');

    const slices = [
        { label: "Hot Chocolate ☕", color: "#ff4b91", icon: "☕" },
        { label: "Unlimited Hug 🫂", color: "#7f00ff", icon: "🫂" },
        { label: "Late Night Call 📞", color: "#ff7fa5", icon: "📞" },
        { label: "Samose Treat 🥟", color: "#ffd166", icon: "🥟" },
        { label: "Song Voice Note 🎤", color: "#06d6a0", icon: "🎤" },
        { label: "Romantic Poem 📜", color: "#118ab2", icon: "📜" },
        { label: "Boss For 1 Hour 👑", color: "#f72585", icon: "👑" },
        { label: "Funny Secret 😂", color: "#7209b7", icon: "😂" }
    ];

    const numSlices = slices.length;
    const arc = (2 * Math.PI) / numSlices;
    let currentRotation = 0;
    let isSpinning = false;

    // Web Audio Click Synthesizer for Ticks
    let audioCtx = null;
    function playTickSound() {
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.04);
        } catch(e) {}
    }

    function initCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const size = 380;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        drawWheel();
    }

    function drawWheel() {
        const size = 380;
        const center = size / 2;
        const radius = center - 8;

        ctx.clearRect(0, 0, size, size);

        slices.forEach((slice, i) => {
            const angle = currentRotation + i * arc;

            // Draw slice arc
            ctx.beginPath();
            ctx.fillStyle = slice.color;
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, angle, angle + arc);
            ctx.lineTo(center, center);
            ctx.fill();

            // Border line
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text Label
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Poppins";
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 4;
            ctx.fillText(slice.label, radius - 20, 5);
            ctx.restore();
        });
    }

    window.spinWheel = function () {
        if (isSpinning) return;
        isSpinning = true;
        if (spinBtn) spinBtn.style.pointerEvents = 'none';

        const extraTurns = 5 + Math.floor(Math.random() * 4);
        const randomAngle = Math.random() * (2 * Math.PI);
        const totalTargetRotation = currentRotation + extraTurns * 2 * Math.PI + randomAngle;

        const startRotation = currentRotation;
        const spinDuration = 4500; // ms
        const startTime = performance.now();
        let lastTickAngle = currentRotation;

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            // Ease Out Cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentRotation = startRotation + (totalTargetRotation - startRotation) * easeOut;

            // Tick on passing segments
            if (Math.abs(currentRotation - lastTickAngle) >= arc) {
                playTickSound();
                lastTickAngle = currentRotation;
            }

            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                if (spinBtn) spinBtn.style.pointerEvents = 'auto';
                onSpinComplete();
            }
        }

        requestAnimationFrame(animate);
    };

    function onSpinComplete() {
        // Pointer is at the top (angle = 3*PI/2)
        const normalizedAngle = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (3 * Math.PI / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
        const selectedIndex = Math.floor(pointerAngle / arc) % numSlices;
        const prize = slices[selectedIndex];

        if (resultText) resultText.textContent = prize.label;
        if (winPrizeTitle) winPrizeTitle.textContent = prize.label;
        if (winModal) winModal.style.display = 'flex';

        if (window.confetti) {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

        // Socket.io Broadcast
        if (window.RealtimeClient) {
            const identity = sessionStorage.getItem('aradhya_user_identity') || 'Harsh';
            window.RealtimeClient.emit('wheel_spin', {
                person: identity.toLowerCase(),
                item: prize.label
            });
        }
    }

    window.closeWheelModal = function () {
        if (winModal) winModal.style.display = 'none';
    };

    // Socket.io Listener for partner's spin
    if (window.RealtimeClient) {
        window.RealtimeClient.on('wheel_spin', (data) => {
            if (!data) return;
            const person = (data.person === 'aradhya') ? 'Aradhya' : 'Harsh';
            alert(`🎡 ${person} just spun the Love Wheel and won: "${data.item}"! 💖`);
            if (resultText) resultText.textContent = `${person} won: ${data.item}`;
        });
    }

    document.addEventListener('DOMContentLoaded', initCanvas);
})();
