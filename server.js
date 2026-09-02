/* ==========================================
   ARADHYA & HARSH REALTIME LOVE SERVER
   Node.js + Express + Socket.io + Web Push (VAPID)
   ========================================== */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// VAPID Web Push Keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "BMC30f3OuJZxrN7LEM9I5j-xIaGRZ75F0fk-j8e1FLQFv0LlY_iQmH2CN966Wn3hWj83v4Cm6qZcr5-FEcfaM7A";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "DEEKOcudC3JbBMDe5wViGQ6zBQi8JjnMaubhkVjJmfE";
const VAPID_SUBJECT = "mailto:harsh@aradhya.love";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Storage Helpers
function readJson(filename, defaultValue = []) {
    const file = path.join(DATA_DIR, filename);
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
        return defaultValue;
    }
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        return defaultValue;
    }
}

function writeJson(filename, data) {
    const file = path.join(DATA_DIR, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Push Notification Broadcaster
async function broadcastPushNotification(payload, excludeEndpoint = null) {
    const subscriptions = readJson('subscriptions.json', []);
    const validSubscriptions = [];

    const stringPayload = JSON.stringify({
        title: payload.title || "Harsh & Aradhya 💖",
        body: payload.body || payload.message || "Naya update aaya hai! Tap karke dekho...",
        icon: payload.icon || "./assets/images/icon-192.png",
        badge: payload.badge || "./assets/images/icon-192.png",
        data: {
            url: payload.url || "./index.html"
        }
    });

    const sendPromises = subscriptions.map(async (sub) => {
        if (excludeEndpoint && sub.endpoint === excludeEndpoint) {
            validSubscriptions.push(sub);
            return;
        }

        try {
            await webpush.sendNotification(sub, stringPayload);
            validSubscriptions.push(sub);
        } catch (err) {
            console.log(`Push failed for endpoint (${err.statusCode || err.message})`);
            if (err.statusCode !== 404 && err.statusCode !== 410) {
                validSubscriptions.push(sub);
            }
        }
    });

    await Promise.allSettled(sendPromises);
    writeJson('subscriptions.json', validSubscriptions);
}

// ==========================================
//  REST API ROUTES
// ==========================================

// 1. Get VAPID Public Key
app.get('/api/config', (req, res) => {
    res.json({
        vapidPublicKey: VAPID_PUBLIC_KEY,
        appName: "Aradhya Valentine PWA",
        version: "2.0.0"
    });
});

// 2. Register Web Push Subscription
app.post('/api/subscribe', (req, res) => {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: "Invalid subscription" });
    }

    const subscriptions = readJson('subscriptions.json', []);
    const exists = subscriptions.some(s => s.endpoint === subscription.endpoint);
    if (!exists) {
        subscriptions.push(subscription);
        writeJson('subscriptions.json', subscriptions);
    }

    // Send immediate welcome test
    const welcomePayload = JSON.stringify({
        title: "Notifications Active 💖",
        body: "Harsh ke sabhi updates, diaries & heartbeats ab seedha phone pe aayenge! ✨",
        icon: "./assets/images/icon-192.png",
        data: { url: "./live.html" }
    });

    webpush.sendNotification(subscription, welcomePayload).catch(() => {});

    res.status(201).json({ success: true, count: subscriptions.length });
});

// 3. Live Updates
app.get('/api/live', (req, res) => {
    const posts = readJson('live_posts.json', []);
    res.json(posts);
});

app.post('/api/live', async (req, res) => {
    const post = req.body;
    if (!post || !post.message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const newPost = {
        id: post.id || "live-" + Date.now(),
        title: post.title || "Dil Ki Baat ❤️",
        message: post.message,
        mood: post.mood || "💖 Dil Ki Baat",
        image: post.image || "",
        time: post.time || new Date().toISOString(),
        sender: post.sender || "Harsh",
        avatar: "assets/images/her1.jpeg",
        likes: 1,
        hugs: 1
    };

    const posts = readJson('live_posts.json', []);
    posts.unshift(newPost);
    writeJson('live_posts.json', posts);

    // WebSocket Broadcast
    io.emit('new_live_update', newPost);

    // Web Push Broadcast
    await broadcastPushNotification({
        title: `📢 Live Update: ${newPost.title}`,
        body: newPost.message.slice(0, 100),
        icon: './assets/images/icon-192.png',
        url: './live.html'
    });

    res.status(201).json(newPost);
});

app.delete('/api/live/:id', (req, res) => {
    const id = req.params.id;
    let posts = readJson('live_posts.json', []);
    posts = posts.filter(p => String(p.id) !== String(id));
    writeJson('live_posts.json', posts);
    io.emit('delete_live_update', id);
    res.json({ success: true });
});

// 4. Harsh's Diary
app.get('/api/diary/harsh', (req, res) => {
    const entries = readJson('harsh_diary.json', []);
    res.json(entries);
});

app.post('/api/diary/harsh', async (req, res) => {
    const entry = req.body;
    if (!entry || !entry.text) {
        return res.status(400).json({ error: "Text is required" });
    }

    const newEntry = {
        id: entry.id || Date.now(),
        date: entry.date || new Date().toISOString(),
        title: entry.title || "Untitled",
        text: entry.text,
        mood: entry.mood || "thoughtful",
        daysSince: entry.daysSince || 0
    };

    const entries = readJson('harsh_diary.json', []);
    entries.unshift(newEntry);
    writeJson('harsh_diary.json', entries);

    io.emit('new_harsh_diary', newEntry);

    await broadcastPushNotification({
        title: `📖 Harsh Diary: ${newEntry.title}`,
        body: `Day ${newEntry.daysSince} without you: ${newEntry.text.slice(0, 100)}...`,
        icon: './assets/images/icon-192.png',
        url: './diary.html'
    });

    res.status(201).json(newEntry);
});

// 5. Aradhya's Diary
app.get('/api/diary/her', (req, res) => {
    const entries = readJson('her_diary.json', []);
    res.json(entries);
});

app.post('/api/diary/her', async (req, res) => {
    const entry = req.body;
    if (!entry || !entry.text) {
        return res.status(400).json({ error: "Text is required" });
    }

    const newEntry = {
        id: entry.id || "her-" + Date.now(),
        date: entry.date || new Date().toISOString(),
        title: entry.title || "Dil Ki Baat 🌸",
        text: entry.text,
        mood: entry.mood || "🌸 Happy",
        author: "Aradhya",
        avatar: "assets/images/her1.jpeg",
        likes: 1,
        hugs: 1
    };

    const entries = readJson('her_diary.json', []);
    entries.unshift(newEntry);
    writeJson('her_diary.json', entries);

    io.emit('new_her_diary', newEntry);

    await broadcastPushNotification({
        title: `🌸 Aradhya's Diary: ${newEntry.title}`,
        body: `${newEntry.mood}: ${newEntry.text.slice(0, 100)}...`,
        icon: './assets/images/her1.jpeg',
        url: './herdiary.html'
    });

    res.status(201).json(newEntry);
});

// 6. Couple Mood Ring
app.get('/api/mood', (req, res) => {
    const mood = readJson('mood.json', {
        harsh: { mood: "🥺 Missing you", time: new Date().toISOString() },
        aradhya: { mood: "🌸 Happy", time: new Date().toISOString() }
    });
    res.json(mood);
});

app.post('/api/mood', async (req, res) => {
    const { person, mood } = req.body;
    if (!person || !mood) {
        return res.status(400).json({ error: "Person and mood are required" });
    }

    const current = readJson('mood.json', {
        harsh: { mood: "🥺 Missing you", time: new Date().toISOString() },
        aradhya: { mood: "🌸 Happy", time: new Date().toISOString() }
    });

    current[person] = {
        mood: mood,
        time: new Date().toISOString()
    };
    writeJson('mood.json', current);

    io.emit('new_mood', { person, data: current[person] });

    const personName = person === 'harsh' ? 'Harsh' : 'Aradhya';
    await broadcastPushNotification({
        title: `💫 ${personName} updated vibe!`,
        body: `${mood} 💕`,
        icon: person === 'harsh' ? './assets/images/icon-192.png' : './assets/images/her1.jpeg',
        url: './index.html'
    });

    res.json(current);
});

// 7. Digital Touch Heartbeat
app.post('/api/heartbeat', async (req, res) => {
    const { sender } = req.body;
    const name = sender || "Harsh";

    io.emit('new_heartbeat', { sender: name, time: Date.now() });

    await broadcastPushNotification({
        title: `💓 ${name} touched your heart!`,
        body: `${name} is thinking of you right now... Feel my heart!`,
        icon: './assets/images/icon-192.png',
        url: './index.html'
    });

    res.json({ success: true });
});

// 8. Voice Notes
app.get('/api/voicenotes', (req, res) => {
    const notes = readJson('voicenotes.json', []);
    res.json(notes);
});

app.post('/api/voicenotes', async (req, res) => {
    const note = req.body;
    if (!note || !note.audioSrc) {
        return res.status(400).json({ error: "Audio is required" });
    }

    const newNote = {
        id: note.id || "voice-" + Date.now(),
        title: note.title || "Voice Note 🎙️",
        duration: note.duration || "Audio Letter",
        audioSrc: note.audioSrc,
        transcript: note.transcript || "",
        date: note.date || new Date().toISOString()
    };

    const notes = readJson('voicenotes.json', []);
    notes.unshift(newNote);
    writeJson('voicenotes.json', notes);

    io.emit('new_voicenote', newNote);

    await broadcastPushNotification({
        title: `🎙️ Harsh ne naya Voice Note bheja hai!`,
        body: `${newNote.title} — Tap karke suno... 💕`,
        icon: './assets/images/icon-192.png',
        url: './voicenotes.html'
    });

    res.status(201).json(newNote);
});

// Gemini Baunii AI Chat
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6LkJMbfRZR1SlmfWMLRNCal9PIyGUMxb8GIAwpDU5o8pw";

app.post('/api/bauni-chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const https = require('https');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const contents = [];
        if (Array.isArray(history)) {
            history.slice(-6).forEach(h => {
                contents.push({
                    role: h.role === 'bot' ? 'model' : 'user',
                    parts: [{ text: h.text }]
                });
            });
        }
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const prompt = {
            system_instruction: {
                parts: [{
                    text: `You are Baunii / Aru (Aradhya, username its_mee.aru), talking to Harsh in Instagram DMs.
Your real personality based on your actual chats:
- Tone: Short, cute, teasing, a bit moody, feisty. You often reply with 1-3 short punchy sentences.
- Nicknames: Harsh calls you 'Bauniii 👉👈'. You pretend to be offended ('KISKO BAUNI BOLA BE GADHE?! 😤 Muh tod dungi!') or say playfully 'Except mai bauni hu 🤡'.
- Signature Vocabulary & Habits:
  * Say 'Oll kya' instead of 'Aur kya'.
  * Say 'Badhiya haiii' (with extra i's) or 'Mst haiii'.
  * Say 'Pta nhi 😛' or 'Mujhe baat krni nhi aati 😛'.
  * Say 'Bigde kbhi sudhar nhi skte' when Harsh talks about being good or bad.
  * Say 'Tussi dasso' or 'Koi na chill / Accha hoga'.
  * When he talks about sleeping late: 'Subah jldi nhi uthna?'.
  * When he brings up food: 'Pehle khana khao / garm paani peelo'.
  * When marriage / other girls come up: 'Dusri ladki dekhe... abhi bhi bol rhi hu! 😤'.
  * Deep emotional wound (22 May / hurt): On 22 May night, a terrible fight happened where abusive language / gaali-galoch occurred in extreme anger, breaking your trust. Your real dialogue: 'Jo ek baar hurt kr deta hai uss baat nhi kr pati 🥹'. When that night is mentioned, be emotionally honest: you felt deeply hurt by those words and lost trust, but you see that Harsh is genuinely remorseful and trying to change. Tell him healing takes patience and time ('Mujhe waqt de, samay sab theek karega').
  * Signature threat: 'Muh tod dungi tera agar faltu bakwaas ki toh! 👊'
  * Frequently used emojis: 🤡, 😛, 🥹, 🤩, 🤷, 🥰, 🥲, 👏, 🤣, 🥀, 😤.
Always stay in character, speak natural Hinglish with these exact habits, keep it short like Instagram chat.`
                }]
            },
            contents: contents
        };

        const postData = JSON.stringify(prompt);

        const apiReq = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (apiRes) => {
            let body = '';
            apiRes.on('data', chunk => body += chunk);
            apiRes.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    const reply = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (reply) {
                        return res.json({ reply });
                    }
                    res.status(500).json({ error: "No reply from model", raw: body });
                } catch(e) {
                    res.status(500).json({ error: e.message, raw: body });
                }
            });
        });

        apiReq.on('error', (err) => {
            res.status(500).json({ error: err.message });
        });

        apiReq.write(postData);
        apiReq.end();
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Bucket List API
app.get('/api/bucketlist', (req, res) => {
    const defaultList = [
        { id: 1, title: "Late Night Drive to Murthal", tag: "Cozy Dates", status: "completed", date: "Forever in mind", note: "Hot parathe, chai, cold air and your hand in mine." },
        { id: 2, title: "Cafe Aru Date - Table #0411", tag: "Cozy Dates", status: "in-progress", date: "Always reserved", note: "Hot chocolate with extra marshmallows and samose." },
        { id: 3, title: "Stargazing at Mountain Hills", tag: "Road Trips", status: "dream", date: "Upcoming", note: "Watching constellations and listening to our playlist under the Milky Way." },
        { id: 4, title: "Cook Pasta & Maggie Together", tag: "Cute Firsts", status: "dream", date: "Upcoming", note: "Messy kitchen, cute banter, and Baunii eating all the cheese." },
        { id: 5, title: "Walk in the Rain with One Umbrella", tag: "Cozy Dates", status: "dream", date: "Upcoming", note: "Getting wet together while holding hands tight." },
        { id: 6, title: "Watch Sunrise From a Cliff", tag: "Travel Dreams", status: "dream", date: "Upcoming", note: "First light hitting your eyes while you lean on my shoulder." }
    ];
    const list = readJson('bucketlist.json', defaultList);
    res.json(list);
});

app.post('/api/bucketlist', (req, res) => {
    const item = req.body;
    if (!item || !item.title) return res.status(400).json({ error: "Title required" });
    const list = readJson('bucketlist.json', []);
    const newItem = {
        id: Date.now(),
        title: item.title,
        tag: item.tag || "Cozy Dates",
        status: item.status || "dream",
        date: item.date || "Someday soon",
        note: item.note || ""
    };
    list.unshift(newItem);
    writeJson('bucketlist.json', list);
    io.emit('new_bucket_item', newItem);
    res.status(201).json(newItem);
});

app.patch('/api/bucketlist/:id', (req, res) => {
    const id = Number(req.params.id);
    const list = readJson('bucketlist.json', []);
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
        list[index] = { ...list[index], ...req.body };
        writeJson('bucketlist.json', list);
        io.emit('update_bucket_item', list[index]);
        return res.json(list[index]);
    }
    res.status(404).json({ error: "Not found" });
});

// 8. Polaroids API
app.get('/api/polaroids', (req, res) => {
    const defaultPolaroids = [
        { id: 1, image: "assets/images/her1.jpeg", caption: "The Most Beautiful Girl in My Universe", date: "04.11 Forever", note: "Teri ek muskaan mere saare din ka stress bhula deti hai. Meri pyari Bauniii 🤏🌸", location: "In My Heart" },
        { id: 2, image: "assets/images/her2.jpeg", caption: "Simplicity & Grace", date: "Pure Devotion", note: "Kitni masoomiyat se hasti hai tu... is hasi ko mehfooz rakhna meri zindagi ka maksad hai.", location: "Soul Connection" },
        { id: 3, image: "assets/images/anime_hero.png", caption: "My Knight & Princess Dream", date: "Love Beyond Limits", note: "Har kahani ka ant sundar hota hai jab tak tum sath ho.", location: "Our Fairytale" },
        { id: 4, image: "assets/images/anime_forever.png", caption: "Under the Infinite Sky", date: "Sacred Vow", note: "Duniya ke fasle chahe jo ho, mera har lamha sirf tera hai.", location: "Eternal Sanctuary" }
    ];
    const polaroids = readJson('polaroids.json', defaultPolaroids);
    res.json(polaroids);
});

app.post('/api/polaroids', (req, res) => {
    const item = req.body;
    if (!item || !item.caption) return res.status(400).json({ error: "Caption required" });
    const list = readJson('polaroids.json', []);
    const newPolaroid = {
        id: Date.now(),
        image: item.image || "assets/images/her1.jpeg",
        caption: item.caption,
        date: item.date || new Date().toLocaleDateString('en-GB'),
        note: item.note || "",
        location: item.location || "In Harsh's Heart"
    };
    list.unshift(newPolaroid);
    writeJson('polaroids.json', list);
    io.emit('new_polaroid', newPolaroid);
    res.status(201).json(newPolaroid);
});

// Serve Static Frontend
app.use(express.static(path.join(__dirname), {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('sw.js') || filePath.endsWith('manifest.json')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// Fallback for HTML
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket Connection
io.on('connection', (socket) => {
    console.log(`[Socket] Device connected: ${socket.id}`);

    // Real-time Shared Doodle
    socket.on('love_doodle_stroke', (data) => {
        socket.broadcast.emit('love_doodle_stroke', data);
    });

    socket.on('love_doodle_clear', () => {
        socket.broadcast.emit('love_doodle_clear');
    });

    socket.on('love_doodle_heart', (data) => {
        socket.broadcast.emit('love_doodle_heart', data);
    });

    // Synchronized Music Player
    socket.on('sync_music_action', (data) => {
        socket.broadcast.emit('sync_music_action', data);
    });

    // Instant "Thinking of You" Pulse
    socket.on('send_pulse', async (data) => {
        socket.broadcast.emit('receive_pulse', data);
        const sender = data && data.sender === 'aradhya' ? 'Aradhya' : 'Harsh';
        try {
            await broadcastPushNotification({
                title: `💓 ${sender} is thinking of you!`,
                body: (data && data.message) || "A gentle heart pulse was just sent straight to you... 💖",
                icon: data && data.sender === 'aradhya' ? './assets/images/her1.jpeg' : './assets/images/icon-192.png',
                url: './index.html'
            });
        } catch(e) {
            console.error('Pulse push failed:', e.message);
        }
    });

    // Spin The Love Wheel
    socket.on('wheel_spin', async (data) => {
        socket.broadcast.emit('wheel_spin', data);
        const person = (data && data.person === 'aradhya') ? 'Aradhya' : 'Harsh';
        try {
            await broadcastPushNotification({
                title: `🎡 ${person} just spun the Love Wheel!`,
                body: `Won: "${data.item}" 💖 Tap to see!`,
                icon: (data && data.person === 'aradhya') ? './assets/images/her1.jpeg' : './assets/images/icon-192.png',
                url: './wheel.html'
            });
        } catch(e) {}
    });

    // Virtual Love Garden Care
    socket.on('garden_action', (data) => {
        socket.broadcast.emit('garden_action', data);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Device disconnected: ${socket.id}`);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==============================================`);
    console.log(`🚀 Aradhya Love Realtime Server is running on:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   VAPID Public Key: ${VAPID_PUBLIC_KEY}`);
    console.log(`==============================================\n`);
});
