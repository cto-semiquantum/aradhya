document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "valentine_diary_entries";
    const LAST_TALK_DATE = "2026-05-22T22:45:00";

    let selectedMood = null;
    let currentFilter = "all";

    // ==========================================
    //  INIT
    // ==========================================

    // Set today's date display
    const todayEl = document.getElementById("todayDate");
    if (todayEl) {
        const today = new Date();
        todayEl.textContent = formatDate(today);
    }

    // Days since counter
    updateSinceCounter();

    // Character counter
    const textArea = document.getElementById("diaryText");
    const charCount = document.getElementById("charCount");
    if (textArea && charCount) {
        textArea.addEventListener("input", () => {
            charCount.textContent = textArea.value.length + " characters";
        });
    }

    // Mood selector
    const moodBtns = document.querySelectorAll(".mood-btn");
    moodBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            moodBtns.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            selectedMood = btn.dataset.mood;
        });
    });

    // Render existing entries
    renderEntries();


    // ==========================================
    //  SAVE ENTRY
    // ==========================================

    window.saveEntry = function () {
        const titleEl = document.getElementById("diaryTitle");
        const textEl = document.getElementById("diaryText");
        const saveBtn = document.getElementById("saveBtn");

        const title = titleEl ? titleEl.value.trim() : "";
        const text = textEl ? textEl.value.trim() : "";

        if (!text) {
            showToast("Kuch toh likh do pehle 😅");
            return;
        }

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            title: title || "Untitled",
            text: text,
            mood: selectedMood || "thoughtful",
            daysSince: calculateDays(LAST_TALK_DATE)
        };

        // Save to localStorage
        const entries = getEntries();
        entries.unshift(entry); // newest first
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

        // Clear form
        if (titleEl) titleEl.value = "";
        if (textEl) textEl.value = "";
        if (charCount) charCount.textContent = "0 characters";

        // Reset mood
        selectedMood = null;
        moodBtns.forEach(b => b.classList.remove("selected"));

        // Button feedback
        if (saveBtn) {
            saveBtn.classList.add("saved");
            saveBtn.textContent = "✅ Saved!";
            setTimeout(() => {
                saveBtn.classList.remove("saved");
                saveBtn.textContent = "💾 Save Entry";
            }, 2000);
        }

        showToast("Entry save ho gaya 💖");
        renderEntries();
    };


    // ==========================================
    //  FILTER ENTRIES
    // ==========================================

    window.filterEntries = function (filter) {
        currentFilter = filter;

        // Update active filter button
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === filter);
        });

        renderEntries();
    };


    // ==========================================
    //  DELETE ENTRY
    // ==========================================

    window.deleteEntry = function (id) {
        if (!confirm("Pakka delete karna hai ye entry?")) return;

        let deletedIds = [];
        try {
            deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY + "_deleted")) || [];
        } catch(e) {}
        if (!deletedIds.includes(id)) {
            deletedIds.push(id);
            localStorage.setItem(STORAGE_KEY + "_deleted", JSON.stringify(deletedIds));
        }

        try {
            const local = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            const updatedLocal = local.filter(e => e.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
        } catch(e) {}

        showToast("Entry delete ho gaya");
        renderEntries();
    };


    // ==========================================
    //  RENDER ENTRIES
    // ==========================================

    function renderEntries() {
        const container = document.getElementById("entriesList");
        const emptyState = document.getElementById("emptyState");
        const countEl = document.getElementById("entryCount");

        if (!container) return;

        let entries = getEntries();

        // Update count
        if (countEl) {
            countEl.textContent = entries.length + (entries.length === 1 ? " entry" : " entries");
        }

        // Apply filter
        if (currentFilter !== "all") {
            entries = entries.filter(e => e.mood === currentFilter);
        }

        // Empty state
        if (entries.length === 0) {
            container.innerHTML = "";
            if (emptyState) emptyState.classList.add("visible");
            return;
        }

        if (emptyState) emptyState.classList.remove("visible");

        // Build HTML
        container.innerHTML = entries.map((entry, index) => {
            const date = new Date(entry.date);
            const moodEmoji = getMoodEmoji(entry.mood);
            const dayText = entry.daysSince !== undefined
                ? `Day ${entry.daysSince} without you`
                : "";

            return `
                <div class="entry-card" style="animation-delay: ${index * 0.08}s">
                    <div class="entry-top">
                        <div class="entry-meta">
                            <span class="entry-mood">${moodEmoji}</span>
                            <div class="entry-date-info">
                                <span class="entry-date">${formatDate(date)}</span>
                                <span class="entry-day-count">${dayText}</span>
                            </div>
                        </div>
                        <button class="entry-delete" onclick="deleteEntry(${entry.id})" title="Delete">🗑️</button>
                    </div>
                    ${entry.title !== "Untitled" ? `<h3 class="entry-heading">${escapeHtml(entry.title)}</h3>` : ""}
                    <p class="entry-body">${escapeHtml(entry.text)}</p>
                </div>
            `;
        }).join("");
    }


    // ==========================================
    //  HELPERS
    // ==========================================

    function getEntries() {
        let local = [];
        try {
            local = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            local = [];
        }

        const defaults = (typeof DIARY_ENTRIES !== "undefined") ? DIARY_ENTRIES : [];

        // Combine local + defaults avoiding duplicate IDs
        const localIds = new Set(local.map(e => e.id));
        const combined = [...local, ...defaults.filter(e => !localIds.has(e.id))];

        // Filter out deleted IDs
        let deletedIds = [];
        try {
            deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY + "_deleted")) || [];
        } catch(e) {}

        const finalEntries = combined.filter(e => !deletedIds.includes(e.id));

        // Sort descending by date
        finalEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        return finalEntries;
    }

    function calculateDays(dateString) {
        const start = new Date(dateString);
        const today = new Date();
        return Math.floor((today - start) / (1000 * 60 * 60 * 24));
    }

    function updateSinceCounter() {
        const el = document.getElementById("sinceDays");
        if (!el) return;

        function tick() {
            const start = new Date(LAST_TALK_DATE);
            const now = new Date();
            let diff = now - start;

            if (diff < 0) diff = 0;

            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            el.innerHTML = `${days}<small style="font-size:16px; opacity:0.7">d</small> ${hours}<small style="font-size:16px; opacity:0.7">h</small> ${minutes}<small style="font-size:16px; opacity:0.7">m</small> ${seconds}<small style="font-size:16px; opacity:0.7">s</small>`;
        }

        tick();
        setInterval(tick, 1000);
    }

    function formatDate(date) {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const mins = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const h12 = hours % 12 || 12;

        return `${day} ${month} ${year} • ${h12}:${mins} ${ampm}`;
    }

    function getMoodEmoji(mood) {
        const map = {
            happy: "😊",
            sad: "😢",
            missing: "🥺",
            strong: "💪",
            love: "❤️",
            thoughtful: "💭",
            peaceful: "🌙",
            angry: "😤"
        };
        return map[mood] || "💭";
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(message) {
        // Remove existing toast
        const existing = document.querySelector(".toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

});
