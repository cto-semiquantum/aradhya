/* ==========================================
   FLOATING ROSE PETALS CANVAS ANIMATION
   - Adds romantic falling rose petals across all pages
   ========================================== */

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        initRosePetals();
    });

    function initRosePetals() {
        if (document.getElementById("petalCanvas")) return;

        const canvas = document.createElement("canvas");
        canvas.id = "petalCanvas";
        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "0";
        document.body.prepend(canvas);

        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", function () {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const PETAL_COUNT = 22;
        const petals = [];

        for (let i = 0; i < PETAL_COUNT; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                size: Math.random() * 8 + 6,
                speedY: Math.random() * 1.2 + 0.6,
                speedX: Math.random() * 0.8 - 0.4,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 1.5 - 0.75,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        function drawPetal(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-p.size, -p.size * 1.5, -p.size * 1.5, p.size, 0, p.size * 1.8);
            ctx.bezierCurveTo(p.size * 1.5, p.size, p.size, -p.size * 1.5, 0, 0);

            const grad = ctx.createLinearGradient(0, -p.size, 0, p.size * 2);
            grad.addColorStop(0, '#ff4b91');
            grad.addColorStop(1, '#7f00ff');

            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) + p.speedX;
                p.rotation += p.rotSpeed;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                drawPetal(p);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }
})();
