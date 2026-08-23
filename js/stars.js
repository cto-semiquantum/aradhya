/* ==========================================
   SHOOTING STAR WISH GENERATOR & SHAYARI TOAST SYSTEM
   - Clicking/tapping creates glowing shooting stars
   - Displays romantic Shayari toasts on screen
   ========================================== */

(function () {

    const SHAYARIS = [
        "Tere bina jeena seekha nahi… aur seekhna chahta bhi nahi. 💖",
        "Tu muskura de ek baar… mera poora din ban jata hai. ✨",
        "Mera har ek din tumse shuru aur tum par hi khatam hota hai. 🌸",
        "Chahe kitni bhi dooriyan ho, dil ke sabse kareeb tum hi ho. 💍",
        "Move on karna aasan hota toh kabka kar leta… par tu meri aakhri khwahish hai. 💔",
        "Tumhari ek jhalak hi kafi hai mere saare gham bhulane ke liye. 🌹",
        "Log kehte hain waqt sab kuch bhula deta hai… par mera waqt tum par hi thehra hai. ⏳",
        "Tum mere liye wo ho jise khone ka darr hamesha rehta hai. 💕"
    ];

    let shayariIndex = 0;

    document.addEventListener("DOMContentLoaded", function () {
        initShootingStars();
    });

    function initShootingStars() {
        // Double click or shift-click anywhere triggers a wish
        document.addEventListener("dblclick", function (e) {
            spawnWishStar(e.clientX, e.clientY);
        });
    }

    window.makeWish = function (e) {
        const x = e ? e.clientX : window.innerWidth / 2;
        const y = e ? e.clientY : window.innerHeight / 3;
        spawnWishStar(x, y);
    };

    function spawnWishStar(x, y) {
        // Play heartbeat sound if available
        if (window.triggerHeartbeat) window.triggerHeartbeat();

        // Create shooting star element
        const star = document.createElement("div");
        star.className = "shooting-star-streak";
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        document.body.appendChild(star);

        setTimeout(() => star.remove(), 1200);

        // Show Toast
        showShayariToast(SHAYARIS[shayariIndex % SHAYARIS.length]);
        shayariIndex++;
    }

    function showShayariToast(text) {
        let toast = document.getElementById("shayariToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "shayariToast";
            toast.className = "shayari-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = text;
        toast.classList.add("show");

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }

})();
