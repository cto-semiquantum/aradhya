document.addEventListener("DOMContentLoaded", function () {

    const message = document.getElementById("finalMessage");
    const noBtn = document.getElementById("noBtn");
    const confettiCanvas = document.getElementById("confettiCanvas");

    // === YES BUTTON ===
    window.finalYes = function () {
        if (message) {
            message.style.opacity = "0";

            setTimeout(() => {
                message.textContent = "No matter what happens next… I'm grateful it's you. ❤️";
                message.style.opacity = "1";
            }, 300);
        }

        // Launch confetti
        launchConfetti();

        // Redirect after celebration
        setTimeout(() => {
            window.location.href = "forever.html";
        }, 4000);
    };

    // === NO BUTTON (dodge!) ===
    window.finalNo = function () {
        if (!noBtn) return;

        const x = Math.floor(Math.random() * 250) - 125;
        const y = Math.floor(Math.random() * 250) - 125;

        noBtn.style.transform = `translate(${x}px, ${y}px)`;

        if (message) {
            const msgs = [
                "Are you sure? 😌",
                "Pakka? 🥺",
                "Ek baar soch lo… 💭",
                "You can't escape this easily 😂💖",
                "Try again 😏"
            ];
            message.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        }
    };

    // === CONFETTI SYSTEM ===
    function launchConfetti() {
        if (!confettiCanvas) return;

        const ctx = confettiCanvas.getContext("2d");
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const confetti = [];
        const colors = [
            "#ff4b91", "#ff7fa5", "#ff99ac", "#7f00ff",
            "#ffd700", "#ff6b6b", "#48dbfb", "#ff9ff3"
        ];

        for (let i = 0; i < 150; i++) {
            confetti.push({
                x: Math.random() * confettiCanvas.width,
                y: -20 - Math.random() * 200,
                w: Math.random() * 10 + 4,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 4,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        let frame = 0;
        const maxFrames = 180;

        function animate() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

            confetti.forEach(c => {
                c.y += c.speedY;
                c.x += c.speedX;
                c.rotation += c.rotSpeed;
                
                if (frame > maxFrames - 60) {
                    c.opacity = Math.max(0, c.opacity - 0.02);
                }

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate((c.rotation * Math.PI) / 180);
                ctx.globalAlpha = c.opacity;
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                ctx.restore();
            });

            frame++;
            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

});
