/* ==========================================
   LIVE MOOD RING & STATUS SYNC
   Realtime Couple Mood Updates & Push Notifications
   ========================================== */

(function () {
    const MOOD_TOPIC = 'harsh_aradhya_mood_sync_411';
    const NTFY_URL = 'https://ntfy.sh/' + MOOD_TOPIC;
    const STORAGE_KEY = 'couple_mood_status_v1';

    let currentMoods = {
        harsh: { mood: "🥺 Missing you", time: new Date().toISOString() },
        aradhya: { mood: "🌸 Happy", time: new Date().toISOString() }
    };

    function getStoredMoods() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.harsh && parsed.aradhya) return parsed;
            }
        } catch(e) {}
        return currentMoods;
    }

    function saveMoods(moods) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
        } catch(e) {}
    }

    function formatTimeAgo(isoString) {
        if (!isoString) return "Recently";
        const diffMs = Date.now() - new Date(isoString).getTime();
        const mins = Math.floor(diffMs / (1000 * 60));
        const hrs = Math.floor(mins / 60);
        if (mins < 1) return "Just now ⚡";
        if (mins < 60) return `${mins}m ago`;
        if (hrs < 24) return `${hrs}h ago`;
        return "Earlier";
    }

    function renderMoodWidget() {
        const harshVibeEl = document.getElementById("harshVibeText");
        const harshTimeEl = document.getElementById("harshVibeTime");
        const aradhyaVibeEl = document.getElementById("aradhyaVibeText");
        const aradhyaTimeEl = document.getElementById("aradhyaVibeTime");

        if (harshVibeEl) harshVibeEl.textContent = currentMoods.harsh.mood;
        if (harshTimeEl) harshTimeEl.textContent = formatTimeAgo(currentMoods.harsh.time);
        if (aradhyaVibeEl) aradhyaVibeEl.textContent = currentMoods.aradhya.mood;
        if (aradhyaTimeEl) aradhyaTimeEl.textContent = formatTimeAgo(currentMoods.aradhya.time);
    }

    // Update Status Modal Handler
    window.openMoodSelector = function (person) {
        const modal = document.getElementById("moodSelectorModal");
        const targetTitle = document.getElementById("moodModalTitle");
        const moodOptionsContainer = document.getElementById("moodModalOptions");

        if (!modal || !moodOptionsContainer) return;

        modal.dataset.person = person;
        if (targetTitle) {
            targetTitle.textContent = person === 'harsh' ? "Harsh's Current Vibe 🎧" : "Aradhya's Current Vibe 🌸";
        }

        const options = person === 'harsh' ? [
            "🥺 Missing you",
            "🎧 Listening to our song",
            "📚 Working / Coding",
            "💭 Thinking of us",
            "☕ Coffee break",
            "🌙 Late night thoughts",
            "💪 Feeling strong"
        ] : [
            "🌸 Happy & Smiling",
            "🥺 Missing Harsh",
            "☕ Coffee time",
            "😴 Sleepy / Resting",
            "📚 Studying",
            "💭 Thinking of us",
            "💌 Feeling loved"
        ];

        moodOptionsContainer.innerHTML = options.map(opt => `
            <button class="mood-choice-pill" onclick="window.selectMoodChoice('${opt}')">
                ${opt}
            </button>
        `).join("");

        modal.classList.add("active");
    };

    window.closeMoodModal = function () {
        const modal = document.getElementById("moodSelectorModal");
        if (modal) modal.classList.remove("active");
    };

    window.selectMoodChoice = async function (newMood) {
        const modal = document.getElementById("moodSelectorModal");
        const person = (modal && modal.dataset.person) ? modal.dataset.person : 'aradhya';
        const personName = person === 'harsh' ? 'Harsh' : 'Aradhya';

        currentMoods[person] = {
            mood: newMood,
            time: new Date().toISOString()
        };

        saveMoods(currentMoods);
        renderMoodWidget();
        window.closeMoodModal();

        // Push Notification to the other person
        try {
            const pushTitle = `${person === 'harsh' ? '🎧 Harsh' : '🌸 Aradhya'} updated vibe!`;
            const pushBody = `Current Vibe: ${newMood} 💕`;

            await fetch(NTFY_URL, {
                method: "POST",
                body: JSON.stringify({ person, mood: newMood, time: new Date().toISOString() }),
                headers: {
                    "Title": pushTitle,
                    "Priority": "urgent",
                    "Tags": person === 'harsh' ? "headphones,heart" : "cherry_blossom,heart",
                    "Click": window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'index.html'
                }
            });
        } catch(e) {
            console.error("Mood sync push error", e);
        }

        if (window.triggerHeartbeat) window.triggerHeartbeat();
    };

    function fetchMoodHistory() {
        fetch(NTFY_URL + "/json?poll=1&since=all")
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split("\n");
                lines.forEach(line => {
                    if (!line) return;
                    try {
                        const data = JSON.parse(line);
                        if (data.event === "message" && data.message) {
                            const parsed = JSON.parse(data.message);
                            if (parsed.person && parsed.mood) {
                                currentMoods[parsed.person] = {
                                    mood: parsed.mood,
                                    time: parsed.time || new Date().toISOString()
                                };
                            }
                        }
                    } catch(e) {}
                });
                saveMoods(currentMoods);
                renderMoodWidget();
            })
            .catch(err => console.log("Mood sync notice", err));
    }

    // Realtime Stream
    function initMoodStream() {
        fetchMoodHistory();
        setInterval(fetchMoodHistory, 4000);

        try {
            const es = new EventSource(NTFY_URL + "/sse");
            es.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === "message" && data.message) {
                        const parsed = JSON.parse(data.message);
                        if (parsed.person && parsed.mood) {
                            currentMoods[parsed.person] = {
                                mood: parsed.mood,
                                time: parsed.time || new Date().toISOString()
                            };
                            saveMoods(currentMoods);
                            renderMoodWidget();

                            // Show In-App & Push Notification
                            const personName = parsed.person === 'harsh' ? 'Harsh' : 'Aradhya';
                            if ('Notification' in window && Notification.permission === 'granted') {
                                if ('serviceWorker' in navigator) {
                                    navigator.serviceWorker.ready.then(reg => {
                                        reg.showNotification(`💫 ${personName}'s New Vibe`, {
                                            body: `${parsed.mood} 💕`,
                                            icon: './assets/images/her1.jpeg'
                                        });
                                    });
                                }
                            }
                        }
                    }
                } catch(e) {}
            };
        } catch(e) {}
    }

    document.addEventListener("DOMContentLoaded", () => {
        currentMoods = getStoredMoods();
        renderMoodWidget();
        initMoodStream();
    });
})();
