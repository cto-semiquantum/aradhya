/* ==========================================
   BIRTHDAY VAULT SCRIPT — 0411 LOCK & CELEBRATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const lockScreen = document.getElementById('lockScreen');
    const content = document.getElementById('celebrationContent');
    const passInput = document.getElementById('passcode');
    const unlockBtn = document.getElementById('unlockBtn');
    const lockError = document.getElementById('lockError');
    const countdownEl = document.getElementById('bdayCountdown');

    // 1. Passcode Check (0411 or 411)
    function unlockVault() {
        const val = passInput ? passInput.value.trim() : '';
        if (val === '0411' || val === '411') {
            if (lockScreen) lockScreen.style.display = 'none';
            if (content) content.classList.add('unlocked');
            triggerConfetti();
        } else {
            if (lockError) {
                lockError.textContent = '❌ Galat passcode! Hint: 4th Nov (0411)';
                lockError.style.color = '#ff4b91';
            }
        }
    }

    if (unlockBtn) unlockBtn.addEventListener('click', unlockVault);
    if (passInput) {
        passInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') unlockVault();
        });
    }

    // 2. 4th November Countdown & Today Check
    function updateCountdown() {
        if (!countdownEl) return;
        const now = new Date();
        let targetYear = now.getFullYear();
        let target = new Date(targetYear, 10, 4, 0, 0, 0); // Month is 0-indexed: 10 = Nov

        // If Nov 4 has passed this year, set for next year
        if (now > target && (now.getMonth() !== 10 || now.getDate() !== 4)) {
            target = new Date(targetYear + 1, 10, 4, 0, 0, 0);
        }

        // Check if today is 4th Nov
        if (now.getMonth() === 10 && now.getDate() === 4) {
            countdownEl.innerHTML = "🎉 TODAY IS ARADHYA'S BIRTHDAY! 🎉";
            return;
        }

        const diff = target - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        countdownEl.textContent = `${days} Days, ${hours} Hours, ${mins} Mins, ${secs} Secs`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 3. Candle Blow Interactive
    const candles = document.querySelectorAll('.candle-item');
    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            candle.classList.toggle('blown');
        });
    });

    // 4. Confetti Animation
    function triggerConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#ff4b91', '#7f00ff', '#ffffff', '#ffd700', '#ff7fa5'];

        for (let i = 0; i < 100; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                rotation: Math.random() * 360
            });
        }

        let duration = 0;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.y += p.speed;
                p.rotation += 2;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                if (p.y > canvas.height) p.y = -10;
            });

            duration++;
            if (duration < 300) {
                requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        render();
    }
});
