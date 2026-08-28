/* ==========================================
   LIVE UPDATES & PUSH NOTIFICATIONS JS
   Realtime Pub/Sub via ntfy & Web Push
   ========================================== */

(function () {
    const TOPIC = 'harsh_aradhya_love_live_411';
    const NTFY_BASE = 'https://ntfy.sh/' + TOPIC;
    const STORAGE_KEY = 'harsh_live_posts_v1';
    const ADMIN_AUTH_KEY = 'harsh_admin_live_auth';

    // Default Seed Posts if fresh start
    const DEFAULT_POSTS = [
        {
            id: 'post-1',
            title: 'Hamesha Tumhare Saath ❤️',
            message: 'Ye special live channel maine banaya hai taaki main jab bhi kuch feel karun ya mere sath kuch ho, main turant yahan post kar sakun aur tumhare phone pe direct notification aaye! 💕',
            mood: '💖 Special Update',
            time: '2026-08-28T09:00:00.000Z',
            sender: 'Harsh',
            avatar: 'assets/images/her1.jpeg',
            likes: 12,
            hugs: 8
        },
        {
            id: 'post-2',
            title: 'Bas Tumhari Yaad Aa Rahi Thi 🥺',
            message: 'Chahe kitne bhi din beet jayein, ek din bhi aisa nahi jata jab tumhara khayal dil me na aaye. Take care of yourself always! ✨',
            mood: '🥺 Missing You',
            time: '2026-08-27T21:30:00.000Z',
            sender: 'Harsh',
            avatar: 'assets/images/her1.jpeg',
            likes: 24,
            hugs: 15
        }
    ];

    let cachedPosts = [];

    // Initialize Local Storage
    function getStoredPosts() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error(e);
        }
        return [...DEFAULT_POSTS];
    }

    function saveStoredPosts(posts) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        } catch (e) {
            console.error(e);
        }
    }

    // Format Relative Time
    function formatTime(isoString) {
        if (!isoString) return 'Just now';
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Recently';

        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now ⚡';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // Render Timeline
    function renderFeed() {
        const feedContainer = document.getElementById('liveTimeline');
        if (!feedContainer) return;

        if (cachedPosts.length === 0) {
            feedContainer.innerHTML = `
                <div class="empty-feed">
                    <div class="empty-feed-icon">📡</div>
                    <h3>No updates yet</h3>
                    <p>Whenever Harsh posts something, it will appear here in real time!</p>
                </div>
            `;
            return;
        }

        // Sort latest first
        const sorted = [...cachedPosts].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));

        feedContainer.innerHTML = sorted.map((item, idx) => {
            const isLatest = idx === 0;
            const photoHtml = item.image ? `
                <div class="live-card-media">
                    <img src="${escapeHtml(item.image)}" alt="Attached photo" onerror="this.style.display='none'">
                </div>
            ` : '';

            return `
                <article class="live-card ${isLatest ? 'pinned' : ''}" id="${item.id || 'p-' + idx}">
                    <div class="live-card-header">
                        <div class="sender-info">
                            <img src="${item.avatar || 'assets/images/her1.jpeg'}" alt="Avatar" class="sender-avatar">
                            <div class="sender-meta">
                                <div class="sender-name">
                                    ${escapeHtml(item.sender || 'Harsh')}
                                    <span class="verified-badge" title="Verified Poster">✦</span>
                                </div>
                                <span class="post-time">${formatTime(item.time)}</span>
                            </div>
                        </div>
                        <span class="mood-badge">${escapeHtml(item.mood || '💭 Update')}</span>
                    </div>

                    ${item.title ? `<h3 class="live-card-title">${escapeHtml(item.title)}</h3>` : ''}
                    <div class="live-card-body">${linkifyAndEscape(item.message || '')}</div>
                    ${photoHtml}

                    <div class="live-card-footer">
                        <div class="reaction-btn-group">
                            <button class="reaction-pill" onclick="window.addReaction('${item.id}', 'likes', this)">
                                ❤️ <span class="react-count">${item.likes || 0}</span>
                            </button>
                            <button class="reaction-pill" onclick="window.addReaction('${item.id}', 'hugs', this)">
                                🫂 <span class="react-count">${item.hugs || 0}</span>
                            </button>
                        </div>
                        <span style="font-size: 11px; color: rgba(255,255,255,0.4);">Live Broadcast ⚡</span>
                    </div>
                </article>
            `;
        }).join('');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function linkifyAndEscape(text) {
        const escaped = escapeHtml(text);
        // Turn urls into clickable links
        return escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color: #00d2ff; text-decoration: underline;">$1</a>');
    }

    // Reaction handler
    window.addReaction = function (postId, type, btnEl) {
        const post = cachedPosts.find(p => p.id === postId);
        if (post) {
            post[type] = (post[type] || 0) + 1;
            saveStoredPosts(cachedPosts);
            const countSpan = btnEl.querySelector('.react-count');
            if (countSpan) countSpan.textContent = post[type];
            btnEl.classList.add('active');
            if (window.triggerHeartbeat) window.triggerHeartbeat();
            showToast('Reaction sent with love 💕');
        }
    };

    // Toast Notification in-app
    function showToast(msg) {
        let toast = document.getElementById('liveToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'liveToast';
            toast.className = 'live-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // Realtime SSE / WebSocket Listener for Instant Delivery
    function initRealtimeStream() {
        try {
            // First fetch latest messages from ntfy topic cache
            fetch(NTFY_BASE + '/json?poll=1&since=24h')
                .then(res => res.text())
                .then(text => {
                    const lines = text.trim().split('\n');
                    let newAdded = false;
                    lines.forEach(line => {
                        if (!line) return;
                        try {
                            const data = JSON.parse(line);
                            if (data.event === 'message' && data.message) {
                                ingestRemoteMessage(data);
                                newAdded = true;
                            }
                        } catch (err) {}
                    });
                    if (newAdded) {
                        saveStoredPosts(cachedPosts);
                        renderFeed();
                    }
                })
                .catch(err => console.log('NTFY poll notice:', err));

            // Start SSE live event listener
            const eventSource = new EventSource(NTFY_BASE + '/sse');
            eventSource.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'message') {
                        const newPost = ingestRemoteMessage(data);
                        if (newPost) {
                            saveStoredPosts(cachedPosts);
                            renderFeed();
                            showToast(`🔔 New Live Update: ${newPost.title || 'Harsh ka message'}`);
                            if (window.triggerHeartbeat) window.triggerHeartbeat();

                            // In-browser notification if allowed
                            if (Notification.permission === 'granted' && document.hidden) {
                                new Notification(newPost.title || 'Harsh Live Update 💌', {
                                    body: newPost.message,
                                    icon: './assets/images/icon-192.png'
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.error('SSE parse error', e);
                }
            };

            eventSource.onerror = function () {
                // Reconnection is automatically managed by EventSource
            };
        } catch (e) {
            console.error('Live stream init error', e);
        }
    }

    function ingestRemoteMessage(data) {
        const id = 'ntfy-' + data.id;
        const exists = cachedPosts.find(p => p.id === id);
        if (exists) return null;

        // Parse custom payload if structured
        let parsedTitle = data.title || 'Live Update ❤️';
        let parsedMessage = data.message || '';
        let parsedMood = '💭 Update';
        let parsedImage = '';

        if (data.tags && data.tags.length > 0) {
            if (data.tags.includes('heart') || data.tags.includes('love')) parsedMood = '💖 Dil Ki Baat';
            else if (data.tags.includes('loudspeaker') || data.tags.includes('bell')) parsedMood = '🚨 Urgent Update';
            else if (data.tags.includes('star') || data.tags.includes('sparkles')) parsedMood = '🌟 Big News';
            else if (data.tags.includes('coffee')) parsedMood = '☕ Random Thought';
            else if (data.tags.includes('pleading_face')) parsedMood = '🥺 Missing You';
        }

        if (data.attachment && data.attachment.url) {
            parsedImage = data.attachment.url;
        }

        const newPost = {
            id: id,
            title: parsedTitle,
            message: parsedMessage,
            mood: parsedMood,
            time: new Date(data.time * 1000).toISOString(),
            sender: 'Harsh',
            avatar: 'assets/images/her1.jpeg',
            image: parsedImage,
            likes: 1,
            hugs: 1
        };

        cachedPosts.unshift(newPost);
        return newPost;
    }

    // Push Notification Permission Handler
    window.enablePushNotifications = async function () {
        const btn = document.getElementById('enableNotifyBtn');

        if (!('Notification' in window)) {
            alert('Push notifications are not supported on this browser.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                if (btn) {
                    btn.classList.add('enabled');
                    btn.innerHTML = '✓ Notifications Active 🔔';
                }
                showToast('🎉 Notifications enabled! You will get instant alerts.');

                // Trigger sample notification test
                if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                    const reg = await navigator.serviceWorker.ready;
                    reg.showNotification('Harsh Updates Active 💖', {
                        body: 'Aapko ab Harsh ke sabhi updates turant phone pe milenge!',
                        icon: './assets/images/icon-192.png',
                        badge: './assets/images/icon-192.png'
                    });
                }
            } else {
                showToast('⚠️ Notification permission denied. Please allow in browser settings.');
            }
        } catch (err) {
            console.error('Notification error', err);
            showToast('Could not enable notifications: ' + err.message);
        }
    };

    // Check existing notification state on page load
    function checkNotificationStatus() {
        const btn = document.getElementById('enableNotifyBtn');
        if (!btn) return;
        if ('Notification' in window && Notification.permission === 'granted') {
            btn.classList.add('enabled');
            btn.innerHTML = '✓ Notifications Active 🔔';
        }
    }

    // Admin Modal Logic
    window.openAdminBroadcastModal = function () {
        const isAuthenticated = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
        if (isAuthenticated) {
            showBroadcastForm();
        } else {
            promptAdminPasscode();
        }
    };

    function promptAdminPasscode() {
        const code = prompt('Enter Admin Passcode to Post Live Update (0411):');
        if (code === '0411' || code === '411') {
            sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
            showBroadcastForm();
        } else if (code !== null) {
            alert('❌ Incorrect Passcode!');
        }
    }

    function showBroadcastForm() {
        const modal = document.getElementById('adminBroadcastModal');
        if (modal) modal.style.display = 'flex';
    }

    window.closeAdminModal = function () {
        const modal = document.getElementById('adminBroadcastModal');
        if (modal) modal.style.display = 'none';
    };

    // Broadcast Submission
    window.sendLiveBroadcast = async function (e) {
        if (e) e.preventDefault();
        const submitBtn = document.getElementById('submitBroadcastBtn');
        const titleInput = document.getElementById('postTitle');
        const messageInput = document.getElementById('postMessage');
        const moodSelect = document.getElementById('postMood');
        const imageInput = document.getElementById('postImage');

        const title = titleInput ? titleInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        const mood = moodSelect ? moodSelect.value : '💭 Update';
        const image = imageInput ? imageInput.value.trim() : '';

        if (!message) {
            alert('Please write a message before sending.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Push Notification... 🚀';
        }

        const tagMap = {
            '💖 Dil Ki Baat': 'heart,sparkles',
            '🥺 Missing You': 'pleading_face,heart',
            '🌟 Big News': 'star,tada',
            '☕ Random Thought': 'coffee,thought_balloon',
            '🚨 Urgent Update': 'loudspeaker,rotating_light'
        };

        const postData = {
            id: 'post-' + Date.now(),
            title: title || 'Dil Ki Baat ❤️',
            message: message,
            mood: mood,
            image: image,
            time: new Date().toISOString(),
            sender: 'Harsh',
            avatar: 'assets/images/her1.jpeg',
            likes: 1,
            hugs: 1
        };

        // 1. Post to NTFY Topic (Triggers Web Push & SSE to all active devices)
        try {
            const headers = {
                'Title': postData.title,
                'Priority': 'urgent',
                'Tags': tagMap[mood] || 'heart',
                'Click': window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'live.html'
            };
            if (image) {
                headers['Attach'] = image;
            }

            await fetch(NTFY_BASE, {
                method: 'POST',
                body: message,
                headers: headers
            });
        } catch (err) {
            console.error('NTFY post broadcast error', err);
        }

        // 2. Add to Local Storage and re-render feed
        cachedPosts.unshift(postData);
        saveStoredPosts(cachedPosts);
        renderFeed();

        // 3. Reset and Close
        if (titleInput) titleInput.value = '';
        if (messageInput) messageInput.value = '';
        if (imageInput) imageInput.value = '';
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Push Notification 🚀';
        }

        window.closeAdminModal();
        showToast('🚀 Broadcast & Push Notification sent to all phones!');
    };

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        cachedPosts = getStoredPosts();
        renderFeed();
        checkNotificationStatus();
        initRealtimeStream();

        // Close modal on click outside
        const modal = document.getElementById('adminBroadcastModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) window.closeAdminModal();
            });
        }
    });
})();
