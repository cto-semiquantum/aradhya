/* ==========================================
   PERSISTENT MUSIC PLAYER SCRIPT
   - 100% Genuine Local MP3s (Agar Tum Saath Ho, Channa Mereya, etc.)
   - Cross-page seamless audio continuity
   - Global Mute / Disable Music Button (remembers state across all pages)
   ========================================== */

(function () {

    const SONGS = [
        {
            title: "Agar Tum Saath Ho 💔",
            artist: "Arijit Singh & Alka Yagnik (Tamasha)",
            src: "assets/agar_tum_saath_ho.mp3"
        },
        {
            title: "Channa Ve / Ishq Di Baajiyaan 🥺",
            artist: "B-Praak & Diljit Dosanjh",
            src: "assets/music3.mp3"
        },
        {
            title: "Channa Mereya 🥀",
            artist: "Arijit Singh (Ae Dil Hai Mushkil)",
            src: "assets/channa_mereya.mp3"
        },
        {
            title: "Hamari Adhuri Kahani 💔",
            artist: "Arijit Singh (Title Track)",
            src: "assets/hamari_adhuri_kahani.mp3"
        },
        {
            title: "Tujhe Kitna Chahne Lage 🥺",
            artist: "Arijit Singh (Kabir Singh)",
            src: "assets/tujhe_kitna_chahne_lage.mp3"
        },
        {
            title: "Khairiyat 🥀",
            artist: "Arijit Singh (Chhichhore)",
            src: "assets/khairiyat.mp3"
        },
        {
            title: "Bhula Dena 💔",
            artist: "Mustafa Zahid (Aashiqui 2)",
            src: "assets/bhula_dena.mp3"
        }
    ];

    const STORAGE_KEY_INDEX = "val_song_index";
    const STORAGE_KEY_TIME = "val_song_time";
    const STORAGE_KEY_PLAYING = "val_song_playing";
    const STORAGE_KEY_MUTED = "val_music_muted";

    let currentSongIndex = parseInt(localStorage.getItem(STORAGE_KEY_INDEX)) || 0;
    if (currentSongIndex >= SONGS.length) currentSongIndex = 0;

    let isMutedGlobally = localStorage.getItem(STORAGE_KEY_MUTED) === "true";
    let audioElement = null;
    let isPlaying = false;

    document.addEventListener("DOMContentLoaded", function () {
        initMusicPlayer();
    });

    function initMusicPlayer() {
        if (document.getElementById("globalAudio")) return;

        // Create HTML5 Audio
        audioElement = document.createElement("audio");
        audioElement.id = "globalAudio";
        audioElement.loop = true;
        audioElement.preload = "auto";
        audioElement.src = SONGS[currentSongIndex].src;
        document.body.appendChild(audioElement);

        // Restore playback time if navigating between pages
        const savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEY_TIME));

        if (savedTime && !isNaN(savedTime)) {
            audioElement.currentTime = savedTime;
        }

        // Save progress periodically
        audioElement.addEventListener("timeupdate", function () {
            sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
        });

        // Create Floating Player Widget
        createPlayerWidget();

        // Attempt initial play ONLY if NOT muted globally
        if (!isMutedGlobally) {
            playAudio();

            // Add global user-gesture listeners to unlock audio on first tap/click anywhere
            const unlockHandler = function () {
                if (!isMutedGlobally) playAudio();
                document.removeEventListener("click", unlockHandler);
                document.removeEventListener("touchstart", unlockHandler);
            };

            document.addEventListener("click", unlockHandler, { capture: true });
            document.addEventListener("touchstart", unlockHandler, { capture: true });
        } else {
            updateWidgetUI();
        }

        // Handle page unload to save state
        window.addEventListener("beforeunload", function () {
            if (audioElement) {
                sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
                sessionStorage.setItem(STORAGE_KEY_PLAYING, (isPlaying && !isMutedGlobally) ? "true" : "false");
            }
        });
    }

    function playAudio() {
        if (!audioElement || isMutedGlobally) return;

        audioElement.play().then(() => {
            isPlaying = true;
            sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
            updateWidgetUI();
        }).catch(err => {
            console.log("Autoplay waiting for tap/click.");
            isPlaying = false;
            updateWidgetUI();
        });
    }

    function pauseAudio() {
        if (!audioElement) return;
        audioElement.pause();
        isPlaying = false;
        sessionStorage.setItem(STORAGE_KEY_PLAYING, "false");
        updateWidgetUI();
    }

    function toggleGlobalMute() {
        isMutedGlobally = !isMutedGlobally;
        localStorage.setItem(STORAGE_KEY_MUTED, isMutedGlobally ? "true" : "false");

        if (isMutedGlobally) {
            pauseAudio();
        } else {
            playAudio();
        }
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

        if (!isMutedGlobally) {
            playAudio();
        } else {
            updateWidgetUI();
        }
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

                <button class="music-select-btn" id="musicSelectBtn" title="Select Songs">
                    🎶 Songs
                </button>

                <button class="music-mute-btn" id="musicMuteBtn" title="Turn Off Music Everywhere">
                    ${isMutedGlobally ? '🔇 Off' : '🔊 On'}
                </button>
            </div>

            <div class="music-dropdown" id="musicDropdown">
                <div class="dropdown-header">
                    <span>💔 Sad Songs Playlist</span>
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
                <div class="dropdown-footer">
                    <button class="global-mute-action-btn" id="globalMuteActionBtn">
                        ${isMutedGlobally ? '🔊 Turn Music ON Everywhere' : '🔇 Turn Music OFF Everywhere'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Bind Events
        const toggleBtn = document.getElementById("musicToggleBtn");
        const selectBtn = document.getElementById("musicSelectBtn");
        const muteBtn = document.getElementById("musicMuteBtn");
        const globalMuteActionBtn = document.getElementById("globalMuteActionBtn");
        const dropdown = document.getElementById("musicDropdown");
        const dropdownClose = document.getElementById("dropdownClose");

        toggleBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (isMutedGlobally) {
                toggleGlobalMute(); // Unmute if muted
            } else if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });

        selectBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });

        muteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleGlobalMute();
        });

        globalMuteActionBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleGlobalMute();
            dropdown.classList.remove("show");
        });

        dropdownClose.addEventListener("click", function (e) {
            e.stopPropagation();
            dropdown.classList.remove("show");
        });

        document.querySelectorAll(".song-item").forEach(item => {
            item.addEventListener("click", function (e) {
                e.stopPropagation();
                const index = parseInt(this.dataset.index);
                if (isMutedGlobally) isMutedGlobally = false; // Auto unmute when picking a song
                localStorage.setItem(STORAGE_KEY_MUTED, "false");
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
        const muteBtn = document.getElementById("musicMuteBtn");
        const globalMuteActionBtn = document.getElementById("globalMuteActionBtn");

        document.querySelectorAll(".song-item").forEach((el, i) => {
            el.classList.toggle("active", i === currentSongIndex);
        });

        if (muteBtn) {
            muteBtn.textContent = isMutedGlobally ? '🔇 Off' : '🔊 On';
            muteBtn.classList.toggle("is-muted", isMutedGlobally);
        }

        if (globalMuteActionBtn) {
            globalMuteActionBtn.textContent = isMutedGlobally ? '🔊 Turn Music ON Everywhere' : '🔇 Turn Music OFF Everywhere';
        }

        if (isMutedGlobally) {
            if (btnText) btnText.textContent = "Music Off 🔇";
            if (bars) bars.classList.remove("playing");
        } else if (isPlaying) {
            if (btnText) btnText.textContent = SONGS[currentSongIndex].title.split(" ")[0] + " 🎵";
            if (bars) bars.classList.add("playing");
        } else {
            if (btnText) btnText.textContent = "Tap To Play 🎵";
            if (bars) bars.classList.remove("playing");
        }
    }

    window.toggleGlobalMusic = function () {
        if (isMutedGlobally) {
            toggleGlobalMute();
        } else if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    window.toggleGlobalMute = toggleGlobalMute;

})();
