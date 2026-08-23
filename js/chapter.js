/* ==========================================
   MY NEW CHAPTER — SCRIPT & LIFE UPDATES
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'chapter_life_updates';

    const saveBtn = document.getElementById('saveChapterUpdateBtn');
    const updateText = document.getElementById('chapterText');
    const updateBest = document.getElementById('chapterBest');
    const updateLearned = document.getElementById('chapterLearned');
    const updatesContainer = document.getElementById('chapterUpdatesList');

    function getLifeUpdates() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
                {
                    id: 1,
                    date: '23 Aug 2026',
                    text: 'Institute me student class li aur lab project check kiya.',
                    best: 'Student ne code successfully compile karke smiling face ke sath thank you bola.',
                    learned: 'Consistency in teaching makes complex topics so simple.'
                },
                {
                    id: 2,
                    date: '15 Aug 2026',
                    text: 'Institute Independence Day celebration & tech workshop.',
                    best: 'Mentors ke sath upcoming software projects discuss kiye.',
                    learned: 'Stepping into a new environment opens new doors.'
                }
            ];
        } catch (e) {
            return [];
        }
    }

    function renderLifeUpdates() {
        if (!updatesContainer) return;
        const list = getLifeUpdates();

        updatesContainer.innerHTML = list.map(item => `
            <div class="update-item-card">
                <div class="update-item-header">
                    <span class="update-item-date">📅 ${item.date}</span>
                </div>
                <p style="font-size: 14px; color: #fff; margin-bottom: 6px;"><strong>Summary:</strong> ${escapeHtml(item.text)}</p>
                ${item.best ? `<p style="font-size: 13px; color: var(--pink-light); margin-bottom: 4px;"><strong>Best Moment:</strong> ${escapeHtml(item.best)}</p>` : ''}
                ${item.learned ? `<p style="font-size: 13px; color: var(--text-secondary);"><strong>What I Learned:</strong> ${escapeHtml(item.learned)}</p>` : ''}
            </div>
        `).join('');
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const textVal = updateText ? updateText.value.trim() : '';
            const bestVal = updateBest ? updateBest.value.trim() : '';
            const learnedVal = updateLearned ? updateLearned.value.trim() : '';

            if (!textVal) {
                alert('Aaj ka summary likh do pehle! 😊');
                return;
            }

            const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            const newUpdate = {
                id: Date.now(),
                date: todayStr,
                text: textVal,
                best: bestVal,
                learned: learnedVal
            };

            const list = getLifeUpdates();
            list.unshift(newUpdate);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

            if (updateText) updateText.value = '';
            if (updateBest) updateBest.value = '';
            if (updateLearned) updateLearned.value = '';

            renderLifeUpdates();
        });
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    renderLifeUpdates();
});
