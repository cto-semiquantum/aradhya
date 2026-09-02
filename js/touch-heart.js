/* ==========================================
   LIVE TOUCH MY HEART (DIGITAL TOUCH)
   Realtime Haptic Heartbeat Pub/Sub
   ========================================== */

(function () {
    const HEART_TOPIC = 'harsh_aradhya_heartbeat_sync_411';
    const NTFY_URL = 'https://ntfy.sh/' + HEART_TOPIC;

    // Trigger local heartbeat animation & vibration
    window.receiveHeartbeatEffect = function (senderName) {
        // 1. Phone Vibration
        if (navigator.vibrate) {
            navigator.vibrate([120, 80, 200, 100, 300]);
        }

        // 2. Visual Fullscreen Pulse Overlay
        let overlay = document.getElementById('digitalTouchOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'digitalTouchOverlay';
            overlay.innerHTML = `
                <div class="heart-pulse-glow">
                    <div class="huge-pulse-heart">💓</div>
                    <div class="pulse-sender-text" id="pulseSenderText">Someone touched your heart</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const textEl = document.getElementById('pulseSenderText');
        if (textEl) {
            textEl.textContent = `${senderName || 'Someone'} touched your heart right now… 💓`;
        }

        overlay.classList.add('active');
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 3000);

        if (window.triggerHeartbeat) window.triggerHeartbeat();
    };

    // Send Digital Touch Heartbeat
    window.sendHeartbeatTouch = async function (senderName) {
        const name = senderName || (sessionStorage.getItem('aradhya_user_identity') || 'Harsh');
        const receiver = (name === 'Aradhya') ? 'Harsh' : 'Aradhya';

        // Local effect immediately
        window.receiveHeartbeatEffect('You');

        try {
            await fetch(NTFY_URL, {
                method: 'POST',
                body: JSON.stringify({ sender: name, time: Date.now() }),
                headers: {
                    'Title': `💓 ${name} touched your heart!`,
                    'Priority': 'urgent',
                    'Tags': 'heartpulse,sparkling_heart',
                    'Click': window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'index.html'
                }
            });
        } catch(e) {
            console.error('Heartbeat send error', e);
        }
    };

    // Instant "Thinking of You" Pulse
    window.sendThinkingOfYouPulse = function () {
        const name = sessionStorage.getItem('aradhya_user_identity') || 'Harsh';
        window.receiveHeartbeatEffect('You');

        if (window.RealtimeClient) {
            window.RealtimeClient.emit('send_pulse', {
                sender: name.toLowerCase(),
                message: `${name} is thinking of you right now... 🌸`
            });
        }
        showToastNotification(`✨ "Thinking of You" pulse beamed to ${name === 'Aradhya' ? 'Harsh' : 'Aradhya'}! 💖`);
    };

    function showToastNotification(text) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            background: rgba(22, 10, 36, 0.95); border: 1px solid rgba(255, 75, 145, 0.5);
            color: #fff; padding: 12px 24px; border-radius: 50px; font-size: 13.5px;
            font-weight: 600; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 99999;
            backdrop-filter: blur(15px); animation: fadeIn 0.3s ease;
        `;
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2800);
    }

    // Socket.io Realtime Listener
    if (window.RealtimeClient) {
        window.RealtimeClient.on('receive_pulse', (data) => {
            const sender = (data && data.sender === 'aradhya') ? 'Aradhya' : 'Harsh';
            window.receiveHeartbeatEffect(sender);
            showToastNotification(`💓 ${sender} is thinking of you right now... ✨`);
        });
    }

    // NTFY SSE Fallback Listener
    try {
        const es = new EventSource(NTFY_URL + '/sse');
        es.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data);
                if (data.event === 'message' && data.message) {
                    let parsed = null;
                    try { parsed = JSON.parse(data.message); } catch(err) {}
                    if (parsed && parsed.sender) {
                        window.receiveHeartbeatEffect(parsed.sender);

                        // If backgrounded, show push
                        if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
                            if ('serviceWorker' in navigator) {
                                navigator.serviceWorker.ready.then(reg => {
                                    reg.showNotification(`💓 ${parsed.sender} touched your heart!`, {
                                        body: `${parsed.sender} is thinking of you right now...`,
                                        icon: './assets/images/icon-192.png',
                                        vibrate: [120, 80, 200, 100, 300]
                                    });
                                });
                            }
                        }
                    }
                }
            } catch(e) {}
        };
    } catch(e) {}
})();
