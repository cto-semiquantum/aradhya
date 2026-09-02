/* ==========================================
   UNSAID WORDS & SKY LANTERN SCRIPT
   Interactive Sealed Letters & Realtime Floating Lanterns
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. SOUND SYNTHESIZER (Gentle Web Audio Chime & Unfold)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playChime() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5
            osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.7); // C6

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 1.2);
        } catch (e) {}
    }

    function playUnfoldSound() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) {}
    }

    // 2. INTERACTIVE SEALED CARDS
    const cards = document.querySelectorAll('.sealed-card');
    cards.forEach(card => {
        const preview = card.querySelector('.card-preview');
        preview.addEventListener('click', () => {
            const wasUnsealed = card.classList.contains('unsealed');
            
            // Toggle
            if (!wasUnsealed) {
                card.classList.add('unsealed');
                playUnfoldSound();
                const unreadTag = card.querySelector('.unread-tag');
                if (unreadTag) {
                    unreadTag.textContent = 'Opened 💌';
                    unreadTag.style.background = 'rgba(127, 0, 255, 0.25)';
                    unreadTag.style.borderColor = 'rgba(127, 0, 255, 0.4)';
                }
            } else {
                card.classList.remove('unsealed');
            }
        });
    });

    // 3. SKY LANTERNS SYSTEM
    const LANTERN_STORAGE_KEY = 'aradhya_unsaid_lanterns';
    const skyContainer = document.getElementById('skyCanvasContainer');

    const defaultLanterns = [
        {
            id: 1,
            text: "Kal raat jab tumne 22 May yaad dilaya... mera seena phat gaya tha. Kaash main us din sab theek kar pata.",
            time: "Last night • 1 Sep",
            x: 15,
            y: 35
        },
        {
            id: 2,
            text: "Tumhara wo formal 'hii' dekh kar rota hoon, par fir bhi us ek word ke liye din bhar wait karta hoon.",
            time: "28 Aug",
            x: 42,
            y: 20
        },
        {
            id: 3,
            text: "Main tumse bohot kuch puchna chahta hoon... par darr lagta hai ki tum fir se baat band na kar do.",
            time: "30 Aug",
            x: 72,
            y: 45
        },
        {
            id: 4,
            text: "Chahe hum ajnabi ban jayein ya dosti se bhi kam baatein hon... mera dil sirf aur sirf tumhara hai.",
            time: "2 Sep • Today",
            x: 88,
            y: 22
        }
    ];

    function getLanterns() {
        try {
            const saved = JSON.parse(localStorage.getItem(LANTERN_STORAGE_KEY));
            if (saved && Array.isArray(saved) && saved.length > 0) return saved;
        } catch(e) {}
        return defaultLanterns;
    }

    function renderLanterns() {
        if (!skyContainer) return;

        // Keep instruction element
        const instruction = skyContainer.querySelector('.sky-instructions');
        skyContainer.innerHTML = '';
        if (instruction) skyContainer.appendChild(instruction);

        const lanterns = getLanterns();
        lanterns.forEach((l, idx) => {
            const lanternEl = document.createElement('div');
            lanternEl.className = 'floating-lantern';
            lanternEl.innerHTML = '🏮';
            lanternEl.style.fontSize = `${26 + (idx % 3) * 4}px`;
            lanternEl.style.left = `${l.x}%`;
            lanternEl.style.top = `${l.y}%`;
            lanternEl.title = 'Click to read whisper';

            // Gentle floating keyframe animation inline
            const floatDuration = 4 + (idx % 3);
            const floatDelay = (idx * 0.7);
            lanternEl.style.animation = `gentleFloat ${floatDuration}s infinite ease-in-out ${floatDelay}s alternate`;

            lanternEl.addEventListener('click', (e) => {
                e.stopPropagation();
                openWhisperModal(l.text, l.time);
            });

            skyContainer.appendChild(lanternEl);
        });
    }

    // Modal logic
    const modal = document.getElementById('whisperModal');
    const quoteEl = document.getElementById('whisperQuote');
    const timeEl = document.getElementById('whisperTime');
    const closeBtn = document.getElementById('whisperCloseBtn');

    function openWhisperModal(text, time) {
        if (!modal) return;
        quoteEl.textContent = `"${text}"`;
        timeEl.textContent = `🕊️ Released into the sky: ${time || 'Recently'}`;
        modal.classList.add('active');
        playChime();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // 4. RELEASE NEW LANTERN
    const textarea = document.getElementById('lanternText');
    const releaseBtn = document.getElementById('releaseBtn');
    const quickChips = document.querySelectorAll('.quick-chip');

    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (textarea) {
                textarea.value = chip.dataset.prompt || chip.textContent;
                textarea.focus();
            }
        });
    });

    if (releaseBtn && textarea) {
        releaseBtn.addEventListener('click', () => {
            const content = textarea.value.trim();
            if (!content) {
                showToast("Pehle koi dil ki baat likho… ✍️");
                return;
            }

            const current = getLanterns();
            const newLantern = {
                id: Date.now(),
                text: content,
                time: "Just now",
                x: Math.floor(Math.random() * 75) + 10,
                y: Math.floor(Math.random() * 50) + 15
            };

            current.push(newLantern);
            localStorage.setItem(LANTERN_STORAGE_KEY, JSON.stringify(current));

            // Sound + Visual Toast
            playChime();
            textarea.value = '';
            showToast("🏮 Aapki unsaid baat sitaaron me release ho gayi!");

            // Re-render
            renderLanterns();

            // Cloud sync notification
            try {
                fetch("https://ntfy.sh/harsh_diary_cloud_sync_411", {
                    method: "POST",
                    body: JSON.stringify({
                        event: "lantern",
                        text: content,
                        timestamp: new Date().toISOString()
                    }),
                    headers: { "Title": "🕊️ New Unsaid Lantern Released" }
                }).catch(() => {});
            } catch(e) {}
        });
    }

    function showToast(msg) {
        const toast = document.getElementById('unsaidToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // Add CSS keyframe for floating dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gentleFloat {
            0% { transform: translateY(0) rotate(-2deg); filter: drop-shadow(0 0 6px rgba(255,180,100,0.5)); }
            100% { transform: translateY(-16px) rotate(3deg); filter: drop-shadow(0 0 16px rgba(255,180,100,0.9)); }
        }
    `;
    document.head.appendChild(style);

    renderLanterns();
});
