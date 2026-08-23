/* ==========================================
   CONSTELLATION SKY — 60FPS SMOOTH CANVAS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('skyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Star field
    const numStars = 140;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }

    // Touch/Mouse Stardust particles
    const stardust = [];

    function addStardust(x, y) {
        for (let i = 0; i < 3; i++) {
            stardust.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: 1.0,
                color: Math.random() > 0.5 ? '#ff4b91' : '#7f00ff',
                radius: Math.random() * 2 + 1
            });
        }
    }

    function handleMove(e) {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        addStardust(x, y);
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });

    // Constellation Heart Points
    function drawConstellation() {
        const cx = width / 2;
        const cy = height / 2 + 30;
        const scale = Math.min(width, height) * 0.008;

        const points = [];
        for (let t = 0; t < Math.PI * 2; t += 0.25) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            points.push({ x: cx + x * scale, y: cy + y * scale });
        }

        // Draw glowing lines connecting points
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 75, 145, 0.45)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < points.length; i++) {
            const next = points[(i + 1) % points.length];
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(next.x, next.y);
        }
        ctx.stroke();

        // Draw glowing nodes
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ff4b91';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Center Text
        ctx.font = '24px "Dancing Script", cursive';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff4b91';
        ctx.shadowBlur = 12;
        ctx.fillText('Harsh  ❤️  Aradhya', cx, cy + 8);
        ctx.shadowBlur = 0;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw background twinkling stars
        stars.forEach(s => {
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
            ctx.fill();
        });

        // Draw constellation
        drawConstellation();

        // Draw & update stardust particles
        for (let i = stardust.length - 1; i >= 0; i--) {
            const p = stardust[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.025;

            if (p.life <= 0) {
                stardust.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        requestAnimationFrame(animate);
    }

    animate();
});
