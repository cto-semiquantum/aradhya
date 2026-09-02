/* ==========================================
   PARIS LOVE LOCK BRIDGE LOGIC
   ========================================== */

(function () {
    const railing = document.getElementById('bridgeRailing');
    const modal = document.getElementById('lockModal');
    const stage = document.querySelector('.bridge-sanctuary');

    const defaultLocks = [
        { id: 1, names: "H ❤️ A", date: "04.11 FOREVER", note: "Tere bina har din adhura hai. Meri pyari Bauniii 🤏🌸", metal: "gold" },
        { id: 2, names: "Harsh & Aru", date: "TABLE #0411", note: "Permanently reserved at Cafe Aru. Hot chocolate forever ☕", metal: "rosegold" },
        { id: 3, names: "Sacred Vow", date: "KAL, AAJ & FOREVER", note: "Main aakhri saans tak tera hi rahunga. No returns allowed ❤️", metal: "crimson" }
    ];

    let userLocks = JSON.parse(localStorage.getItem('paris_love_locks') || '[]');
    let allLocks = [...defaultLocks, ...userLocks];

    // Web Audio Sound FX
    let audioCtx = null;
    function playLockSound() {
        try {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();

            // Metallic Clank
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(450, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        } catch(e) {}
    }

    function playSplashSound() {
        try {
            if (!audioCtx) return;
            const noise = audioCtx.createBufferSource();
            const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioCtx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.4);

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            noise.start();
        } catch(e) {}
    }

    function renderLocks() {
        if (!railing) return;
        railing.innerHTML = '';
        allLocks.forEach(lock => {
            const el = document.createElement('div');
            el.className = 'padlock-item';
            el.onclick = () => showLockNote(lock);

            el.innerHTML = `
                <div class="shackle locked"></div>
                <div class="lock-body ${lock.metal || 'gold'}">
                    <div class="lock-names">${lock.names}</div>
                    <div class="lock-date">${lock.date}</div>
                    <div class="lock-keyhole"></div>
                </div>
            `;
            railing.appendChild(el);
        });
    }

    function showLockNote(lock) {
        alert(`🔒 Engraved Lock Inscription:\n\n"${lock.names}"\n${lock.date}\n\nSecret Message: "${lock.note}" 💖\n(Key was thrown into the River Seine forever)`);
        if (navigator.vibrate) navigator.vibrate(30);
    }

    window.openLockModal = function () {
        if (modal) modal.style.display = 'flex';
    };

    window.closeLockModal = function () {
        if (modal) modal.style.display = 'none';
    };

    window.lockNewPadlock = function () {
        const names = document.getElementById('lockNames')?.value.trim() || 'H ❤️ A';
        const date = document.getElementById('lockDate')?.value.trim() || '04.11 FOREVER';
        const metal = document.getElementById('lockMetal')?.value || 'gold';
        const note = document.getElementById('lockNote')?.value.trim() || 'Unconditional love forever.';

        const newLock = {
            id: Date.now(),
            names,
            date,
            metal,
            note
        };

        userLocks.push(newLock);
        localStorage.setItem('paris_love_locks', JSON.stringify(userLocks));
        allLocks.push(newLock);

        closeLockModal();
        renderLocks();

        // Audio & Visual ceremony
        playLockSound();
        if (navigator.vibrate) navigator.vibrate([80, 40, 100]);

        // Key drops into river
        const key = document.createElement('div');
        key.className = 'falling-key';
        key.textContent = '🗝️';
        key.style.left = '50%';
        key.style.top = '140px';
        stage.appendChild(key);

        setTimeout(() => {
            playSplashSound();
            key.remove();
            if (window.confetti) window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        }, 1400);
    };

    document.addEventListener('DOMContentLoaded', renderLocks);
})();
