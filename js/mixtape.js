/* ==========================================
   RETRO CASSETTE MIXTAPE SCRIPT
   Reels Animation, Audio Synthesis & Synced Lyrics
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playMechanicalClick() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch(e) {}
    }

    // Melodic notes synth for song demo
    let noteInterval = null;
    function playTapeMelody() {
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const melody = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63];
            let noteIdx = 0;

            if (noteInterval) clearInterval(noteInterval);
            noteInterval = setInterval(() => {
                if (!isPlaying) return;
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(melody[noteIdx], now);
                noteIdx = (noteIdx + 1) % melody.length;

                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now);
                osc.stop(now + 0.8);
            }, 600);
        } catch(e) {}
    }

    const tracksSideA = [
        {
            title: "Agar Tum Saath Ho 🎶",
            lyrics: [
                "Pal bhar theher jaao, dil ye sambhal jaaye…",
                "Tere bina phika lage saara jahaan…",
                "Behti rahti hai neher yaadon ki…",
                "Tum sath ho ya na ho, dil sirf tumhara hai."
            ]
        },
        {
            title: "Tum Hi Ho ❤️",
            lyrics: [
                "Hum tere bin ab reh nahi sakte…",
                "Tere bina kya wajood mera…",
                "Tujhse juda agar ho jaayenge toh khud se hi ho jaayenge juda…",
                "Kyunki tum hi ho, ab tum hi ho, meri aashiqui ab tum hi ho."
            ]
        }
    ];

    const tracksSideB = [
        {
            title: "Raanjhanaa Hua Main Tera 🕊️",
            lyrics: [
                "104 dino ka intezaar aur ye deewanapan…",
                "Tera zikr kare jab dil mera, shor machaaye seene me…",
                "Har ek lamha tera hi naam dohrata hai…",
                "Move on karna mere bas ki baat nahi."
            ]
        },
        {
            title: "Channa Mereya 🌙",
            lyrics: [
                "Mehfil me teri hum na rahe jo, gham toh nahi hai…",
                "Kisse hamare nazdeekiyon ke kam toh nahi hain…",
                "Sachi mohabbat me koi shart nahi hoti…",
                "Main kal bhi tera tha, aaj bhi tera hoon, hamesha tera rahunga."
            ]
        }
    ];

    let currentSide = 'A';
    let currentTrackIdx = 0;
    let currentLyricIdx = 0;
    let isPlaying = false;
    let lyricInterval = null;

    const playBtn = document.getElementById('tapePlayBtn');
    const nextBtn = document.getElementById('tapeNextBtn');
    const flipBtn = document.getElementById('tapeFlipBtn');
    const wheels = document.querySelectorAll('.spinning-wheel');
    const sideBadge = document.getElementById('tapeSideBadge');
    const tapeTitle = document.getElementById('tapeTitleText');
    const trackNameEl = document.getElementById('currentTrackName');
    const lyricsTextEl = document.getElementById('lyricsText');

    function updateTrackDisplay() {
        const list = currentSide === 'A' ? tracksSideA : tracksSideB;
        const track = list[currentTrackIdx];
        if (trackNameEl) trackNameEl.textContent = `SIDE ${currentSide} • TRACK 0${currentTrackIdx + 1}: ${track.title}`;
        if (lyricsTextEl) lyricsTextEl.textContent = `"${track.lyrics[0]}"`;
        currentLyricIdx = 0;
    }

    function togglePlay() {
        playMechanicalClick();
        isPlaying = !isPlaying;

        if (isPlaying) {
            playBtn.innerHTML = '<span>⏸️</span> Pause';
            wheels.forEach(w => w.classList.add('spinning'));
            playTapeMelody();

            const list = currentSide === 'A' ? tracksSideA : tracksSideB;
            const track = list[currentTrackIdx];

            if (lyricInterval) clearInterval(lyricInterval);
            lyricInterval = setInterval(() => {
                currentLyricIdx = (currentLyricIdx + 1) % track.lyrics.length;
                if (lyricsTextEl) {
                    lyricsTextEl.style.opacity = '0';
                    setTimeout(() => {
                        lyricsTextEl.textContent = `"${track.lyrics[currentLyricIdx]}"`;
                        lyricsTextEl.style.opacity = '1';
                    }, 250);
                }
            }, 3500);

        } else {
            playBtn.innerHTML = '<span>▶️</span> Play';
            wheels.forEach(w => w.classList.remove('spinning'));
            clearInterval(lyricInterval);
            if (noteInterval) clearInterval(noteInterval);
        }
    }

    function nextTrack() {
        playMechanicalClick();
        const list = currentSide === 'A' ? tracksSideA : tracksSideB;
        currentTrackIdx = (currentTrackIdx + 1) % list.length;
        updateTrackDisplay();
        if (isPlaying) {
            togglePlay();
            togglePlay();
        }
    }

    function flipSide() {
        playMechanicalClick();
        currentSide = currentSide === 'A' ? 'B' : 'A';
        currentTrackIdx = 0;
        if (sideBadge) sideBadge.textContent = `SIDE ${currentSide}`;
        if (tapeTitle) {
            tapeTitle.textContent = currentSide === 'A' 
                ? "Side A: The Days We Laughed 🌸" 
                : "Side B: 104 Days of Longing 🌙";
        }
        updateTrackDisplay();
        if (isPlaying) {
            togglePlay();
            togglePlay();
        }
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (flipBtn) flipBtn.addEventListener('click', flipSide);

    updateTrackDisplay();

});
