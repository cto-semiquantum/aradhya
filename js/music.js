/* ==========================================
   PERSISTENT MUSIC PLAYER SCRIPT (100% RELIABLE PLAYBACK)
   - Bypasses browser autoplay restrictions via user gesture unlock
   - Plays seamlessly across all pages
   - Song selector menu (Agar Tum Saath Ho, Channa Ve, etc.)
   ========================================== */

(function () {

    const SONGS = [
        {
            title: "Agar Tum Saath Ho 💔",
            artist: "Tamasha",
            src: "assets/music.mp3"
        },
        {
            title: "Channa Ve / Ishq Di Baajiyaan 🥺",
            artist: "Bhoot / Soorma",
            src: "assets/music3.mp3"
        }
    ];

    const STORAGE_KEY_INDEX = "val_song_index";
    const STORAGE_KEY_TIME = "val_song_time";
    const STORAGE_KEY_PLAYING = "val_song_playing";

    let currentSongIndex = parseInt(localStorage.getItem(STORAGE_KEY_INDEX)) || 0;
    if (currentSongIndex >= SONGS.length) currentSongIndex = 0;

    let audioElement = null;
    let isPlaying = false;
    let isUnlocked = false;

    document.addEventListener("DOMContentLoaded", function () {
        initMusicPlayer();
    });

    function initMusicPlayer() {
        if (document.getElementById("globalAudio")) return;

        // Create audio element
        audioElement = document.createElement("audio");
        audioElement.id = "globalAudio";
        audioElement.loop = true;
        audioElement.preload = "auto";
        audioElement.src = SONGS[currentSongIndex].src;

        document.body.appendChild(audioElement);

        // Restore playback time if navigating between pages
        const savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEY_TIME));
        const wasPlaying = sessionStorage.getItem(STORAGE_KEY_PLAYING) !== "false"; // Default to true if not explicitly false

        if (savedTime && !isNaN(savedTime)) {
            audioElement.currentTime = savedTime;
        }

        // Save progress periodically
        audioElement.addEventListener("timeupdate", function () {
            sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
        });

        // Create Floating Player Widget
        createPlayerWidget();

        // Attempt initial play
        attemptPlay();

        // Add global user-gesture listeners to unlock audio on first tap/click anywhere
        const unlockHandler = function () {
            if (!isUnlocked || !isPlaying) {
                playAudio();
            }
            document.removeEventListener("click", unlockHandler);
            document.removeEventListener("touchstart", unlockHandler);
            document.removeEventListener("keydown", unlockHandler);
        };

        document.addEventListener("click", unlockHandler, { capture: true });
        document.addEventListener("touchstart", unlockHandler, { capture: true });
        document.addEventListener("keydown", unlockHandler, { capture: true });

        // Save state on unload
        window.addEventListener("beforeunload", function () {
            if (audioElement) {
                sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
                sessionStorage.setItem(STORAGE_KEY_PLAYING, isPlaying ? "true" : "false");
            }
        });
    }

    function attemptPlay() {
        if (!audioElement) return;

        audioElement.play().then(() => {
            isPlaying = true;
            isUnlocked = true;
            sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
            updateWidgetUI();
        }).catch(err => {
            console.log("Autoplay waiting for first user click.");
            isPlaying = false;
            updateWidgetUI();
        });
    }

    function playAudio() {
        if (!audioElement) return;

        audioElement.play().then(() => {
            isPlaying = true;
            isUnlocked = true;
            sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
            updateWidgetUI();
        }).catch(err => {
            console.log("Play failed:", err);
        });
    }

    function pauseAudio() {
        if (!audioElement) return;
        audioElement.pause();
        isPlaying = false;
        sessionStorage.setItem(STORAGE_KEY_PLAYING, "false");
        updateWidgetUI();
    }

    function switchSong(index) {
        if (index < 0 || index >= SONGS.length) return;

        currentSongIndex = index;
        localStorage.setItem(STORAGE_KEY_INDEX, currentSongIndex);

        if (!audioElement) return;

        audioElement.src = SONGS[currentSongIndex].src;
        audioElement.currentTime = 0;
        sessionStorage.setItem(STORAGE_KEY_TIME, "0");

        playAudio();
    }

    function createPlayerWidget() {
        if (document.getElementById("musicWidget")) return;

        const widget = document.createElement("div");
        widget.id = "musicWidget";
        widget.className = "music-widget";

        widget.innerHTML = `
            <div class="music-widget-content">
                <button class="music-toggle-btn" id="musicToggleBtn" title="Play/Pause Music">
                    <span class="music-bars" id="musicBars">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="music-btn-text" id="musicBtnText">Play Music 🎵</span>
                </button>

                <button class="music-select-btn" id="musicSelectBtn" title="Change Song">
                    🎶 Songs
                </button>
            </div>

            <div class="music-dropdown" id="musicDropdown">
                <div class="dropdown-header">
                    <span>💔 Select Song</span>
                    <button class="dropdown-close" id="dropdownClose">✕</button>
                </div>
                <div class="song-list">
                    ${SONGS.map((song, i) => `
                        <div class="song-item ${i === currentSongIndex ? 'active' : ''}" data-index="${i}">
                            <span class="song-title">${song.title}</span>
                            <span class="song-artist">${song.artist}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Bind Events
        const toggleBtn = document.getElementById("musicToggleBtn");
        const selectBtn = document.getElementById("musicSelectBtn");
        const dropdown = document.getElementById("musicDropdown");
        const dropdownClose = document.getElementById("dropdownClose");

        toggleBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });

        selectBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });

        dropdownClose.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.remove("show");
        });

        document.querySelectorAll(".song-item").forEach(item => {
            item.addEventListener("click", function (e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                switchSong(index);
                dropdown.classList.remove("show");
            });
        });

        document.addEventListener("click", function (e) {
            if (!widget.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        });
    }

    function updateWidgetUI() {
        const btnText = document.getElementById("musicBtnText");
        const bars = document.getElementById("musicBars");

        document.querySelectorAll(".song-item").forEach((el, i) => {
            el.classList.toggle("active", i === currentSongIndex);
        });

        if (isPlaying) {
            if (btnText) btnText.textContent = SONGS[currentSongIndex].title.split(" ")[0] + " 🎵";
            if (bars) bars.classList.add("playing");
        } else {
            if (btnText) btnText.textContent = "Tap To Play 🎵";
            if (bars) bars.classList.remove("playing");
        }
    }

    // Global helper
    window.toggleGlobalMusic = function () {
        if (isPlaying) pauseAudio(); else playAudio();
    };

})();
