/* ==========================================
   PERSISTENT MUSIC PLAYER SCRIPT
   - Music is 100% OFF by default.
   - Plays ONLY when manually clicked on the "Play Music 🎵" button!
   - ZERO screen tap or page click auto-play!
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

    let isMutedGlobally = true;
    let audioElement = null;
    let isPlaying = false;
    let timeRestored = false;

    document.addEventListener("DOMContentLoaded", function () {
        initMusicPlayer();
    });

    function initMusicPlayer() {
        if (document.getElementById("globalAudio")) return;

        const savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEY_TIME)) || 0;

        // Create HTML5 Audio
        audioElement = document.createElement("audio");
        audioElement.id = "globalAudio";
        audioElement.loop = true;
        audioElement.preload = "none";
        audioElement.src = SONGS[currentSongIndex].src;
        document.body.appendChild(audioElement);

        function applySavedTime() {
            if (!timeRestored && savedTime > 0) {
                try {
                    audioElement.currentTime = savedTime;
                    timeRestored = true;
                } catch (e) {}
            }
        }

        audioElement.addEventListener("loadedmetadata", applySavedTime);
        audioElement.addEventListener("canplay", applySavedTime);

        // Save progress continuously
        audioElement.addEventListener("timeupdate", function () {
            if (audioElement.currentTime > 0) {
                sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
            }
        });

        // Save time on link clicks
        document.addEventListener("click", function (e) {
            const link = e.target.closest("a");
            if (link && audioElement && audioElement.currentTime > 0) {
                sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
                sessionStorage.setItem(STORAGE_KEY_PLAYING, (isPlaying && !isMutedGlobally) ? "true" : "false");
            }
        }, { capture: true });

        // Create Floating Player Widget
        createPlayerWidget();

        // Music is OFF by default. If user turned it ON during session, continue playback smoothly across pages
        const wasPlayingInSession = sessionStorage.getItem(STORAGE_KEY_PLAYING) === "true";
        if (wasPlayingInSession) {
            playAudio();
        } else {
            isMutedGlobally = true;
            updateWidgetUI();
        }

        window.addEventListener("beforeunload", function () {
            if (audioElement && audioElement.currentTime > 0) {
                sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
                sessionStorage.setItem(STORAGE_KEY_PLAYING, (isPlaying && !isMutedGlobally) ? "true" : "false");
            }
        });
    }

    function playAudio() {
        if (!audioElement) return;

        isMutedGlobally = false;
        localStorage.setItem(STORAGE_KEY_MUTED, "false");

        audioElement.play().then(() => {
            isPlaying = true;
            sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
            updateWidgetUI();
        }).catch(err => {
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
        if (isMutedGlobally || !isPlaying) {
            isMutedGlobally = false;
            localStorage.setItem(STORAGE_KEY_MUTED, "false");
            playAudio();
        } else {
            isMutedGlobally = true;
            localStorage.setItem(STORAGE_KEY_MUTED, "true");
            pauseAudio();
        }
        updateWidgetUI();
    }

    function switchSong(index) {
        if (index < 0 || index >= SONGS.length) return;

        currentSongIndex = index;
        localStorage.setItem(STORAGE_KEY_INDEX, currentSongIndex);
        sessionStorage.setItem(STORAGE_KEY_TIME, "0");
        timeRestored = true;

        if (!audioElement) return;

        audioElement.src = SONGS[currentSongIndex].src;
        audioElement.currentTime = 0;

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

                <button class="music-select-btn" id="musicSelectBtn" title="Select Songs">
                    🎶 Songs
                </button>

                <button class="music-mute-btn" id="musicMuteBtn" title="Turn Off Music Everywhere">
                    ${(isMutedGlobally || !isPlaying) ? '🔇 Off' : '🔊 On'}
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
                        ${(isMutedGlobally || !isPlaying) ? '🔊 Turn Music ON' : '🔇 Turn Music OFF'}
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
            if (isPlaying && !isMutedGlobally) {
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
            muteBtn.textContent = (isMutedGlobally || !isPlaying) ? '🔇 Off' : '🔊 On';
            muteBtn.classList.toggle("is-muted", isMutedGlobally || !isPlaying);
        }

        if (globalMuteActionBtn) {
            globalMuteActionBtn.textContent = (isMutedGlobally || !isPlaying) ? '🔊 Turn Music ON' : '🔇 Turn Music OFF';
        }

        if (isMutedGlobally || !isPlaying) {
            if (btnText) btnText.textContent = "Play Music 🎵";
            if (bars) bars.classList.remove("playing");
        } else {
            if (btnText) btnText.textContent = SONGS[currentSongIndex].title.split(" ")[0] + " 🎵";
            if (bars) bars.classList.add("playing");
        }
    }

    window.toggleGlobalMusic = function () {
        if (isPlaying && !isMutedGlobally) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    window.toggleGlobalMute = toggleGlobalMute;

})();
