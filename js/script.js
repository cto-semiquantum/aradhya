/* ==========================================
   ENTRY SCREEN
   ========================================== */

window.addEventListener("load", function () {
    const entry = document.getElementById("entryScreen");
    const mainContent = document.getElementById("mainContent");

    if (entry) {
        entry.addEventListener("click", function () {
            entry.classList.add("hiding");
            setTimeout(() => {
                entry.style.display = "none";
                if (mainContent) mainContent.classList.add("visible");
                checkWhatsNewModal();
            }, 1000);
        });
    }
});


/* ==========================================
   FLOATING HEARTS PARTICLE SYSTEM
   ========================================== */

(function () {
    const canvas = document.getElementById("heartCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;

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
            this.size = Math.random() * 14 + 6;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.15 + 0.03;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.hue = Math.random() > 0.5 ? 330 : 280;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.005) * 0.3;
            this.rotation += this.rotationSpeed;

            if (this.y < -30) this.reset();
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Draw heart shape
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

    // Create particles
    for (let i = 0; i < 25; i++) {
        const p = new HeartParticle();
        p.y = Math.random() * canvas.height; // Start scattered
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    animate();
})();


/* ==========================================
   MUSIC
   ========================================== */

let isPlaying = false;

window.toggleMusic = function (event) {
    if (window.toggleGlobalMusic) {
        window.toggleGlobalMusic();
    }
};


/* ==========================================
   LETTER MODAL
   ========================================== */

window.openLetter = function () {
    const modal = document.getElementById("letterModal");
    if (modal) modal.classList.add("active");
};

window.closeLetter = function () {
    const modal = document.getElementById("letterModal");
    if (modal) modal.classList.remove("active");
};


/* ==========================================
   SURPRISE MODAL
   ========================================== */

window.openSurprise = function () {
    const modal = document.getElementById("surpriseModal");
    if (modal) modal.classList.add("active");
};

const teaseMessages = [
    "Aww come on 😌 You know you're curious 💕",
    "You really gonna say no? 🥺",
    "Bas ek baar click karo… promise it's worth it ✨",
    "Okay… I'll wait… but not forever 😂💖"
];
let teaseIndex = 0;

window.tease = function () {
    const msg = document.getElementById("teaseMsg");
    if (msg) {
        msg.textContent = teaseMessages[teaseIndex % teaseMessages.length];
        teaseIndex++;
    }
};

window.goProposal = function () {
    window.location.href = "proposal.html";
};


/* ==========================================
   LOVE COUNTER
   ========================================== */

window.toggleCounter = function () {
    const modal = document.getElementById("counterModal");
    if (!modal) return;

    if (modal.classList.contains("active")) {
        modal.classList.remove("active");
    } else {
        modal.classList.add("active");
        updateCounter();
    }
};

function calculateDays(dateString) {
    const start = new Date(dateString);
    const today = new Date();
    const diff = today - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

let counterInterval = null;

function updateCounter() {
    const milestones = [
        { id: "metDays", date: new Date("2024-06-24T00:00:00"), emoji: "💖" },
        { id: "bestDays", date: new Date("2024-09-17T00:00:00"), emoji: "💍" },
        { id: "reconnectDays", date: new Date("2026-02-01T00:00:00"), emoji: "✨" },
        { id: "silenceDays", date: new Date("2026-05-22T22:45:00"), emoji: "💔" }
    ];

    function updateModalLiveTimers() {
        const now = new Date();

        milestones.forEach(m => {
            const el = document.getElementById(m.id);
            if (!el) return;

            let diff = now - m.date;
            if (diff < 0) diff = 0;

            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            el.innerHTML = `${days}<small style="font-size:15px; opacity:0.7">d</small> ${hours}<small style="font-size:15px; opacity:0.7">h</small> ${minutes}<small style="font-size:15px; opacity:0.7">m</small> ${seconds}<small style="font-size:15px; opacity:0.7">s</small> ${m.emoji}`;
        });
    }

    updateModalLiveTimers();
    if (counterInterval) clearInterval(counterInterval);
    counterInterval = setInterval(updateModalLiveTimers, 1000);
}


window.addEventListener("click", function (e) {
    const modals = ["letterModal", "surpriseModal", "counterModal", "whatsNewModal"];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal && e.target === modal) {
            if (id === "whatsNewModal") localStorage.setItem('aradhya_whats_new_seen_v1', 'true');
            modal.classList.remove("active");
        }
    });
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        const modals = ["letterModal", "surpriseModal", "counterModal", "whatsNewModal"];
        modals.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                if (id === "whatsNewModal") localStorage.setItem('aradhya_whats_new_seen_v1', 'true');
                modal.classList.remove("active");
            }
        });
    }
});

/* ==========================================
   ONE-TIME WHAT'S NEW FEATURE MODAL
   ========================================== */

function checkWhatsNewModal() {
    const hasSeen = localStorage.getItem('aradhya_whats_new_seen_v1');
    if (!hasSeen) {
        setTimeout(() => {
            const modal = document.getElementById('whatsNewModal');
            if (modal) {
                modal.classList.add('active');
                if (window.triggerHeartbeat) window.triggerHeartbeat();
            }
        }, 1200);
    }
}

window.closeWhatsNewModal = function () {
    localStorage.setItem('aradhya_whats_new_seen_v1', 'true');
    const modal = document.getElementById('whatsNewModal');
    if (modal) modal.classList.remove('active');
};

// Check when page loads or becomes visible
window.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("mainContent");
    if (mainContent && (mainContent.classList.contains("visible") || mainContent.style.display !== "none")) {
        checkWhatsNewModal();
    }
});

