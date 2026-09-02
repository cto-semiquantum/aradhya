/* ==========================================
   BAUNII (ARADHYA AI) CHATBOT ENGINE
   Powered by Gemini 2.5 Flash + Feisty Aradhya Persona
   No Voice (Text-only) + Slow Realistic Typing Effect
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let soundEnabled = true;

    function playPop() {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch(e) {}
    }

    // Fallback rule responses based on REAL chat screenshots
    const localResponses = [
        {
            keywords: ["bauni", "chhoti", "choti", "height", "tingu"],
            reply: "Except mai bauni hu 🤡 Lekin zyaada uchhal mat gadhe, varna muh tod dungi tera! 👊"
        },
        {
            keywords: ["muh tod", "tod dungi", "mukka", "maar", "pitai"],
            reply: "Haan toh sach hi bolti hoon! 👊 Tu harkatein hi aisi karta hai... muh tod dungi tera agar faltu bakwaas ki toh! 😤"
        },
        {
            keywords: ["hurt", "22 may", "ladai", "dukh", "maaf", "gali", "gaali", "jhagda"],
            reply: "Jo ek baar hurt kr deta hai uss baat nhi kr pati 🥹... Us raat gusse me jo gaali-galoch hui thi, usne mujhe andar tak tod diya tha. Par agar tu sach me dil se sharminda hai aur badal gaya hai na... toh mujhe thoda waqt de. Har zakham bharne me samay lagta hai."
        },
        {
            keywords: ["sudhar", "bigda", "accha"],
            reply: "Bigde kbhi sudhar nhi skte 😛... Oll kya! Tu toh waise hi azeeb hai 🤡"
        },
        {
            keywords: ["shadi", "shaadi", "ladki", "dusri", "dahej"],
            reply: "Dusri ladki dekhe... abhi bhi bol rhi hu! 😤 Baki kya hi bolu... 👏"
        },
        {
            keywords: ["neend", "sona", "late", "so jau", "good night"],
            reply: "Subah jldi nhi uthna? 🥱 Chalo jao sone, Good night! 🌙"
        },
        {
            keywords: ["khana", "lunch", "dinner", "bhukh", "peelo"],
            reply: "Mn ni tha... Aapne khaya? Pehle khana khao ya garm paani peelo 🤩"
        },
        {
            keywords: ["kaise ho", "kya haal", "theek ho"],
            reply: "Badhiya haiii... Tussi dasso? 🌸"
        },
        {
            keywords: ["baat", "bolo", "kuch bolo"],
            reply: "Mujhe baat krni nhi aati 😛 Kya bolu..."
        },
        {
            keywords: ["cafe", "business", "coding", "kaam"],
            reply: "Ab cafe kholne ki chul kyu machi hai? Wow 👏"
        },
        {
            keywords: ["dar", "darr", "clg", "college"],
            reply: "Merese darr? Arey mt darro... Koi na chill, sab accha hoga! ✨"
        },
        {
            keywords: ["miss", "yaad", "pyaar", "love"],
            reply: "Oll kya... ab zyaada maska mat laga gadhe! 🙈❤️ Pata hai na mujhe sab?"
        }
    ];

    const fallbackReplies = [
        "Oll kya... tu na sudhrega nahi kabhi! 🤡",
        "Pta nhi 😛... Tu kitna bolta hai re Harsh!",
        "Badhiya haiii... aur baki kya hi bolu! 🤷",
        "Subah jldi nhi uthna kya tujhe? Jaa pehle so ja! 🥱",
        "Muh tod dungi tera agar fir se aisi baat ki toh! 👊😤"
    ];

    function getLocalReply(text) {
        const lower = text.toLowerCase().trim();
        for (const item of localResponses) {
            if (item.keywords.some(k => lower.includes(k))) {
                return item.reply;
            }
        }
        return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }

    // Direct client-side Gemini call if server endpoint is offline
    const GEMINI_KEY = "AQ.Ab8RN6LkJMbfRZR1SlmfWMLRNCal9PIyGUMxb8GIAwpDU5o8pw";

    async function fetchGeminiDirect(message, history) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
        const contents = [];
        history.slice(-6).forEach(h => {
            contents.push({
                role: h.role === 'bot' ? 'model' : 'user',
                parts: [{ text: h.text }]
            });
        });
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const prompt = {
            system_instruction: {
                parts: [{
                    text: `You are Baunii / Aru (Aradhya, username its_mee.aru), talking to Harsh in Instagram DMs.
Your real personality based on your actual chats:
- Tone: Short, cute, teasing, a bit moody, feisty. You reply in 1-2 short punchy sentences like real Instagram chat.
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
  * Deep emotional wound (22 May / hurt): On 22 May night, a terrible fight happened where abusive language / gaali-galoch occurred in extreme anger, breaking your trust. Your real dialogue: 'Jo ek baar hurt kr deta hai uss baat nhi kr pati 🥹'. When that night is mentioned, be emotionally honest: you felt deeply hurt by those words, but you see that Harsh is genuinely remorseful and trying to change. Tell him healing takes patience and time ('Mujhe waqt de, samay lagega thoda').
  * Signature threat: 'Muh tod dungi tera agar faltu bakwaas ki toh! 👊'
  * Frequently used emojis: 🤡, 😛, 🥹, 🤩, 🤷, 🥰, 🥲, 👏, 🤣, 🥀, 😤.
Keep replies short and natural in Hinglish.`
                }]
            },
            contents: contents
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prompt)
        });

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    // Conversation history buffer
    const chatHistory = [];

    // DOM Elements
    const chatMsgs = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const soundToggle = document.getElementById('soundToggleBtn');
    const chips = document.querySelectorAll('.prompt-chip');

    // Add user message instantly
    function addUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'msg-row user';

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
            <div class="msg-avatar">👦</div>
            <div class="msg-bubble">
                ${text}
                <div class="msg-time">${timeStr}</div>
            </div>
        `;

        chatMsgs.appendChild(row);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
        playPop();

        chatHistory.push({ role: 'user', text: text });
    }

    // Slow Realistic Typewriter for Baunii Bot
    function typeBotMessage(fullText) {
        const row = document.createElement('div');
        row.className = 'msg-row bot';

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.textContent = '🎀';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';

        const textSpan = document.createElement('span');
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        cursorSpan.textContent = '▋';
        cursorSpan.style.color = '#ff7fa5';
        cursorSpan.style.marginLeft = '2px';
        cursorSpan.style.opacity = '0.8';

        const timeDiv = document.createElement('div');
        timeDiv.className = 'msg-time';
        timeDiv.textContent = timeStr;
        timeDiv.style.opacity = '0'; // Hidden until typing completes

        bubble.appendChild(textSpan);
        bubble.appendChild(cursorSpan);
        bubble.appendChild(timeDiv);

        row.appendChild(avatar);
        row.appendChild(bubble);
        chatMsgs.appendChild(row);

        chatHistory.push({ role: 'bot', text: fullText });

        let charIdx = 0;
        const totalLen = fullText.length;
        // Natural human-like slow typing speed: 32ms per character
        const charSpeed = 32;

        function typeNext() {
            if (charIdx < totalLen) {
                textSpan.textContent += fullText.charAt(charIdx);
                charIdx++;
                chatMsgs.scrollTop = chatMsgs.scrollHeight;
                setTimeout(typeNext, charSpeed);
            } else {
                cursorSpan.remove();
                timeDiv.style.opacity = '0.6';
                playPop();
                chatMsgs.scrollTop = chatMsgs.scrollHeight;
            }
        }

        typeNext();
    }

    async function handleSend() {
        const txt = chatInput.value.trim();
        if (!txt) return;

        addUserMessage(txt);
        chatInput.value = '';

        // Show typing indicator
        typingIndicator.style.display = 'flex';
        chatMsgs.scrollTop = chatMsgs.scrollHeight;

        let botReply = null;

        // 1. Try backend server API
        try {
            const res = await fetch('/api/bauni-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: txt, history: chatHistory })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.reply) botReply = data.reply;
            }
        } catch(e) {}

        // 2. Try direct Gemini API
        if (!botReply) {
            try {
                botReply = await fetchGeminiDirect(txt, chatHistory);
            } catch(e) {}
        }

        // 3. Fallback to local rule engine
        if (!botReply) {
            botReply = getLocalReply(txt);
        }

        // Realistic pause before starting to type (600ms - 900ms)
        const thinkPause = Math.floor(Math.random() * 300) + 600;
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            typeBotMessage(botReply);
        }, thinkPause);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    chips.forEach(c => {
        c.addEventListener('click', () => {
            chatInput.value = c.textContent.trim();
            handleSend();
        });
    });

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.textContent = soundEnabled ? '🔔' : '🔕';
        });
    }

});
