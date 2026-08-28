/* ==========================================
   ARADHYA'S DIARY JS
   Realtime Cloud Sync & Push Notifications for Aradhya
   ========================================== */

(function () {
    const STORAGE_KEY = "aradhya_diary_entries_v1";
    const CLOUD_TOPIC = "aradhya_diary_cloud_sync_411";
    const CLOUD_URL = "https://ntfy.sh/" + CLOUD_TOPIC;

    let selectedMood = "🌸 Happy";
    let cachedEntries = [];

    const DEFAULT_ENTRIES = [
        {
            id: "her-seed-1",
            title: "Meri Apni Diary 🌸",
            text: "Harsh, ye jagah mere liye kitni special hai! Yahan main jab bhi jo chahun likh sakti hoon aur jaise hi save karungi, tumhe turant notification mil jayega 💕",
            mood: "🌸 Happy",
            date: "2026-08-28T09:15:00.000Z",
            author: "Aradhya",
            avatar: "assets/images/her1.jpeg",
            likes: 18,
            hugs: 12
        }
    ];

    // Local Storage Helpers
    function getStoredEntries() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch(e) {}
        return [...DEFAULT_ENTRIES];
    }

    function saveStoredEntries(entries) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch(e) {}
    }

    // Format Date
    function formatDate(dateStr) {
        if (!dateStr) return "Today";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Recently";
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // Render Entries
    function renderEntries() {
        const container = document.getElementById("herEntriesList");
        const emptyState = document.getElementById("herEmptyState");
        const countEl = document.getElementById("herEntryCount");

        if (!container) return;

        const sorted = [...cachedEntries].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        if (countEl) {
            countEl.textContent = `${sorted.length} ${sorted.length === 1 ? 'entry' : 'entries'}`;
        }

        if (sorted.length === 0) {
            container.innerHTML = "";
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        container.innerHTML = sorted.map((entry, index) => {
            return `
                <article class="her-entry-card" id="entry-${entry.id}">
                    <div class="her-entry-top">
                        <div class="her-author">
                            <img src="${entry.avatar || 'assets/images/her1.jpeg'}" alt="Aradhya" class="her-avatar">
                            <div>
                                <strong style="color: #fff; font-size: 14px;">${escapeHtml(entry.author || 'Aradhya')} 🌸</strong>
                                <div style="font-size: 11.5px; color: rgba(255,255,255,0.5);">${formatDate(entry.date)}</div>
                            </div>
                        </div>
                        <span class="her-badge" style="margin-bottom: 0; font-size: 11.5px;">${escapeHtml(entry.mood || '🌸 Mood')}</span>
                    </div>

                    ${entry.title ? `<h3 class="her-entry-title">${escapeHtml(entry.title)}</h3>` : ''}
                    <p class="her-entry-body">${escapeHtml(entry.text || '')}</p>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
                        <div style="display: flex; gap: 8px;">
                            <button class="reaction-pill" onclick="window.reactHerDiary('${entry.id}', 'likes', this)">
                                ❤️ <span class="count">${entry.likes || 0}</span>
                            </button>
                            <button class="reaction-pill" onclick="window.reactHerDiary('${entry.id}', 'hugs', this)">
                                🫂 <span class="count">${entry.hugs || 0}</span>
                            </button>
                        </div>
                        <span style="font-size: 11px; color: rgba(255,105,180,0.7);">Synced Online ☁️</span>
                    </div>
                </article>
            `;
        }).join("");
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // Reaction handler
    window.reactHerDiary = function (id, type, btnEl) {
        const item = cachedEntries.find(e => e.id === id);
        if (item) {
            item[type] = (item[type] || 0) + 1;
            saveStoredEntries(cachedEntries);
            const count = btnEl.querySelector('.count');
            if (count) count.textContent = item[type];
            btnEl.classList.add('active');
            if (window.triggerHeartbeat) window.triggerHeartbeat();
            showToast('Reaction sent with love 💕');
        }
    };

    // Save Aradhya's Entry & Broadcast to Harsh
    window.saveHerEntry = async function () {
        const titleEl = document.getElementById("herTitle");
        const textEl = document.getElementById("herText");
        const saveBtn = document.getElementById("herSaveBtn");

        const title = titleEl ? titleEl.value.trim() : "";
        const text = textEl ? textEl.value.trim() : "";

        if (!text) {
            showToast("Aradhya, pehle kuch likho toh 🌸");
            return;
        }

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = "Sending to Harsh... 🚀";
        }

        const newEntry = {
            id: "her-" + Date.now(),
            title: title || "Dil Ki Baat 🌸",
            text: text,
            mood: selectedMood || "🌸 Happy",
            date: new Date().toISOString(),
            author: "Aradhya",
            avatar: "assets/images/her1.jpeg",
            likes: 1,
            hugs: 1
        };

        // 1. Save local
        cachedEntries.unshift(newEntry);
        saveStoredEntries(cachedEntries);
        renderEntries();

        // 2. Broadcast to Cloud Topic & Push Notification
        try {
            const pushTitle = `🌸 Aradhya's Diary: ${newEntry.title}`;
            const pushBody = `${selectedMood}: ${text.slice(0, 100)}...`;

            await fetch(CLOUD_URL, {
                method: "POST",
                body: JSON.stringify(newEntry),
                headers: {
                    "Title": pushTitle,
                    "Priority": "urgent",
                    "Tags": "cherry_blossom,heart",
                    "Click": window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'herdiary.html'
                }
            });
        } catch(err) {
            console.error("Her diary cloud push error", err);
        }

        // Reset form
        if (titleEl) titleEl.value = "";
        if (textEl) textEl.value = "";

        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = "✓ Sent & Saved with Love 💖";
            setTimeout(() => {
                saveBtn.innerHTML = "Save & Send to Harsh 💖";
            }, 3000);
        }

        showToast("🌸 Entry save ho gayi aur Harsh ke phone par notification chala gaya! 💕");
    };

    // Cloud Sync & Realtime Stream
    function initCloudSync() {
        // Fetch past cloud entries
        fetch(CLOUD_URL + "/json?poll=1&since=all")
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split("\n");
                let hasNew = false;
                const localIds = new Set(cachedEntries.map(e => String(e.id)));

                lines.forEach(line => {
                    if (!line) return;
                    try {
                        const data = JSON.parse(line);
                        if (data.event === "message" && data.message) {
                            let parsed = null;
                            try { parsed = JSON.parse(data.message); } catch(e) {}
                            if (parsed && parsed.id && !localIds.has(String(parsed.id))) {
                                cachedEntries.unshift(parsed);
                                localIds.add(String(parsed.id));
                                hasNew = true;
                            }
                        }
                    } catch(e) {}
                });

                if (hasNew) {
                    saveStoredEntries(cachedEntries);
                    renderEntries();
                }
            })
            .catch(err => console.log("Her diary sync notice", err));

        // Realtime SSE listener
        try {
            const es = new EventSource(CLOUD_URL + "/sse");
            es.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === "message" && data.message) {
                        let parsed = null;
                        try { parsed = JSON.parse(data.message); } catch(e) {}
                        if (parsed && parsed.id) {
                            if (!cachedEntries.some(e => String(e.id) === String(parsed.id))) {
                                cachedEntries.unshift(parsed);
                                saveStoredEntries(cachedEntries);
                                renderEntries();
                                showToast(`🌸 Aradhya ne naya page likha: ${parsed.title || ''}`);
                                if (window.triggerHeartbeat) window.triggerHeartbeat();

                                if ('Notification' in window && Notification.permission === 'granted') {
                                    if ('serviceWorker' in navigator) {
                                        navigator.serviceWorker.ready.then(reg => {
                                            reg.showNotification(`🌸 Aradhya's Diary: ${parsed.title || 'Naya Page'}`, {
                                                body: parsed.text ? parsed.text.slice(0, 100) : 'Tap karke padho...',
                                                icon: './assets/images/her1.jpeg'
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch(e) {}
            };
        } catch(e) {}
    }

    function showToast(msg) {
        let toast = document.getElementById('herToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'herToast';
            toast.className = 'live-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // Init on DOM ready
    document.addEventListener("DOMContentLoaded", () => {
        cachedEntries = getStoredEntries();
        renderEntries();
        initCloudSync();

        // Mood select buttons
        const moodBtns = document.querySelectorAll(".her-mood-btn");
        moodBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                moodBtns.forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedMood = btn.dataset.mood;
            });
        });

        // Set today's date
        const dateEl = document.getElementById("herTodayDate");
        if (dateEl) {
            dateEl.textContent = formatDate(new Date().toISOString());
        }
    });
})();
