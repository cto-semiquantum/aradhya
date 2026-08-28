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

    // Realtime Listener
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
