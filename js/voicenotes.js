/* ==========================================
   VOICE NOTES VAULT JS
   In-App Microphone Recorder & Cassette Player
   ========================================== */

(function () {
    const STORAGE_KEY = "harsh_recorded_voicenotes_v1";
    const CLOUD_TOPIC = "harsh_voicenotes_cloud_sync_411";
    const CLOUD_URL = "https://ntfy.sh/" + CLOUD_TOPIC;

    let mediaRecorder = null;
    let audioChunks = [];
    let recordInterval = null;
    let recordSeconds = 0;
    let recordedAudioBlob = null;
    let currentAudio = null;
    let activeIndex = -1;

    const DEFAULT_NOTES = [
        {
            id: "note-1",
            title: "🌙 Late Night Voice Note: Jab Neend Na Aaye",
            duration: "1:15",
            audioSrc: "assets/music3.mp3",
            transcript: "Aradhya… Raat ke 2 baj rahe hain aur bas tumhara khayal aa raha tha. Pata nahi tum so gayi ho ya jaag rahi ho, par bas itna bolna tha ki chahe kuch bhi ho jaye, mera dil hamesha sirf tumhara hai. Good night my peace. ❤️",
            date: "2026-08-28T09:00:00.000Z"
        }
    ];

    let allNotes = [];

    function getStoredNotes() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch(e) {}
        return [...DEFAULT_NOTES];
    }

    function saveStoredNotes(notes) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch(e) {}
    }

    function renderNotes() {
        const listEl = document.getElementById("notesList");
        if (!listEl) return;

        if (allNotes.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; padding: 25px; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); border-radius: 16px;">
                    <div style="font-size: 30px; margin-bottom: 8px;">🎙️</div>
                    <p>Abhi tak koi voice note record nahi hua hai.</p>
                    <p style="font-size: 12px; color: #ff99ac;">Harsh "Record Voice Note" par tap karke naya note bol sakta hai!</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = allNotes.map((note, idx) => `
            <div class="note-item ${idx === activeIndex ? 'active' : ''}" onclick="window.playNote(${idx})">
                <div class="note-meta">
                    <strong>${escapeHtml(note.title)}</strong>
                    <span>⏱️ ${note.duration || 'Voice Note'} • Synced Online ☁️</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="note-play-icon">${idx === activeIndex ? '⏸️' : '▶️'}</div>
                </div>
            </div>
        `).join("");
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.playNote = function (idx) {
        const audioEl = document.getElementById("voicePlayerAudio");
        const transcriptEl = document.getElementById("noteTranscript");
        const spools = document.querySelectorAll(".tape-spool");
        const waves = document.querySelectorAll(".wave-bar");

        if (activeIndex === idx && currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            spools.forEach(s => s.classList.remove("spinning"));
            waves.forEach(w => w.classList.remove("playing"));
            activeIndex = -1;
            renderNotes();
            return;
        }

        activeIndex = idx;
        const note = allNotes[idx];

        if (audioEl) {
            audioEl.src = note.audioSrc;
            audioEl.play().then(() => {
                currentAudio = audioEl;
                spools.forEach(s => s.classList.add("spinning"));
                waves.forEach(w => w.classList.add("playing"));
            }).catch(() => {});
        }

        if (transcriptEl) {
            if (note.transcript) {
                transcriptEl.innerHTML = `<strong>Letter Transcript / Message:</strong><br>${escapeHtml(note.transcript)}`;
                transcriptEl.style.display = "block";
            } else {
                transcriptEl.style.display = "none";
            }
        }

        renderNotes();
        if (window.triggerHeartbeat) window.triggerHeartbeat();
    };

    // ==========================================
    //  MICROPHONE RECORDING ENGINE (HARSH)
    // ==========================================

    window.openRecorderModal = function () {
        const code = prompt("Enter Passcode to Record Voice Note (0411):");
        if (code === "0411" || code === "411") {
            const modal = document.getElementById("recorderModal");
            if (modal) modal.style.display = "flex";
        } else if (code !== null) {
            alert("❌ Incorrect Passcode!");
        }
    };

    window.closeRecorderModal = function () {
        const modal = document.getElementById("recorderModal");
        if (modal) modal.style.display = "none";
        window.stopRecordingAudio();
    };

    window.toggleRecordAudio = async function () {
        const btn = document.getElementById("recordMicBtn");
        const timerEl = document.getElementById("recordTimer");
        const previewBox = document.getElementById("recordPreviewBox");

        if (mediaRecorder && mediaRecorder.state === "recording") {
            // Stop recording
            mediaRecorder.stop();
            clearInterval(recordInterval);
            if (btn) {
                btn.classList.remove("recording");
                btn.innerHTML = "● Record";
            }
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    recordedAudioBlob = new Blob(audioChunks, { type: "audio/webm" });
                    const audioUrl = URL.createObjectURL(recordedAudioBlob);
                    const previewAudio = document.getElementById("previewAudioEl");
                    if (previewAudio) {
                        previewAudio.src = audioUrl;
                        if (previewBox) previewBox.style.display = "block";
                    }
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                recordSeconds = 0;
                if (timerEl) timerEl.textContent = "00:00";
                if (btn) {
                    btn.classList.add("recording");
                    btn.innerHTML = "■ Stop";
                }
                if (previewBox) previewBox.style.display = "none";

                recordInterval = setInterval(() => {
                    recordSeconds++;
                    const m = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
                    const s = String(recordSeconds % 60).padStart(2, '0');
                    if (timerEl) timerEl.textContent = `${m}:${s}`;
                }, 1000);

            } catch (err) {
                alert("Microphone permission allow karein record karne ke liye!");
                console.error(err);
            }
        }
    };

    window.stopRecordingAudio = function () {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            clearInterval(recordInterval);
            const btn = document.getElementById("recordMicBtn");
            if (btn) {
                btn.classList.remove("recording");
                btn.innerHTML = "● Record";
            }
        }
    };

    window.handleAudioFileUpload = function (e) {
        const file = e.target.files[0];
        if (file) {
            recordedAudioBlob = file;
            const audioUrl = URL.createObjectURL(file);
            const previewAudio = document.getElementById("previewAudioEl");
            const previewBox = document.getElementById("recordPreviewBox");
            if (previewAudio) previewAudio.src = audioUrl;
            if (previewBox) previewBox.style.display = "block";
        }
    };

    // Save & Publish Voice Note
    window.saveAndPublishVoiceNote = async function (e) {
        if (e) e.preventDefault();
        const titleInput = document.getElementById("voiceNoteTitle");
        const transcriptInput = document.getElementById("voiceNoteTranscript");
        const saveBtn = document.getElementById("saveVoiceBtn");

        const title = titleInput ? titleInput.value.trim() : "Dil Ki Baat 🎙️";
        const transcript = transcriptInput ? transcriptInput.value.trim() : "";

        if (!recordedAudioBlob) {
            alert("Pehle mic se audio record karein ya file select karein!");
            return;
        }

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = "Uploading & Sending Push Notification... 🚀";
        }

        // Convert Blob to Base64 data URL
        const reader = new FileReader();
        reader.onloadend = async function () {
            const base64Audio = reader.result;

            const durationText = `${String(Math.floor(recordSeconds / 60)).padStart(2, '0')}:${String(recordSeconds % 60).padStart(2, '0')}`;

            const newNote = {
                id: "voice-" + Date.now(),
                title: title || "Voice Note 🎙️",
                duration: recordSeconds > 0 ? durationText : "Audio Letter",
                audioSrc: base64Audio,
                transcript: transcript,
                date: new Date().toISOString()
            };

            // 1. Save locally
            allNotes.unshift(newNote);
            saveStoredNotes(allNotes);
            renderNotes();

            // 2. Broadcast to Cloud Topic & Push Notification
            try {
                await fetch(CLOUD_URL, {
                    method: "POST",
                    body: JSON.stringify({
                        id: newNote.id,
                        title: newNote.title,
                        duration: newNote.duration,
                        audioSrc: base64Audio,
                        transcript: transcript,
                        date: newNote.date
                    }),
                    headers: {
                        "Title": `🎙️ Harsh ne naya Voice Note bheja hai!`,
                        "Priority": "urgent",
                        "Tags": "microphone,heart",
                        "Click": window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'voicenotes.html'
                    }
                });
            } catch (err) {
                console.error("Voice note cloud error", err);
            }

            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = "Send Voice Note to Aradhya 🚀";
            }

            window.closeRecorderModal();
            alert("🎙️ Voice Note successfully send & save ho gaya! Aradhya ke phone par notification chala gaya 💕");
        };

        reader.readAsDataURL(recordedAudioBlob);
    };

    // Realtime Cloud Sync
    function initCloudSync() {
        fetch(CLOUD_URL + "/json?poll=1&since=all")
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split("\n");
                let hasNew = false;
                const localIds = new Set(allNotes.map(e => String(e.id)));

                lines.forEach(line => {
                    if (!line) return;
                    try {
                        const data = JSON.parse(line);
                        if (data.event === "message" && data.message) {
                            let parsed = JSON.parse(data.message);
                            if (parsed && parsed.id && !localIds.has(String(parsed.id))) {
                                allNotes.unshift(parsed);
                                localIds.add(String(parsed.id));
                                hasNew = true;
                            }
                        }
                    } catch(e) {}
                });

                if (hasNew) {
                    saveStoredNotes(allNotes);
                    renderNotes();
                }
            })
            .catch(err => console.log("Voice notes sync notice", err));

        try {
            const es = new EventSource(CLOUD_URL + "/sse");
            es.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === "message" && data.message) {
                        const parsed = JSON.parse(data.message);
                        if (parsed && parsed.id) {
                            if (!allNotes.some(e => String(e.id) === String(parsed.id))) {
                                allNotes.unshift(parsed);
                                saveStoredNotes(allNotes);
                                renderNotes();

                                if ('Notification' in window && Notification.permission === 'granted') {
                                    if ('serviceWorker' in navigator) {
                                        navigator.serviceWorker.ready.then(reg => {
                                            reg.showNotification("🎙️ Harsh's New Voice Note", {
                                                body: `${parsed.title || 'Naya Voice Note'} — Tap karke suno...`,
                                                icon: './assets/images/her1.jpeg'
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch(e) {}
            };
        } catch(e) {}
    }

    document.addEventListener("DOMContentLoaded", () => {
        allNotes = getStoredNotes();
        renderNotes();
        initCloudSync();

        const audioEl = document.getElementById("voicePlayerAudio");
        if (audioEl) {
            audioEl.addEventListener("ended", () => {
                const spools = document.querySelectorAll(".tape-spool");
                const waves = document.querySelectorAll(".wave-bar");
                spools.forEach(s => s.classList.remove("spinning"));
                waves.forEach(w => w.classList.remove("playing"));
                activeIndex = -1;
                renderNotes();
            });
        }
    });
})();
