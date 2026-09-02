/* ==========================================
   UNIFIED REALTIME CLIENT (SOCKET.IO + VAPID PUSH)
   Works on VPS / Node.js Server & Cloud Fallback
   ========================================== */

(function () {
    const VAPID_PUBLIC_KEY = "BMC30f3OuJZxrN7LEM9I5j-xIaGRZ75F0fk-j8e1FLQFv0LlY_iQmH2CN966Wn3hWj83v4Cm6qZcr5-FEcfaM7A";
    const API_BASE = window.location.origin;

    let socket = null;
    const listeners = {};

    function initSocket() {
        if (typeof io !== 'undefined') {
            try {
                socket = io(API_BASE, {
                    transports: ['websocket', 'polling'],
                    reconnectionAttempts: 10,
                    reconnectionDelay: 1000
                });

                socket.on('connect', () => {
                    console.log('[Realtime] Socket connected to VPS server! 🚀');
                });

                const eventNames = [
                    'new_live_update',
                    'delete_live_update',
                    'new_heartbeat',
                    'new_mood',
                    'new_harsh_diary',
                    'new_her_diary',
                    'new_voicenote',
                    'love_doodle_stroke',
                    'love_doodle_clear',
                    'love_doodle_heart',
                    'sync_music_action',
                    'receive_pulse',
                    'new_bucket_item',
                    'update_bucket_item',
                    'new_polaroid',
                    'wheel_spin',
                    'garden_action'
                ];

                eventNames.forEach(evt => {
                    socket.on(evt, (data) => {
                        if (listeners[evt]) {
                            listeners[evt].forEach(cb => cb(data));
                        }
                    });
                });
            } catch (err) {
                console.log('[Realtime] Socket init fallback notice:', err);
            }
        }
    }

    // Helper: Convert VAPID key to Uint8Array
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Web Push Registration Helper (Real Native Push to Google FCM & Apple APNS)
    async function subscribeToPushNotifications() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert('Push notifications not supported on this browser.');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                return false;
            }

            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();

            if (!sub) {
                const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
                sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey
                });
            }

            // Send to VPS backend
            await fetch('/api/subscribe', {
                method: 'POST',
                body: JSON.stringify(sub),
                headers: { 'Content-Type': 'application/json' }
            });

            return true;
        } catch (err) {
            console.error('[Realtime] Push subscribe error:', err);
            return false;
        }
    }

    // Global Realtime Interface
    window.RealtimeClient = {
        emit: function (event, data) {
            if (socket) socket.emit(event, data);
        },
        getSocket: function () {
            return socket;
        },
        on: function (event, callback) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(callback);
        },

        subscribePush: subscribeToPushNotifications,

        // 1. Live Posts
        getLivePosts: async function () {
            try {
                const res = await fetch('/api/live');
                if (res.ok) return await res.json();
            } catch(e) {}
            return [];
        },
        sendLivePost: async function (postData) {
            try {
                const res = await fetch('/api/live', {
                    method: 'POST',
                    body: JSON.stringify(postData),
                    headers: { 'Content-Type': 'application/json' }
                });
                return await res.json();
            } catch(e) {
                console.error(e);
            }
        },
        deleteLivePost: async function (id) {
            try {
                await fetch(`/api/live/${id}`, { method: 'DELETE' });
            } catch(e) {}
        },

        // 2. Harsh Diary
        getHarshDiary: async function () {
            try {
                const res = await fetch('/api/diary/harsh');
                if (res.ok) return await res.json();
            } catch(e) {}
            return [];
        },
        sendHarshDiary: async function (entry) {
            try {
                const res = await fetch('/api/diary/harsh', {
                    method: 'POST',
                    body: JSON.stringify(entry),
                    headers: { 'Content-Type': 'application/json' }
                });
                return await res.json();
            } catch(e) {}
        },

        // 3. Her Diary
        getHerDiary: async function () {
            try {
                const res = await fetch('/api/diary/her');
                if (res.ok) return await res.json();
            } catch(e) {}
            return [];
        },
        sendHerDiary: async function (entry) {
            try {
                const res = await fetch('/api/diary/her', {
                    method: 'POST',
                    body: JSON.stringify(entry),
                    headers: { 'Content-Type': 'application/json' }
                });
                return await res.json();
            } catch(e) {}
        },

        // 4. Mood Sync
        getMood: async function () {
            try {
                const res = await fetch('/api/mood');
                if (res.ok) return await res.json();
            } catch(e) {}
            return null;
        },
        sendMood: async function (person, mood) {
            try {
                const res = await fetch('/api/mood', {
                    method: 'POST',
                    body: JSON.stringify({ person, mood }),
                    headers: { 'Content-Type': 'application/json' }
                });
                return await res.json();
            } catch(e) {}
        },

        // 5. Heartbeat Touch
        sendHeartbeat: async function (sender) {
            try {
                await fetch('/api/heartbeat', {
                    method: 'POST',
                    body: JSON.stringify({ sender }),
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch(e) {}
        },

        // 6. Voice Notes
        getVoiceNotes: async function () {
            try {
                const res = await fetch('/api/voicenotes');
                if (res.ok) return await res.json();
            } catch(e) {}
            return [];
        },
        sendVoiceNote: async function (note) {
            try {
                const res = await fetch('/api/voicenotes', {
                    method: 'POST',
                    body: JSON.stringify(note),
                    headers: { 'Content-Type': 'application/json' }
                });
                return await res.json();
            } catch(e) {}
        }
    };

    document.addEventListener("DOMContentLoaded", initSocket);
})();
