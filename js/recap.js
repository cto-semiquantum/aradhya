/* ==========================================
   MY 2026 RECAP & TIME MACHINE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    function getMergedEntries() {
        let local = [];
        try {
            local = JSON.parse(localStorage.getItem("valentine_diary_entries")) || [];
        } catch (e) {
            local = [];
        }
        const defaults = (typeof DIARY_ENTRIES !== 'undefined') ? DIARY_ENTRIES : [];
        const localIds = new Set(local.map(e => e.id));
        const combined = [...local, ...defaults.filter(e => !localIds.has(e.id))];

        let deletedIds = [];
        try {
            deletedIds = JSON.parse(localStorage.getItem("valentine_diary_entries_deleted")) || [];
        } catch(e) {}

        return combined.filter(e => !deletedIds.includes(e.id));
    }

    const entries = getMergedEntries();

    // 1. Compute Stats Dynamically
    const totalEntriesEl = document.getElementById('statTotalEntries');
    const totalStreakEl = document.getElementById('statStreak');
    const topMoodEl = document.getElementById('statTopMood');

    if (totalEntriesEl) totalEntriesEl.textContent = entries.length;
    if (totalStreakEl) totalStreakEl.textContent = entries.length + " Days";

    // Mood count
    const moodCounts = {};
    entries.forEach(e => {
        if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });

    let topMood = 'love';
    let maxCount = 0;
    for (let m in moodCounts) {
        if (moodCounts[m] > maxCount) {
            maxCount = moodCounts[m];
            topMood = m;
        }
    }

    const moodEmojiMap = {
        love: '❤️ Love',
        missing: '🥺 Missing',
        sad: '😢 Sad',
        thoughtful: '💭 Devoted',
        peaceful: '🌙 Peaceful',
        strong: '💪 Strong'
    };

    if (topMoodEl) topMoodEl.textContent = moodEmojiMap[topMood] || '❤️ Love';

    // 2. Take Me Back Random Memory Machine
    const memDate = document.getElementById('memDate');
    const memText = document.getElementById('memText');
    const takeMeBackBtn = document.getElementById('takeMeBackBtn');

    function getRandomMemory() {
        if (!entries || entries.length === 0) return;
        const randIdx = Math.floor(Math.random() * entries.length);
        const item = entries[randIdx];

        if (memDate) memDate.textContent = `📅 ${item.title || 'Memory'} • Day ${item.daysSince !== undefined ? item.daysSince : 'Special'}`;
        if (memText) {
            memText.style.opacity = '0';
            setTimeout(() => {
                memText.textContent = `“${item.text}”`;
                memText.style.opacity = '1';
            }, 180);
        }
    }

    if (takeMeBackBtn) {
        takeMeBackBtn.addEventListener('click', getRandomMemory);
    }

    // Initialize with first random memory
    getRandomMemory();
});
