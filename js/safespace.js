/* ==========================================
   SAFE SPACE & SILENT WHISPERS SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    const defaultNotes = [
        {
            id: 1,
            text: "Tum par koi pressure ya shart nahi hai… jab baat karne ka mann ho toh karna, jab chup rehna ho toh rehna. Harsh hamesha tumhari comfort ki respect karega.",
            author: "Harsh",
            time: "2 Sep 2026"
        },
        {
            id: 2,
            text: "Kal raat jab 22 May ki baat hui thi… mera dil bohot ro raha tha. Main bas itna kehna chahta hoon ki main dil se sharminda hoon agar us din meri wajah se tum dukh me aayi.",
            author: "Harsh",
            time: "1 Sep 2026"
        },
        {
            id: 3,
            text: "Chahe humari baat formal 'hi/hello' tak hi simat jaye… tum mere liye kal bhi sabse pyaari thi aur hamesha rahogi.",
            author: "Harsh",
            time: "28 Aug 2026"
        }
    ];

    const STORAGE_KEY = 'aradhya_safe_notes';
    const board = document.getElementById('notesBoard');

    function getNotes() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (saved && Array.isArray(saved) && saved.length > 0) return saved;
        } catch(e) {}
        return defaultNotes;
    }

    function renderNotes() {
        if (!board) return;
        board.innerHTML = '';
        const notes = getNotes();

        notes.forEach(n => {
            const noteEl = document.createElement('div');
            noteEl.className = 'sticky-note';
            noteEl.innerHTML = `
                <div class="sticky-pin">📌</div>
                <div class="sticky-text">"${n.text}"</div>
                <div class="sticky-meta">
                    <span>— ${n.author}</span>
                    <span>${n.time}</span>
                </div>
            `;
            board.appendChild(noteEl);
        });
    }

    // 1-Click Reactions
    const reactionBtns = document.querySelectorAll('.reaction-pill-btn');
    reactionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji || btn.textContent.trim();
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = 'scale(1)', 250);

            // Toast
            alert(`Aapka silent reaction sent: ${emoji} 🕊️`);

            // Cloud sync
            try {
                fetch("https://ntfy.sh/harsh_diary_cloud_sync_411", {
                    method: "POST",
                    body: JSON.stringify({
                        event: "silent_reaction",
                        reaction: emoji,
                        time: new Date().toISOString()
                    }),
                    headers: { "Title": `🕯️ Reaction: ${emoji}` }
                }).catch(() => {});
            } catch(e) {}
        });
    });

    // Add note
    const postBtn = document.getElementById('postNoteBtn');
    const noteInput = document.getElementById('noteInput');

    if (postBtn && noteInput) {
        postBtn.addEventListener('click', () => {
            const txt = noteInput.value.trim();
            if (!txt) return;

            const notes = getNotes();
            notes.unshift({
                id: Date.now(),
                text: txt,
                author: "Anonymous Whisper 🕯️",
                time: "Just now"
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            noteInput.value = '';
            renderNotes();

            // Cloud sync
            try {
                fetch("https://ntfy.sh/harsh_diary_cloud_sync_411", {
                    method: "POST",
                    body: JSON.stringify({
                        event: "safe_note",
                        text: txt,
                        time: new Date().toISOString()
                    }),
                    headers: { "Title": "🕯️ New Safe Space Note" }
                }).catch(() => {});
            } catch(e) {}
        });
    }

    renderNotes();

});
