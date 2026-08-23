/* ==========================================
   SHARED PARTICLE HEART SYSTEM
   Reused across all pages
   ========================================== */

(function () {
    const canvas = document.getElementById("heartCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    class HeartParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 12 + 5;
            this.speedY = Math.random() * 0.7 + 0.25;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.12 + 0.02;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.015;
            this.hue = Math.random() > 0.5 ? 330 : 280;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.004) * 0.25;
            this.rotation += this.rotationSpeed;
            if (this.y < -30) this.reset();
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            const s = this.size;
            ctx.beginPath();
            ctx.moveTo(0, s * 0.3);
            ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
            ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 1)`;
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }
    }

    for (let i = 0; i < 20; i++) {
        const p = new HeartParticle();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
})();
