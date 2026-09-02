/* ==========================================
   TOGETHER LISTENING — SYNCHRONIZED LOGIC
   ========================================== */

(function () {
    const playlist = [
        {
            title: "Agar Tum Saath Ho",
            artist: "Arijit Singh & Alka Yagnik",
            src: "assets/agar_tum_saath_ho.mp3",
            cover: "assets/images/her1.jpeg"
        },
        {
            title: "Tujhe Kitna Chahne Lage",
            artist: "Arijit Singh",
            src: "assets/tujhe_kitna_chahne_lage.mp3",
            cover: "assets/images/her2.jpeg"
        },
        {
            title: "Khairiyat Pucho",
            artist: "Arijit Singh",
            src: "assets/khairiyat.mp3",
            cover: "assets/images/anime_hero.png"
        },
        {
            title: "Hamari Adhuri Kahani",
            artist: "Arijit Singh",
            src: "assets/hamari_adhuri_kahani.mp3",
            cover: "assets/images/her1.jpeg"
        },
        {
            title: "Channa Mereya",
            artist: "Arijit Singh",
            src: "assets/channa_mereya.mp3",
            cover: "assets/images/anime_forever.png"
        },
        {
            title: "Bhula Dena",
            artist: "Mustafa Zahid",
            src: "assets/bhula_dena.mp3",
            cover: "assets/images/her2.jpeg"
        }
    ];

    let currentIndex = 0;
    let isPlaying = false;
    let isRemoteAction = false;
    const audio = new Audio();

    // DOM Elements
    const vinylDisc = document.getElementById('vinylDisc');
    const vinylLabel = document.getElementById('vinylLabel');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const currTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalDuration');
    const playlistContainer = document.getElementById('playlistContainer');
    const stageCard = document.querySelector('.vinyl-stage-card');

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function renderPlaylist() {
        if (!playlistContainer) return;
        playlistContainer.innerHTML = '';
        playlist.forEach((track, i) => {
            const item = document.createElement('div');
            item.className = `song-item ${i === currentIndex ? 'active' : ''}`;
            item.onclick = () => selectTrack(i, true);
            item.innerHTML = `
                <div class="song-meta-left">
                    <span class="song-index">${i + 1}</span>
                    <div>
                        <div class="song-name">${track.title}</div>
                        <div class="song-artist">${track.artist}</div>
                    </div>
                </div>
                <div style="font-size: 14px; color: #ff99ac;">${i === currentIndex && isPlaying ? '🎵 Playing' : '▶'}</div>
            `;
            playlistContainer.appendChild(item);
        });
    }

    function loadTrack(index) {
        currentIndex = index;
        const track = playlist[currentIndex];
        audio.src = track.src;
        if (songTitle) songTitle.textContent = track.title;
        if (songArtist) songArtist.textContent = track.artist;
        if (vinylLabel) vinylLabel.style.backgroundImage = `url('${track.cover}')`;
        renderPlaylist();
    }

    function playTrack(broadcast = true) {
        audio.play().then(() => {
            isPlaying = true;
            if (playBtn) playBtn.textContent = '⏸';
            if (vinylDisc) vinylDisc.classList.add('spinning');
            renderPlaylist();

            if (broadcast && !isRemoteAction && window.RealtimeClient) {
                window.RealtimeClient.emit('sync_music_action', {
                    type: 'play',
                    index: currentIndex,
                    time: audio.currentTime
                });
            }
        }).catch(e => console.log('Autoplay policy wait:', e));
    }

    function pauseTrack(broadcast = true) {
        audio.pause();
        isPlaying = false;
        if (playBtn) playBtn.textContent = '▶';
        if (vinylDisc) vinylDisc.classList.remove('spinning');
        renderPlaylist();

        if (broadcast && !isRemoteAction && window.RealtimeClient) {
            window.RealtimeClient.emit('sync_music_action', {
                type: 'pause',
                index: currentIndex,
                time: audio.currentTime
            });
        }
    }

    window.togglePlay = function () {
        if (isPlaying) {
            pauseTrack(true);
        } else {
            playTrack(true);
        }
    };

    function selectTrack(index, broadcast = true) {
        loadTrack(index);
        playTrack(broadcast);
        if (broadcast && !isRemoteAction && window.RealtimeClient) {
            window.RealtimeClient.emit('sync_music_action', {
                type: 'change_track',
                index: currentIndex,
                time: 0
            });
        }
    }

    window.prevTrack = function () {
        const nextIdx = (currentIndex - 1 + playlist.length) % playlist.length;
        selectTrack(nextIdx, true);
    };

    window.nextTrack = function () {
        const nextIdx = (currentIndex + 1) % playlist.length;
        selectTrack(nextIdx, true);
    };

    // Progress Bar Updates
    audio.addEventListener('timeupdate', () => {
        if (!progressBar) return;
        const percent = (audio.currentTime / (audio.duration || 1)) * 100;
        progressBar.value = percent || 0;
        if (currTimeEl) currTimeEl.textContent = formatTime(audio.currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        window.nextTrack();
    });

    if (progressBar) {
        progressBar.addEventListener('input', (e) => {
            const seekTime = (e.target.value / 100) * (audio.duration || 1);
            audio.currentTime = seekTime;
            if (window.RealtimeClient) {
                window.RealtimeClient.emit('sync_music_action', {
                    type: 'seek',
                    index: currentIndex,
                    time: seekTime
                });
            }
        });
    }

    // Reaction Bubbles
    function triggerReactionBubble(emoji, text = '') {
        if (!stageCard) return;
        const bubble = document.createElement('div');
        bubble.className = 'reaction-particle';
        bubble.textContent = emoji;
        bubble.style.left = `${30 + Math.random() * 40}%`;
        stageCard.appendChild(bubble);
        setTimeout(() => bubble.remove(), 2200);

        if (text) {
            showToast(`${emoji} ${text}`);
        }
    }

    window.sendReaction = function (emoji, label) {
        triggerReactionBubble(emoji);
        if (window.RealtimeClient) {
            window.RealtimeClient.emit('sync_music_action', {
                type: 'reaction',
                emoji: emoji,
                label: label
            });
        }
    };

    // Socket.io Realtime Listener
    if (window.RealtimeClient) {
        window.RealtimeClient.on('sync_music_action', (data) => {
            if (!data) return;
            isRemoteAction = true;

            if (data.type === 'reaction') {
                triggerReactionBubble(data.emoji, `Partner sent: "${data.label}"`);
                if (navigator.vibrate) navigator.vibrate([30, 50]);
            } else if (data.type === 'play') {
                if (data.index !== currentIndex) loadTrack(data.index);
                if (Math.abs(audio.currentTime - data.time) > 1.5) {
                    audio.currentTime = data.time;
                }
                playTrack(false);
                showToast("Partner resumed playback 🎵");
            } else if (data.type === 'pause') {
                pauseTrack(false);
                showToast("Partner paused playback ⏸️");
            } else if (data.type === 'seek') {
                audio.currentTime = data.time;
                showToast("Partner synced position ⏩");
            } else if (data.type === 'change_track') {
                selectTrack(data.index, false);
                showToast(`Partner switched song: ${playlist[data.index].title} 🌸`);
            }

            setTimeout(() => { isRemoteAction = false; }, 300);
        });
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%);
            background: rgba(22, 10, 36, 0.95); border: 1px solid rgba(255, 75, 145, 0.5);
            color: #fff; padding: 10px 22px; border-radius: 50px; font-size: 13px;
            font-weight: 500; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 9999;
            backdrop-filter: blur(15px); animation: fadeIn 0.3s ease;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // Init First Track
    loadTrack(0);
})();
