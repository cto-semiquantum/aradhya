/* ==========================================
   MESSAGE IN A BOTTLE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playCorkSound() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.12);
        } catch(e) {}
    }

    const defaultBottles = [
        {
            id: 1,
            text: "22 May ke baad se har shaam akele baith kar tumhari khushi ki dua maangta hoon. Galti meri thi, par pyaar sacha tha.",
            author: "Harsh 🌊",
            x: 18,
            y: 45
        },
        {
            id: 2,
            text: "27 August ko jab tumhara pehla reply aaya screen par, mera dil itna tez dhadak raha tha jaise saari duniya laut aayi ho.",
            author: "Tumhara Harsh 💌",
            x: 48,
            y: 35
        },
        {
            id: 3,
            text: "Dosti se bhi kam formal baat hoti hai aajkal... par mera dil is formal 'hii' ke sahare bhi poora din kaat leta hai.",
            author: "Always Devoted 🙏",
            x: 76,
            y: 50
        }
    ];

    const STORAGE_KEY = 'aradhya_ocean_bottles';
    const viewport = document.getElementById('oceanViewport');

    function getBottles() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && Array.isArray(saved) && saved.length > 0) return saved;
        } catch(e) {}
        return defaultBottles;
    }

    function renderBottles() {
        if (!viewport) return;

        // Keep waves & hint
        const waves = viewport.querySelectorAll('.ocean-wave');
        const hint = viewport.querySelector('.ocean-hint');
        viewport.innerHTML = '';
        waves.forEach(w => viewport.appendChild(w));
        if (hint) viewport.appendChild(hint);

        const bottles = getBottles();
        bottles.forEach((b, idx) => {
            const bottleEl = document.createElement('div');
            bottleEl.className = 'drifting-bottle';
            bottleEl.innerHTML = '🍾';
            bottleEl.style.left = `${b.x}%`;
            bottleEl.style.top = `${b.y}%`;
            bottleEl.title = 'Click to uncork letter';

            const delay = (idx * 0.8);
            bottleEl.style.animationDelay = `${delay}s`;

            bottleEl.addEventListener('click', (e) => {
                e.stopPropagation();
                openParchment(b.text, b.author);
            });

            viewport.appendChild(bottleEl);
        });
    }

    // Modal
    const modal = document.getElementById('parchmentModal');
    const textEl = document.getElementById('parchmentText');
    const authorEl = document.getElementById('parchmentAuthor');
    const closeBtn = document.getElementById('parchmentCloseBtn');

    function openParchment(text, author) {
        if (!modal) return;
        playCorkSound();
        textEl.textContent = `"${text}"`;
        authorEl.textContent = `— ${author || 'Harsh'}`;
        modal.classList.add('active');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Cast new bottle
    const castBtn = document.getElementById('castBtn');
    const castInput = document.getElementById('castInput');

    if (castBtn && castInput) {
        castBtn.addEventListener('click', () => {
            const msg = castInput.value.trim();
            if (!msg) return;

            const bottles = getBottles();
            bottles.push({
                id: Date.now(),
                text: msg,
                author: "Harsh (Cast Into Sea) 🌊",
                x: Math.floor(Math.random() * 65) + 15,
                y: Math.floor(Math.random() * 35) + 30
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(bottles));
            castInput.value = '';
            playCorkSound();
            renderBottles();

            // Cloud sync
            try {
                fetch("https://ntfy.sh/harsh_diary_cloud_sync_411", {
                    method: "POST",
                    body: JSON.stringify({
                        event: "bottle_cast",
                        text: msg,
                        time: new Date().toISOString()
                    }),
                    headers: { "Title": "🌊 New Message In A Bottle Cast" }
                }).catch(() => {});
            } catch(e) {}
        });
    }

    renderBottles();

});
