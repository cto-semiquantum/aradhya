/* ==========================================
   ABOUT HARSH — INTERACTIVE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Flip card interactions
    const flipBoxes = document.querySelectorAll('.flip-box');
    flipBoxes.forEach(box => {
        box.addEventListener('click', () => {
            box.classList.toggle('flipped');
        });
    });

    // 2. Devotion live counter
    const devotionCounter = document.getElementById('devotionDays');
    if (devotionCounter) {
        const start = new Date("2026-05-22T22:45:00");
        function updateCounter() {
            const now = new Date();
            const diff = now - start;
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                devotionCounter.textContent = `${days}+ Days`;
            }
        }
        updateCounter();
        setInterval(updateCounter, 60000);
    }

});
