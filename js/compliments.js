/* ==========================================
   DAILY COMPLIMENT JAR & AMBIENT SOUND GENERATOR
   Web Audio API Synthesized Audio (100% Offline)
   ========================================== */

(function () {
    const compliments = [
        "Teri ek muskaan mere saare din ki thakaan aur dard mita deti hai. 🌸",
        "Duniya chahe kitni bhi badal jaye, meri aakhri saans tak mera dil sirf tera rahega. 💖",
        "You make every ordinary moment feel like a scene from a romantic movie.",
        "Aru, jab tu gusse me 'Muh tod dungi' bolti hai na, kasam se tab tu duniya me sabse cute lagti hai! 🤏",
        "Har subah meri pehli dua aur har raat mera aakhri khayal sirf tum ho.",
        "Your eyes hold a warmth that makes me feel like I have finally reached home.",
        "104 din ka intazaar ho ya 104 saal ka, meri wafa me kabhi kami nahi aayegi. 04.11 Forever.",
        "Tu meri zindagi ki woh khushi hai jise main rab se har namaaz/dua me mangta hoon.",
        "Table #0411 par hot chocolate aur tum... isse behtar jannat koi nahi ho sakti. ☕",
        "You are so strong, resilient and capable of achieving every single dream you have.",
        "Tera masoom chehra dekh kar dil ko jo sukoon milta hai, woh lafzon me bayaan nahi ho sakta.",
        "Chahe kitne bhi fasle hon, meri har dua teri hifazat aur teri hasi ke liye hoti hai.",
        "You are my favorite thought to wake up to and my sweetest dream to fall asleep in.",
        "I love how passionate and pure your heart is. Never ever change for anyone.",
        "Meri har shayari, mera har code, meri har koshish sirf teri ek muskurahat ke liye hai. ✨",
        "Tu bauni zaroor hai, par mere dil par tera raj sabse bada hai! 👑",
        "Thank you for existing and being the brightest light in my darkest days.",
        "I promise to always listen, understand, protect, and respect you with my whole being.",
        "Your voice is the melody that calms my racing heartbeat every single time.",
        "No matter what happens, you will never be alone. Harsh is always by your side."
    ];

    const jarWrap = document.getElementById('crystalJar');
    const scrollBox = document.getElementById('scrollBox');
    const noteText = document.getElementById('noteText');

    window.drawLoveNote = function () {
        if (!jarWrap || !scrollBox || !noteText) return;

        jarWrap.classList.add('open');
        if (navigator.vibrate) navigator.vibrate(40);

        setTimeout(() => {
            const randomMsg = compliments[Math.floor(Math.random() * compliments.length)];
            noteText.textContent = `"${randomMsg}"`;
            scrollBox.classList.add('visible');
            jarWrap.classList.remove('open');
        }, 300);
    };

    // ==========================================
    // WEB AUDIO API AMBIENT SOUND GENERATOR
    // ==========================================
    let audioCtx = null;
    let isMasterPlaying = false;

    const soundNodes = {
        rain: { gain: null, source: null, slider: 'rainSlider' },
        fireplace: { gain: null, source: null, slider: 'fireSlider' },
        wind: { gain: null, source: null, slider: 'windSlider' }
    };

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function createPinkNoiseBuffer() {
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11;
            b6 = white * 0.115926;
        }
        return buffer;
    }

    function startRain(gainVal = 0.4) {
        const buffer = createPinkNoiseBuffer();
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = gainVal;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();

        soundNodes.rain.source = noise;
        soundNodes.rain.gain = gainNode;
    }

    function startFireplace(gainVal = 0.3) {
        const buffer = createPinkNoiseBuffer();
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 3.0;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = gainVal;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();

        soundNodes.fireplace.source = noise;
        soundNodes.fireplace.gain = gainNode;
    }

    function startWind(gainVal = 0.25) {
        const buffer = createPinkNoiseBuffer();
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = gainVal;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();

        soundNodes.wind.source = noise;
        soundNodes.wind.gain = gainNode;
    }

    window.toggleSoundscapes = function () {
        initAudioContext();
        const masterBtn = document.getElementById('masterAudioBtn');

        if (!isMasterPlaying) {
            const rainVol = parseFloat(document.getElementById('rainSlider')?.value || 0.4);
            const fireVol = parseFloat(document.getElementById('fireSlider')?.value || 0.3);
            const windVol = parseFloat(document.getElementById('windSlider')?.value || 0.25);

            startRain(rainVol);
            startFireplace(fireVol);
            startWind(windVol);

            isMasterPlaying = true;
            if (masterBtn) {
                masterBtn.textContent = "⏸ Stop Ambient Sounds";
                masterBtn.classList.add('active');
            }
        } else {
            Object.keys(soundNodes).forEach(k => {
                if (soundNodes[k].source) {
                    try { soundNodes[k].source.stop(); } catch(e){}
                    soundNodes[k].source = null;
                }
            });
            isMasterPlaying = false;
            if (masterBtn) {
                masterBtn.textContent = "▶ Start Ambient Ambience";
                masterBtn.classList.remove('active');
            }
        }
    };

    // Sliders
    ['rain', 'fireplace', 'wind'].forEach(key => {
        const slider = document.getElementById(soundNodes[key].slider);
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                if (soundNodes[key].gain && audioCtx) {
                    soundNodes[key].gain.gain.setValueAtTime(val, audioCtx.currentTime);
                }
            });
        }
    });

    // Initial note
    document.addEventListener('DOMContentLoaded', () => {
        window.drawLoveNote();
    });
})();
