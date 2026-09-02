/* ==========================================
   ROMANTIC FX INTERACTIVE SCRIPT
   - Stardust Cursor Trail
   - 3D Magnetic Card Tilt
   - Orbiting Stars around Locket
   - Double-tap Heart Fountain Explosion
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. STARDUST CURSOR TRAIL (Throttled for ultra performance)
    let lastDustTime = 0;
    const dustColors = ['#ff4b91', '#ffd166', '#ff7fa5', '#7f00ff', '#ffffff'];

    function createStardust(x, y) {
        const now = Date.now();
        if (now - lastDustTime < 35) return; // ~30 fps cap
        lastDustTime = now;

        const particle = document.createElement("div");
        particle.className = "stardust-particle";
        const size = Math.random() * 7 + 4;
        const color = dustColors[Math.floor(Math.random() * dustColors.length)];

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 700);
    }

    window.addEventListener("mousemove", (e) => {
        createStardust(e.clientX, e.clientY);
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
            createStardust(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // 2. 3D CARD TILT ON HOVER
    const cards = document.querySelectorAll(".app-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        });
    });

    // 3. ORBITING TWINKLE STARS AROUND HERO LOCKET
    const locket = document.querySelector(".hero-locket");
    if (locket) {
        const stars = ['✨', '⭐', '🌟', '💫'];
        stars.forEach((star, idx) => {
            const el = document.createElement("span");
            el.className = "orbit-star";
            el.textContent = star;
            el.style.top = "50%";
            el.style.left = "50%";
            el.style.animationDelay = `${idx * 1.5}s`;
            locket.appendChild(el);
        });
    }

    // 4. HEART FOUNTAIN EXPLOSION (On Double Tap / Global Trigger)
    window.launchHeartFountain = function (originX, originY) {
        const x = originX || window.innerWidth / 2;
        const y = originY || window.innerHeight / 2;
        const emojis = ['💖', '🌸', '✨', '💕', '🎀', '💌', '🌹'];

        for (let i = 0; i < 20; i++) {
            const heart = document.createElement("div");
            heart.className = "fountain-heart";
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const angle = (Math.PI * 2 / 20) * i;
            const velocity = Math.random() * 120 + 70;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 60; // Upward bias
            const rot = (Math.random() - 0.5) * 60;

            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.setProperty('--rot', `${rot}deg`);
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;

            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }
    };

    // Double tap anywhere on screen launches a joyful heart fountain!
    let lastTap = 0;
    document.addEventListener("touchend", (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            const touch = e.changedTouches[0];
            window.launchHeartFountain(touch.clientX, touch.clientY);
        }
        lastTap = currentTime;
    });

    document.addEventListener("dblclick", (e) => {
        window.launchHeartFountain(e.clientX, e.clientY);
    });

});
