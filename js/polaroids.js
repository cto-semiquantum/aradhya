/* ==========================================
   3D FLIP POLAROID MEMORY WALL LOGIC
   ========================================== */

(function () {
    const grid = document.getElementById('polaroidGrid');
    const modal = document.getElementById('addModal');

    async function loadPolaroids() {
        if (!grid) return;
        try {
            const res = await fetch('/api/polaroids');
            const list = await res.json();
            renderPolaroids(list);
        } catch (e) {
            console.error('Polaroids load fallback:', e);
            renderDefaultFallback();
        }
    }

    function renderDefaultFallback() {
        const fallbacks = [
            { id: 1, image: "assets/images/her1.jpeg", caption: "The Most Beautiful Girl in My Universe", date: "04.11 Forever", note: "Teri ek muskaan mere saare din ka stress bhula deti hai. Meri pyari Bauniii 🤏🌸", location: "In My Heart" },
            { id: 2, image: "assets/images/her2.jpeg", caption: "Simplicity & Grace", date: "Pure Devotion", note: "Kitni masoomiyat se hasti hai tu... is hasi ko mehfooz rakhna meri zindagi ka maksad hai.", location: "Soul Connection" },
            { id: 3, image: "assets/images/anime_hero.png", caption: "My Knight & Princess Dream", date: "Love Beyond Limits", note: "Har kahani ka ant sundar hota hai jab tak tum sath ho.", location: "Our Fairytale" },
            { id: 4, image: "assets/images/anime_forever.png", caption: "Under the Infinite Sky", date: "Sacred Vow", note: "Duniya ke fasle chahe jo ho, mera har lamha sirf tera hai.", location: "Eternal Sanctuary" }
        ];
        renderPolaroids(fallbacks);
    }

    function renderPolaroids(list) {
        grid.innerHTML = '';
        list.forEach(p => {
            const wrap = document.createElement('div');
            wrap.className = 'polaroid-item-wrap';

            wrap.innerHTML = `
                <div class="polaroid-card" onclick="flipCard(this)">
                    <!-- FRONT FACE -->
                    <div class="polaroid-face polaroid-front">
                        <div class="polaroid-pin"></div>
                        <div class="polaroid-img-box">
                            <img src="${p.image}" alt="${p.caption}" loading="lazy">
                        </div>
                        <div class="polaroid-meta">
                            <div class="polaroid-caption">${p.caption}</div>
                            <div class="polaroid-date-badge">📍 ${p.location || 'Special Memory'} • ${p.date}</div>
                            <div class="polaroid-flip-hint">Tap to reveal secret note ↺</div>
                        </div>
                    </div>

                    <!-- BACK FACE -->
                    <div class="polaroid-face polaroid-back">
                        <div class="back-stamp">💌</div>
                        <div class="back-note-text">"${p.note}"</div>
                        <div class="back-footer-row">
                            <span>Forever Yours, Harsh</span>
                            <span>Tap to flip ↺</span>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(wrap);
        });
    }

    window.flipCard = function (card) {
        card.classList.toggle('is-flipped');
        if (navigator.vibrate) navigator.vibrate(30);
    };

    // Modal Control
    window.openAddModal = function () {
        if (modal) modal.style.display = 'flex';
    };

    window.closeAddModal = function () {
        if (modal) modal.style.display = 'none';
    };

    window.saveNewPolaroid = async function () {
        const caption = document.getElementById('polCaption')?.value.trim();
        const note = document.getElementById('polNote')?.value.trim();
        const location = document.getElementById('polLocation')?.value.trim() || 'In My Heart';
        const image = document.getElementById('polImage')?.value || 'assets/images/her1.jpeg';

        if (!caption || !note) {
            alert("Please enter both a caption and a heartfelt note! 💖");
            return;
        }

        try {
            const res = await fetch('/api/polaroids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption, note, location, image })
            });

            if (res.ok) {
                closeAddModal();
                loadPolaroids();
            }
        } catch (e) {
            console.error(e);
            alert("Could not save to server right now, but we loaded it locally!");
        }
    };

    if (window.RealtimeClient) {
        window.RealtimeClient.on('new_polaroid', (p) => {
            loadPolaroids();
        });
    }

    document.addEventListener('DOMContentLoaded', loadPolaroids);
})();
