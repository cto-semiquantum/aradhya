document.addEventListener("DOMContentLoaded", function () {

    const milestones = [
        { id: "metDays", date: new Date("2024-06-24T00:00:00"), emoji: "💖" },
        { id: "bestDays", date: new Date("2024-09-17T00:00:00"), emoji: "💍" },
        { id: "reconnectDays", date: new Date("2026-02-01T00:00:00"), emoji: "✨" },
        { id: "silenceDays", date: new Date("2026-05-22T22:45:00"), emoji: "💔" }
    ];

    function updateLiveTimers() {
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

    updateLiveTimers();
    setInterval(updateLiveTimers, 1000);

});
