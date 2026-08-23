/* ==========================================
   PERSISTENT DUAL MUSIC PLAYER SCRIPT
   - Supports local MP3s & YouTube Sad Songs Stream
   - Seamless cross-page audio continuity
   - Floating music widget & dropdown menu
   ========================================== */

(function () {

    const SONGS = [
        {
            title: "Agar Tum Saath Ho 💔",
            artist: "Arijit Singh & Alka Yagnik",
            type: "local",
            src: "assets/music.mp3"
        },
        {
            title: "Channa Ve / Ishq Di Baajiyaan 🥺",
            artist: "B-Praak & Diljit Dosanjh",
            type: "local",
            src: "assets/music3.mp3"
        },
        {
            title: "Channa Mereya 🥀",
            artist: "Arijit Singh (Ae Dil Hai Mushkil)",
            type: "youtube",
            videoId: "284Ov7ys14E"
        },
        {
            title: "Hamari Adhuri Kahani 💔",
            artist: "Arijit Singh",
            type: "youtube",
            videoId: "_aL5u2zmsC0"
        },
        {
            title: "Tujhe Kitna Chahne Lage 🥺",
            artist: "Arijit Singh (Kabir Singh)",
            type: "youtube",
            videoId: "2GfTMdWfN5I"
        },
        {
            title: "Khairiyat 🥀",
            artist: "Arijit Singh (Chhichhore)",
            type: "youtube",
            videoId: "hoNb6HuNmU0"
        },
        {
            title: "Bhula Dena Mujhe 💔",
            artist: "Mustafa Zahid (Aashiqui 2)",
            type: "youtube",
            videoId: "fH_0nS3i2_U"
        },
        {
            title: "Uska Hi Banana 🥺",
            artist: "Arijit Singh (1920)",
            type: "youtube",
            videoId: "2KkW6u5RzXk"
        }
    ];

    const STORAGE_KEY_INDEX = "val_song_index";
    const STORAGE_KEY_TIME = "val_song_time";
    const STORAGE_KEY_PLAYING = "val_song_playing";

    let currentSongIndex = parseInt(localStorage.getItem(STORAGE_KEY_INDEX)) || 0;
    if (currentSongIndex >= SONGS.length) currentSongIndex = 0;

    let audioElement = null;
    let ytPlayer = null;
    let ytApiReady = false;
    let isPlaying = false;

    document.addEventListener("DOMContentLoaded", function () {
        initMusicPlayer();
    });

    function initMusicPlayer() {
        if (document.getElementById("globalAudio")) return;

        // Local HTML5 Audio
        audioElement = document.createElement("audio");
        audioElement.id = "globalAudio";
        audioElement.loop = true;
        audioElement.preload = "auto";
        document.body.appendChild(audioElement);

        // Load YouTube IFrame API
        loadYouTubeAPI();

        // Create Floating Player Widget
        createPlayerWidget();

        // Restore playback state
        const savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEY_TIME));
        const wasPlaying = sessionStorage.getItem(STORAGE_KEY_PLAYING) === "true";

        // Handle page unload to save current time
        window.addEventListener("beforeunload", function () {
            saveCurrentState();
        });

        // Setup periodic save
        audioElement.addEventListener("timeupdate", function () {
            if (SONGS[currentSongIndex].type === "local") {
                sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
            }
        });

        // Initialize first song
        loadSong(currentSongIndex, savedTime, wasPlaying);
    }

    function loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            ytApiReady = true;
            return;
        }

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {
            ytApiReady = true;
            // Create hidden iframe container
            const ytContainer = document.createElement("div");
            ytContainer.id = "ytPlayerContainer";
            ytContainer.style.position = "fixed";
            ytContainer.style.bottom = "-9999px";
            ytContainer.style.right = "-9999px";
            ytContainer.style.width = "1px";
            ytContainer.style.height = "1px";
            ytContainer.style.overflow = "hidden";
            ytContainer.innerHTML = '<div id="ytPlayer"></div>';
            document.body.appendChild(ytContainer);

            ytPlayer = new YT.Player('ytPlayer', {
                height: '1',
                width: '1',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };
    }

    function onPlayerReady(event) {
        if (SONGS[currentSongIndex].type === "youtube") {
            const savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEY_TIME)) || 0;
            const wasPlaying = sessionStorage.getItem(STORAGE_KEY_PLAYING) === "true";
            ytPlayer.cueVideoById(SONGS[currentSongIndex].videoId, savedTime);
            if (wasPlaying) playAudio();
        }
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
            updateWidgetUI();
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            isPlaying = false;
            sessionStorage.setItem(STORAGE_KEY_PLAYING, "false");
            updateWidgetUI();
        }
    }

    function loadSong(index, startTime = 0, autoPlay = false) {
        currentSongIndex = index;
        localStorage.setItem(STORAGE_KEY_INDEX, currentSongIndex);

        const song = SONGS[currentSongIndex];

        // Pause both engines first
        if (audioElement) audioElement.pause();
        if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();

        if (song.type === "local") {
            audioElement.src = song.src;
            if (startTime && !isNaN(startTime)) audioElement.currentTime = startTime;
            if (autoPlay) playAudio();
        } else if (song.type === "youtube") {
            if (ytPlayer && ytPlayer.loadVideoById) {
                if (autoPlay) {
                    ytPlayer.loadVideoById(song.videoId, startTime || 0);
                } else {
                    ytPlayer.cueVideoById(song.videoId, startTime || 0);
                }
            }
        }

        updateWidgetUI();
    }

    function playAudio() {
        const song = SONGS[currentSongIndex];

        if (song.type === "local" && audioElement) {
            audioElement.play().then(() => {
                isPlaying = true;
                sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
                updateWidgetUI();
            }).catch(err => unlockAudio());
        } else if (song.type === "youtube") {
            if (ytPlayer && ytPlayer.playVideo) {
                ytPlayer.playVideo();
                isPlaying = true;
                sessionStorage.setItem(STORAGE_KEY_PLAYING, "true");
                updateWidgetUI();
            } else {
                unlockAudio();
            }
        }
    }

    function pauseAudio() {
        const song = SONGS[currentSongIndex];

        if (song.type === "local" && audioElement) {
            audioElement.pause();
        } else if (song.type === "youtube" && ytPlayer && ytPlayer.pauseVideo) {
            ytPlayer.pauseVideo();
        }

        isPlaying = false;
        sessionStorage.setItem(STORAGE_KEY_PLAYING, "false");
        updateWidgetUI();
    }

    function unlockAudio() {
        const unlock = function () {
            playAudio();
            document.removeEventListener("click", unlock);
        };
        document.addEventListener("click", unlock, { once: true });
    }

    function switchSong(index) {
        if (index < 0 || index >= SONGS.length) return;
        sessionStorage.setItem(STORAGE_KEY_TIME, "0");
        loadSong(index, 0, true);
    }

    function saveCurrentState() {
        sessionStorage.setItem(STORAGE_KEY_PLAYING, isPlaying ? "true" : "false");
        const song = SONGS[currentSongIndex];
        if (song.type === "local" && audioElement) {
            sessionStorage.setItem(STORAGE_KEY_TIME, audioElement.currentTime);
        } else if (song.type === "youtube" && ytPlayer && ytPlayer.getCurrentTime) {
            sessionStorage.setItem(STORAGE_KEY_TIME, ytPlayer.getCurrentTime());
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
                    <span class="music-btn-text" id="musicBtnText">Play Our Song 🎵</span>
                </button>

                <button class="music-select-btn" id="musicSelectBtn" title="Select Sad Songs">
                    🎶 Songs
                </button>
            </div>

            <div class="music-dropdown" id="musicDropdown">
                <div class="dropdown-header">
                    <span>💔 Select Sad Songs</span>
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

        // Bind UI Events
        const toggleBtn = document.getElementById("musicToggleBtn");
        const selectBtn = document.getElementById("musicSelectBtn");
        const dropdown = document.getElementById("musicDropdown");
        const dropdownClose = document.getElementById("dropdownClose");

        toggleBtn.addEventListener("click", function () {
            if (isPlaying) pauseAudio(); else playAudio();
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
            item.addEventListener("click", function () {
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

        // Highlight active song in dropdown
        document.querySelectorAll(".song-item").forEach((el, i) => {
            el.classList.toggle("active", i === currentSongIndex);
        });

        if (isPlaying) {
            if (btnText) btnText.textContent = SONGS[currentSongIndex].title.split(" ")[0] + " 🎵";
            if (bars) bars.classList.add("playing");
        } else {
            if (btnText) btnText.textContent = "Play Sad Songs 💔";
            if (bars) bars.classList.remove("playing");
        }
    }

    window.toggleGlobalMusic = function () {
        if (isPlaying) pauseAudio(); else playAudio();
    };

})();
