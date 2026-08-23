document.addEventListener("DOMContentLoaded", function () {

    function calculateDays(startDate) {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = today - start;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // Animated counter — counts up from 0 to final value
    function animateCounter(element, targetValue, suffix) {
        let current = 0;
        const step = Math.max(1, Math.floor(targetValue / 60));
        const interval = setInterval(() => {
            current += step;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(interval);
            }
            element.textContent = current + suffix;
        }, 25);
    }

    // Real dates
    const metDate = "2024-06-24";
    const bestFriendDate = "2024-09-17";
    const reconnectDate = "2026-02-01";
    const silenceDate = "2026-05-22";

    const metEl = document.getElementById("metDays");
    const bestEl = document.getElementById("bestDays");
    const reconnectEl = document.getElementById("reconnectDays");
    const silenceEl = document.getElementById("silenceDays");

    // Animate with staggered start
    setTimeout(() => {
        if (metEl) animateCounter(metEl, calculateDays(metDate), " Days 💖");
    }, 300);

    setTimeout(() => {
        if (bestEl) animateCounter(bestEl, calculateDays(bestFriendDate), " Days 💍");
    }, 600);

    setTimeout(() => {
        if (reconnectEl) animateCounter(reconnectEl, calculateDays(reconnectDate), " Days ✨");
    }, 900);

    setTimeout(() => {
        if (silenceEl) animateCounter(silenceEl, calculateDays(silenceDate), " Days 💔");
    }, 1200);

});
