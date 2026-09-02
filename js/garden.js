/* ==========================================
   OUR VIRTUAL LOVE GARDEN LOGIC
   ========================================== */

(function () {
    const canvas = document.getElementById('sakuraCanvas');
    const stageBox = document.querySelector('.garden-stage');
    const treeEmoji = document.getElementById('treeEmoji');
    const stageTitle = document.getElementById('gardenStageTitle');
    const pointsEl = document.getElementById('growthPoints');
    const streakEl = document.getElementById('gardenStreak');
    const fillBar = document.getElementById('growthFill');

    // Care Points
    let carePoints = parseInt(localStorage.getItem('love_garden_points') || '85', 10);
    const START_DATE = new Date('2026-05-22T00:00:00');
    const streakDays = Math.max(104, Math.floor((Date.now() - START_DATE.getTime()) / (1000 * 3600 * 24)));

    if (streakEl) streakEl.textContent = `${streakDays} Days Blooming`;

    function updateTreeState() {
        if (pointsEl) pointsEl.textContent = `${carePoints} / 150 Points`;

        const percent = Math.min(100, Math.floor((carePoints / 150) * 100));
        if (fillBar) fillBar.style.width = `${percent}%`;

        if (carePoints < 40) {
            if (treeEmoji) treeEmoji.textContent = '🌱';
            if (stageTitle) stageTitle.textContent = 'Stage 1: Tender Sprout 🌿';
        } else if (carePoints < 80) {
            if (treeEmoji) treeEmoji.textContent = '🌿';
            if (stageTitle) stageTitle.textContent = 'Stage 2: Growing Bonsai 🍃';
        } else if (carePoints < 130) {
            if (treeEmoji) treeEmoji.textContent = '🌸';
            if (stageTitle) stageTitle.textContent = 'Stage 3: Full Cherry Blossom 🌸';
        } else {
            if (treeEmoji) treeEmoji.textContent = '🌳✨';
            if (stageTitle) stageTitle.textContent = 'Stage 4: Sacred Eternal Tree 💖';
        }

        localStorage.setItem('love_garden_points', carePoints);
    }

    // Web Audio Synthesizer for actions
    let audioCtx = null;
    function playActionTone(freq) {
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        } catch(e) {}
    }

    function spawnParticle(emoji) {
        if (!stageBox) return;
        const p = document.createElement('div');
        p.className = 'garden-particle';
        p.textContent = emoji;
        p.style.left = `${45 + Math.random() * 10}%`;
        p.style.bottom = `120px`;
        stageBox.appendChild(p);
        setTimeout(() => p.remove(), 1800);
    }

    window.gardenAction = function (type, broadcast = true) {
        let emoji = '💖';
        let freq = 520;
        let bonus = 5;

        if (type === 'water') {
            emoji = '💧';
            freq = 600;
            bonus = 5;
        } else if (type === 'sun') {
            emoji = '☀️';
            freq = 750;
            bonus = 6;
        } else if (type === 'love') {
            emoji = '💖';
            freq = 880;
            bonus = 8;
        }

        carePoints += bonus;
        playActionTone(freq);
        spawnParticle(emoji);
        updateTreeState();

        if (treeEmoji) {
            treeEmoji.style.transform = 'scale(1.2)';
            setTimeout(() => { treeEmoji.style.transform = ''; }, 300);
        }

        if (broadcast && window.RealtimeClient) {
            const identity = sessionStorage.getItem('aradhya_user_identity') || 'Harsh';
            window.RealtimeClient.emit('garden_action', {
                type: type,
                person: identity.toLowerCase()
            });
        }
    };

    // Socket.io Listener
    if (window.RealtimeClient) {
        window.RealtimeClient.on('garden_action', (data) => {
            if (!data) return;
            window.gardenAction(data.type, false);
            const person = (data.person === 'aradhya') ? 'Aradhya' : 'Harsh';
            showGardenToast(`🌸 ${person} just cared for our Love Tree!`);
        });
    }

    function showGardenToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(22, 10, 36, 0.95); border: 1px solid #ff4b91;
            color: #fff; padding: 10px 22px; border-radius: 50px; font-size: 13px;
            font-weight: 600; z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // ==========================================
    // SAKURA FALLING PETALS CANVAS
    // ==========================================
    function initSakuraCanvas() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = stageBox.clientWidth);
        let height = (canvas.height = stageBox.clientHeight);

        const petals = [];
        const TOTAL_PETALS = 35;

        for (let i = 0; i < TOTAL_PETALS; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 6 + Math.random() * 8,
                speedX: -1 + Math.random() * 2,
                speedY: 1 + Math.random() * 2,
                angle: Math.random() * Math.PI * 2,
                angularSpeed: 0.02 + Math.random() * 0.03,
                color: Math.random() > 0.4 ? 'rgba(255, 183, 197, 0.75)' : 'rgba(255, 127, 165, 0.8)'
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);

                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

                p.x += p.speedX;
                p.y += p.speedY;
                p.angle += p.angularSpeed;

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
            });

            requestAnimationFrame(render);
        }

        render();

        window.addEventListener('resize', () => {
            width = canvas.width = stageBox.clientWidth;
            height = canvas.height = stageBox.clientHeight;
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateTreeState();
        initSakuraCanvas();
    });
})();
