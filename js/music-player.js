/* ==========================================
   RETRO CASSETTE PLAYER SCRIPT
   ========================================== */

const TRACKS = [
    {
        title: "Agar Tum Saath Ho",
        artist: "Arijit Singh & Alka Yagnik",
        file: "assets/agar_tum_saath_ho.mp3",
        lyric: "“Pal bhar theher jao, dil ye sambhal jaye...” 💖"
    },
    {
        title: "Hamari Adhuri Kahani",
        artist: "Arijit Singh",
        file: "assets/hamari_adhuri_kahani.mp3",
        lyric: "“Paas aaye dooriyan phir bhi kam na hui...” 🕊️"
    },
    {
        title: "Khairiyat",
        artist: "Arijit Singh",
        file: "assets/khairiyat.mp3",
        lyric: "“Khairiyat pucho, kabhi to kaifiyat pucho...” ✨"
    },
    {
        title: "Channa Mereya",
        artist: "Arijit Singh",
        file: "assets/channa_mereya.mp3",
        lyric: "“Acha chalte hain, duao mein yaad rakhna...” 💔"
    },
    {
        title: "Tujhe Kitna Chahne Lage",
        artist: "Arijit Singh",
        file: "assets/tujhe_kitna_chahne_lage.mp3",
        lyric: "“Tere bin ab na lenge ek bhi dum...” 💕"
    },
    {
        title: "Bhula Dena",
        artist: "Mustafa Zahid",
        file: "assets/bhula_dena.mp3",
        lyric: "“Bhula dena mujhe, hai alvida tujhe...” 🌸"
    }
];

let currentTrackIndex = 0;
const audioPlayer = new Audio();

document.addEventListener('DOMContentLoaded', () => {
    const cassette = document.getElementById('cassettePlayer');
    const playBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const trackTitle = document.getElementById('trackTitle');
    const trackLyric = document.getElementById('trackLyric');
    const playlistEl = document.getElementById('playlistContainer');

    function renderPlaylist() {
        if (!playlistEl) return;
        playlistEl.innerHTML = TRACKS.map((t, idx) => `
            <div class="track-item ${idx === currentTrackIndex ? 'active' : ''}" onclick="selectTrack(${idx})">
                <div class="track-info">
                    <span class="track-icon">${idx === currentTrackIndex ? '▶️' : '🎵'}</span>
                    <div>
                        <div class="track-name">${t.title}</div>
                        <div class="track-sub">${t.artist}</div>
                    </div>
                </div>
                <div class="track-status">${idx === currentTrackIndex ? 'Playing' : ''}</div>
            </div>
        `).join('');
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = TRACKS[currentTrackIndex];
        audioPlayer.src = track.file;
        if (trackTitle) trackTitle.textContent = track.title;
        if (trackLyric) trackLyric.textContent = track.lyric;
        renderPlaylist();
    }

    window.selectTrack = function(index) {
        loadTrack(index);
        playAudio();
    };

    function playAudio() {
        audioPlayer.play().then(() => {
            if (cassette) cassette.classList.add('playing');
            if (playBtn) playBtn.innerHTML = '⏸️';
        }).catch(err => {
            console.log("Autoplay check:", err);
        });
    }

    function pauseAudio() {
        audioPlayer.pause();
        if (cassette) cassette.classList.remove('playing');
        if (playBtn) playBtn.innerHTML = '▶️';
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
            loadTrack(currentTrackIndex);
            playAudio();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
            loadTrack(currentTrackIndex);
            playAudio();
        });
    }

    audioPlayer.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
        loadTrack(currentTrackIndex);
        playAudio();
    });

    // Initialize track
    loadTrack(0);
});
