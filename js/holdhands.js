/* ==========================================
   HOLD MY HAND & DIGITAL TOUCH SCRIPT
   Haptic Vibrate, Web Audio Heartbeat & Dual-Touch
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    // Heartbeat Sound Synthesizer (Lub-Dub)
    function playHeartbeatSound() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;

            // Lub (low bass)
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(75, now);
            osc1.frequency.exponentialRampToValueAtTime(45, now + 0.12);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.15);

            // Dub (slightly higher punch shortly after)
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(95, now + 0.18);
            osc2.frequency.exponentialRampToValueAtTime(50, now + 0.32);
            gain2.gain.setValueAtTime(0.35, now + 0.18);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(now + 0.18);
            osc2.stop(now + 0.35);
        } catch(e) {}
    }

    const quotes = [
        "Faasle chahe kitne bhi hon... is pal hamari ungliyan ek dusre ko chhoo rahi hain. ✨",
        "Jab bhi akelapan lage, bas apna angutha yahan rakh dena... Harsh hamesha tumhara haath thaame khada hai. 🤝",
        "104 dino ki khamoshi bhi is connection ko mita nahi saki. ❤️",
        "Tumhara sookha sa 'hii' bhi chalega... bas tumhara saath mehsoos hona chahiye. 🥺",
        "Mera dil har ek pal sirf tumhare liye hi dhadakta hai. 💓",
        "Duniya me koi bhi aaye ya jaaye, main hamesha tumhara hi rahunga. 💍"
    ];

    let isHolding = false;
    let holdSeconds = 0;
    let holdTimer = null;
    let pulseInterval = null;
    let quoteIndex = 0;

    const btn = document.getElementById('fingerprintBtn');
    const timerDigits = document.getElementById('timerDigits');
    const holdQuote = document.getElementById('holdQuote');
    const touchRipples = document.getElementById('touchRipples');

    function startHolding(e) {
        if (e && e.cancelable) e.preventDefault();
        if (isHolding) return;
        isHolding = true;

        btn.classList.add('holding');
        if (touchRipples) touchRipples.style.display = 'block';

        // Immediate beat
        playHeartbeatSound();
        if (navigator.vibrate) navigator.vibrate([60, 100, 60]);

        // Timer
        holdSeconds = 0;
        timerDigits.textContent = "00:00";
        holdTimer = setInterval(() => {
            holdSeconds++;
            const mins = String(Math.floor(holdSeconds / 60)).padStart(2, '0');
            const secs = String(holdSeconds % 60).padStart(2, '0');
            timerDigits.textContent = `${mins}:${secs}`;

            // Rotate quotes every 4s
            if (holdSeconds % 4 === 0) {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                holdQuote.style.opacity = '0';
                setTimeout(() => {
                    holdQuote.textContent = `"${quotes[quoteIndex]}"`;
                    holdQuote.style.opacity = '1';
                }, 300);
            }
        }, 1000);

        // Continuous pulse every 1.1s (70 BPM)
        pulseInterval = setInterval(() => {
            if (!isHolding) return;
            playHeartbeatSound();
            if (navigator.vibrate) navigator.vibrate([50, 80, 50]);
        }, 1100);

        // Send cloud pulse
        try {
            fetch("https://ntfy.sh/harsh_diary_cloud_sync_411", {
                method: "POST",
                body: JSON.stringify({
                    event: "hand_hold",
                    text: "Someone is holding hands across the screen right now 🤝💖",
                    time: new Date().toISOString()
                }),
                headers: { "Title": "🤝 Hand Touch Active" }
            }).catch(() => {});
        } catch(e) {}
    }

    function stopHolding() {
        if (!isHolding) return;
        isHolding = false;

        btn.classList.remove('holding');
        if (touchRipples) touchRipples.style.display = 'none';

        clearInterval(holdTimer);
        clearInterval(pulseInterval);

        if (holdSeconds > 2) {
            holdQuote.textContent = `"Aapne ${holdSeconds} seconds tak haath pakad kar rakha... Sukoon mila. 🕊️"`;
        } else {
            holdQuote.textContent = `"Screen par angutha hold karke rakhein haath pakadne ke liye..."`;
        }
    }

    if (btn) {
        // Touch events
        btn.addEventListener('touchstart', startHolding, { passive: false });
        btn.addEventListener('touchend', stopHolding);
        btn.addEventListener('touchcancel', stopHolding);

        // Mouse events
        btn.addEventListener('mousedown', startHolding);
        window.addEventListener('mouseup', stopHolding);
    }

    // Fullscreen Hug Feature
    const hugBtn = document.getElementById('sendHugBtn');
    const hugOverlay = document.getElementById('hugOverlay');

    if (hugBtn && hugOverlay) {
        hugBtn.addEventListener('click', () => {
            hugOverlay.classList.add('active');
            if (navigator.vibrate) navigator.vibrate([100, 100, 100, 100, 200]);
            playHeartbeatSound();

            setTimeout(() => {
                hugOverlay.classList.remove('active');
            }, 4500);
        });

        hugOverlay.addEventListener('click', () => {
            hugOverlay.classList.remove('active');
        });
    }

});
