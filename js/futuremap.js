/* ==========================================
   FUTURE DREAM MAP & BUCKET LIST LOGIC
   ========================================== */

(function () {
    const grid = document.getElementById('bucketGrid');
    const modal = document.getElementById('addDreamModal');
    let allItems = [];
    let currentFilter = 'all';

    async function loadBucketList() {
        if (!grid) return;
        try {
            const res = await fetch('/api/bucketlist');
            allItems = await res.json();
            renderItems();
            updateCounters();
        } catch (e) {
            console.error('Bucket list load error:', e);
        }
    }

    function updateCounters() {
        const total = allItems.length;
        const completed = allItems.filter(i => i.status === 'completed').length;
        const dreams = allItems.filter(i => i.status === 'dream').length;

        const totalEl = document.getElementById('totalCount');
        const completedEl = document.getElementById('completedCount');
        const dreamsEl = document.getElementById('dreamsCount');

        if (totalEl) totalEl.textContent = total;
        if (completedEl) completedEl.textContent = completed;
        if (dreamsEl) dreamsEl.textContent = dreams;
    }

    function renderItems() {
        if (!grid) return;
        grid.innerHTML = '';

        const filtered = allItems.filter(item => {
            if (currentFilter === 'all') return true;
            return item.status === currentFilter || item.tag.toLowerCase().includes(currentFilter.toLowerCase());
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">No dreams found in this category yet. Add one! ✨</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = `bucket-card ${item.status}`;

            const statusText = item.status === 'completed' ? '❤️ Fulfilled' : item.status === 'in-progress' ? '⏳ In Progress' : '✨ Dream';

            card.innerHTML = `
                <div>
                    <div class="card-tag-row">
                        <span class="item-category-tag">${item.tag}</span>
                        <span class="item-status-tag ${item.status}">${statusText}</span>
                    </div>
                    <h3 class="bucket-title">${item.title}</h3>
                    <p class="bucket-note">"${item.note}"</p>
                </div>
                <div class="bucket-footer">
                    <span>📅 ${item.date}</span>
                    <button class="toggle-status-btn" onclick="cycleStatus(${item.id})">
                        Change Status ↻
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    window.filterDreams = function (filter, btn) {
        currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        renderItems();
    };

    window.cycleStatus = async function (id) {
        const item = allItems.find(i => i.id === id);
        if (!item) return;

        const nextStatus = item.status === 'dream' ? 'in-progress' : item.status === 'in-progress' ? 'completed' : 'dream';

        try {
            const res = await fetch(`/api/bucketlist/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) {
                item.status = nextStatus;
                renderItems();
                updateCounters();
            }
        } catch (e) {
            item.status = nextStatus;
            renderItems();
            updateCounters();
        }
    };

    // Modal Control
    window.openAddDreamModal = function () {
        if (modal) modal.style.display = 'flex';
    };

    window.closeAddDreamModal = function () {
        if (modal) modal.style.display = 'none';
    };

    window.saveNewDream = async function () {
        const title = document.getElementById('dreamTitle')?.value.trim();
        const tag = document.getElementById('dreamTag')?.value || 'Cozy Dates';
        const date = document.getElementById('dreamDate')?.value.trim() || 'Upcoming';
        const note = document.getElementById('dreamNote')?.value.trim() || '';

        if (!title) {
            alert("Please enter a dream or place name! 💖");
            return;
        }

        try {
            const res = await fetch('/api/bucketlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, tag, date, note, status: 'dream' })
            });

            if (res.ok) {
                closeAddDreamModal();
                loadBucketList();
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (window.RealtimeClient) {
        window.RealtimeClient.on('new_bucket_item', (item) => {
            loadBucketList();
        });
        window.RealtimeClient.on('update_bucket_item', (item) => {
            loadBucketList();
        });
    }

    document.addEventListener('DOMContentLoaded', loadBucketList);
})();
