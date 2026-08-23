/* ==========================================
   OPEN WHEN ENVELOPES SCRIPT
   ========================================== */

const ENVELOPE_MESSAGES = {
    miss: {
        title: "🥺 Open When You Miss Me",
        icon: "🥺",
        text: "“Pata hai? Jab bhi tumhe meri yaad aaye, bas ek baat yaad rakhna — dooriyon se dil ke jazbaat kam nahi hote. Tumhari har muskaan aur har pyaari baat mere paas mehfooz hai.” 🌸"
    },
    badDay: {
        title: "😔 Open When You're Having a Bad Day",
        icon: "😔",
        text: "“Ek lambi saans lo... Aaj ka din thoda mushkil tha, par tum behad strong ho. Kal ek naya din hoga, naye smiles ke saath. Take care of yourself! ✨”"
    },
    happy: {
        title: "😊 Open When You're Happy",
        icon: "😊",
        text: "“Jab tum hasti ho na, toh lagta hai jaise duniya ki sabse khoobsurat roshni nikal aayi ho. Is khushi ko hamesha aise hi sambhal ke rakhna! ☀️”"
    },
    sleep: {
        title: "😴 Open Before You Sleep",
        icon: "😴",
        text: "“Din bhar ki thakan ko bhool jao. Apni aakhon ko aaram do aur sukoon se so jao. May your dreams be peaceful and sweet. Good night! 🌙”"
    },
    birthday: {
        title: "🎂 Open On Your Birthday",
        icon: "🎂",
        text: "“Happy Birthday Aradhya! 🎂✨ May this year bring you endless laughter, peace, success, and pure joy. Always stay blessed! ❤️”"
    },
    reminder: {
        title: "❤️ Open When You Need A Reminder",
        icon: "❤️",
        text: "“Reminder: Tum jahan bhi ho, jaisi bhi ho, behad special ho. Tumhari muskaan kisi ke saare din ko khubsurat bana sakti hai. Never forget how amazing you are! ✨”"
    },
    overwhelmed: {
        title: "🧠 Open When You Feel Overwhelmed",
        icon: "🧠",
        text: "“Thoda pause lo, chai/paani piyo. Sab kuch theek ho jayega. Step by step sab handle ho jayega. Believe in yourself! ☕”"
    },
    peace: {
        title: "🕊️ Open When You Need Peace",
        icon: "🕊️",
        text: "“Khamoshi me bhi ek alag sukoon hota hai. Tumne jo bhi mehnat ki hai, jo bhi dreams dekhe hain, wo zaroor poore honge. Be patient & peaceful. 🕊️”"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('envelopeModal');
    const modalIcon = document.getElementById('modalEnvIcon');
    const modalTitle = document.getElementById('modalEnvTitle');
    const modalText = document.getElementById('modalEnvText');
    const closeBtn = document.getElementById('closeEnvModalBtn');

    window.openEnvelope = function(type) {
        const msg = ENVELOPE_MESSAGES[type];
        if (!msg) return;

        if (modalIcon) modalIcon.textContent = msg.icon;
        if (modalTitle) modalTitle.textContent = msg.title;
        if (modalText) modalText.textContent = msg.text;

        if (modal) modal.classList.add('active');
    };

    window.closeEnvelopeModal = function() {
        if (modal) modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', window.closeEnvelopeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.closeEnvelopeModal();
        });
    }
});
