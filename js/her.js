/* ==========================================
   ABOUT ARADHYA — INTERACTIVE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Polaroid Flip Cards
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    polaroidCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // 2. Star Memories Array
    const starMemories = [
        "✨ Wo pehli baar jab tumne muskura kar dekha tha...",
        "🌟 Late night late chats aur tumhare pyaare voice notes...",
        "⭐ Tumhare saath bitaye har ek pal me ek ajeeb sa sukoon tha...",
        "💫 Jab tum thoda naraz ho jaati thi aur phir maan jaati thi...",
        "✨ Tumhari wo masoom si baatein jo hamesha dil me rehti hain..."
    ];

    const starBtns = document.querySelectorAll('.star-btn');
    const starMemoryText = document.getElementById('starMemoryText');

    starBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Remove active from all
            starBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Fade animation
            if (starMemoryText) {
                starMemoryText.style.opacity = '0';
                setTimeout(() => {
                    starMemoryText.textContent = starMemories[index % starMemories.length];
                    starMemoryText.style.opacity = '1';
                }, 200);
            }
        });
    });
});
