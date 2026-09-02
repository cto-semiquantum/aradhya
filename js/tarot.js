/* ==========================================
   CELESTIAL LOVE TAROT LOGIC
   ========================================== */

(function () {
    const deck = {
        past: [
            { title: "The Star of Healing", sub: "Lesson of 22 May", icon: "🕊️", desc: "Mistakes teach what true value is. The harsh storm transformed into a deep, sacred remorse and gentle maturity.", key: "Redemption & Grace" },
            { title: "The First Spark", sub: "The Genesis", icon: "✨", desc: "A simple text message that sparked a whole constellation. The universe arranged our meeting for a purpose.", key: "Destined Beginnings" }
        ],
        present: [
            { title: "The 104-Day Devotion", sub: "Quiet Strength", icon: "⏳", desc: "Day and night written honestly without looking away. Even in long silence, love did not diminish — it grew roots.", key: "Unconditional Patience" },
            { title: "The Loyal Knight", sub: "Harsh's Vow", icon: "🛡️", desc: "Protection, self-improvement, and sacred boundaries. Working daily to become the protector Aru deserves.", key: "Loyalty & Shield" }
        ],
        destiny: [
            { title: "Table #0411 Forever", sub: "The Sanctuary", icon: "☕", desc: "Hot chocolate with extra marshmallows and laughter. Two souls sitting peacefully with zero regrets.", key: "Sanctuary Reclaimed" },
            { title: "The Eternal Lovers", sub: "04.11 Sacred Bond", icon: "💖", desc: "Kal bhi tera, aaj bhi tera, aur aakhri saans tak sirf tera. A bond that distance and time cannot break.", key: "Forever & Beyond" }
        ]
    };

    let revealedCount = 0;

    window.revealTarotCard = function (pos, el) {
        if (el.classList.contains('is-revealed')) return;

        const options = deck[pos];
        const cardData = options[Math.floor(Math.random() * options.length)];

        const iconEl = el.querySelector('.card-archetype-icon');
        const titleEl = el.querySelector('.card-archetype-title');
        const subEl = el.querySelector('.card-archetype-sub');
        const descEl = el.querySelector('.card-archetype-desc');
        const keyEl = el.querySelector('.card-sacred-key');

        if (iconEl) iconEl.textContent = cardData.icon;
        if (titleEl) titleEl.textContent = cardData.title;
        if (subEl) subEl.textContent = cardData.sub;
        if (descEl) descEl.textContent = `"${cardData.desc}"`;
        if (keyEl) keyEl.textContent = `Key: ${cardData.key}`;

        el.classList.add('is-revealed');
        revealedCount++;

        if (navigator.vibrate) navigator.vibrate(40);

        if (revealedCount === 3 && window.confetti) {
            setTimeout(() => {
                window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            }, 500);
        }
    };

    window.resetTarotReading = function () {
        revealedCount = 0;
        document.querySelectorAll('.tarot-card').forEach(c => c.classList.remove('is-revealed'));
    };
})();
