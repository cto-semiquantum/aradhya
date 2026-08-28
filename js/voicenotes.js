/* ==========================================
   VOICE NOTES VAULT JS
   Audio Player with Waveform & Love Letters
   ========================================== */

(function () {
    const AUDIO_NOTES = [
        {
            id: "note-1",
            title: "🌙 Late Night Voice Note: Jab Neend Na Aaye",
            duration: "1:15",
            audioSrc: "assets/music3.mp3",
            transcript: "Aradhya… Raat ke 2 baj rahe hain aur bas tumhara khayal aa raha tha. Pata nahi tum so gayi ho ya jaag rahi ho, par bas itna bolna tha ki chahe kuch bhi ho jaye, mera dil hamesha sirf tumhara hai. Good night my peace. ❤️"
        },
        {
            id: "note-2",
            title: "🌸 Morning Sunshine: Smile Karo Aaj!",
            duration: "0:45",
            audioSrc: "assets/music3.mp3",
            transcript: "Good morning Aradhya! Aaj ka din kaisa bhi ho, bas ek baar apni pyaari si smile rakhna. You are the strongest and most precious person I know. Shine bright today! ✨"
        },
        {
            id: "note-3",
            title: "🥺 Missing You: Dil Se Ek Baat",
            duration: "1:30",
            audioSrc: "assets/music3.mp3",
            transcript: "Log kehte hain door jaane se yaadein dhundhli ho jaati hain… par mera toh har din tumhari yaadon ke bina shuru hi nahi hota. I truly miss your voice and your laughter. 💕"
        },
        {
            id: "note-4",
            title: "💖 Humari Pehli Baat Ki Yaad",
            duration: "1:05",
            audioSrc: "assets/music3.mp3",
            transcript: "Wo din jab humne pehli baar itni lambi baat ki thi… mujhe tab hi lag gaya tha ki ye insaan meri life me sabse alag aur special banne wala hai. Aur aaj bhi wo feeling bilkul waisi hi hai. 🌸"
        }
    ];

    let currentAudio = null;
    let activeIndex = -1;

    function renderNotes() {
        const listEl = document.getElementById("notesList");
        if (!listEl) return;

        listEl.innerHTML = AUDIO_NOTES.map((note, idx) => `
            <div class="note-item ${idx === activeIndex ? 'active' : ''}" onclick="window.playNote(${idx})">
                <div class="note-meta">
                    <strong>${note.title}</strong>
                    <span>⏱️ Duration: ${note.duration}</span>
                </div>
                <div class="note-play-icon">${idx === activeIndex ? '⏸️' : '▶️'}</div>
            </div>
        `).join("");
    }

    window.playNote = function (idx) {
        const audioEl = document.getElementById("voicePlayerAudio");
        const transcriptEl = document.getElementById("noteTranscript");
        const spools = document.querySelectorAll(".tape-spool");
        const waves = document.querySelectorAll(".wave-bar");

        if (activeIndex === idx && currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            spools.forEach(s => s.classList.remove("spinning"));
            waves.forEach(w => w.classList.remove("playing"));
            activeIndex = -1;
            renderNotes();
            return;
        }

        activeIndex = idx;
        const note = AUDIO_NOTES[idx];

        if (audioEl) {
            audioEl.src = note.audioSrc;
            audioEl.play().then(() => {
                currentAudio = audioEl;
                spools.forEach(s => s.classList.add("spinning"));
                waves.forEach(w => w.classList.add("playing"));
            }).catch(() => {});
        }

        if (transcriptEl) {
            transcriptEl.innerHTML = `<strong>Letter Transcript:</strong><br>${note.transcript}`;
            transcriptEl.style.display = "block";
        }

        renderNotes();
        if (window.triggerHeartbeat) window.triggerHeartbeat();
    };

    document.addEventListener("DOMContentLoaded", () => {
        renderNotes();
        const audioEl = document.getElementById("voicePlayerAudio");
        if (audioEl) {
            audioEl.addEventListener("ended", () => {
                const spools = document.querySelectorAll(".tape-spool");
                const waves = document.querySelectorAll(".wave-bar");
                spools.forEach(s => s.classList.remove("spinning"));
                waves.forEach(w => w.classList.remove("playing"));
                activeIndex = -1;
                renderNotes();
            });
        }
    });
})();
