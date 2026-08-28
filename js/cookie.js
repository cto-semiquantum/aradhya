/* ==========================================
   DAILY LOVE COOKIE JS
   New Secret Note Every Day at 12:00 AM
   ========================================== */

(function () {
    const MESSAGES = [
        "Aradhya, tumhari ek muskaan mere sabse bure din ko bhi roshan kar sakti hai. Hamesha muskuraati rehna! 🌸",
        "Duniya chahe kitni bhi badi ho, mera dil sirf tumhare paas aakar shant hota hai. ❤️",
        "Tum mere liye sirf ek pasand nahi, meri aadat aur mera sabse pyaara khwaab ho. ✨",
        "Jab bhi aakhein band karta hoon, sabse pehla chehra tumhara hota hai. You are my true peace. 🥺",
        "Log luck me vishwas karte hain, par mera sabse bada luck tumse milna tha. 💖",
        "Chahe kitni bhi doori ho, tumhara har ek thought mere dil ke sabse kareeb rehta hai. 🌙",
        "Tumhari awaz me wo sukoon hai jo duniya ke kisi music me nahi. 🎵",
        "Har subah ye jaan kar acchi lagti hai ki iss duniya me ek tum ho jo meri life ka sabse khoobsurat hissa ho. ☀️",
        "Kal bhi tumhara tha, aaj bhi tumhara hoon, aur aane wale har kal me sirf tumhara rahunga. 💕",
        "Agar mere paas ek wish hoti, toh main har roz tumhare chehre par ek nayi smile laane ki wish mangta. 🌠",
        "Tumhe yaad karne ke liye kisi wajah ki zaroorat nahi hoti, tum meri har saans me shamil ho. 🌸",
        "Never forget how truly precious and special you are to me, Aradhya. Always proud of you! 💪✨"
    ];

    function getTodayKey() {
        const now = new Date();
        return `cookie_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
    }

    function getTodayMessageIndex() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear % MESSAGES.length;
    }

    window.crackCookie = function () {
        const cookieEl = document.getElementById("cookieEmoji");
        const scrollBox = document.getElementById("scrollBox");
        const messageEl = document.getElementById("cookieMessage");
        const hintEl = document.getElementById("cookieHint");
        const countdownBox = document.getElementById("countdownBox");

        if (cookieEl) {
            cookieEl.textContent = "✨🥠✨";
            cookieEl.style.transform = "scale(1.3)";
        }

        const msg = MESSAGES[getTodayMessageIndex()];
        if (messageEl) messageEl.textContent = `“${msg}”`;
        if (scrollBox) scrollBox.style.display = "block";
        if (hintEl) hintEl.textContent = "✨ Today's Fortune Unlocked ✨";
        if (countdownBox) countdownBox.style.display = "inline-flex";

        localStorage.setItem(getTodayKey(), "opened");
        if (window.triggerHeartbeat) window.triggerHeartbeat();
    };

    function startCountdownTimer() {
        const timerEl = document.getElementById("countdownTimer");
        if (!timerEl) return;

        function updateTimer() {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const diff = tomorrow - now;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            timerEl.textContent = `${hours}h ${mins}m ${secs}s`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    document.addEventListener("DOMContentLoaded", () => {
        startCountdownTimer();
        const isOpened = localStorage.getItem(getTodayKey());
        if (isOpened) {
            window.crackCookie();
        }
    });
})();
