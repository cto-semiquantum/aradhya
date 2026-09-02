/* ==========================================
   LOVE LANGUAGE QUIZ & CERTIFICATE LOGIC
   ========================================== */

(function () {
    const questions = [
        {
            title: "When Baunii has had a stressful or long day, what comforts her most?",
            options: [
                { text: "A heartfelt long text saying how special and loved she is 💌", type: "words" },
                { text: "Sitting together on a call in comfortable peaceful silence ☕", type: "time" },
                { text: "Warm samose & hot chocolate with extra marshmallows 🥟", type: "gifts" },
                { text: "A tight 10-minute warm hug that melts all worries away 🫂", type: "touch" }
            ]
        },
        {
            title: "What represents Harsh's greatest expression of love?",
            options: [
                { text: "Writing 104 daily diary entries without missing a single day 📖", type: "words" },
                { text: "Reserving Table #0411 permanently for our future dates ☕", type: "time" },
                { text: "Making sure she is safe, eating properly, and drinking water 🛡️", type: "acts" },
                { text: "Coding this entire private world just to see her smile 💻", type: "acts" }
            ]
        },
        {
            title: "What is our ideal couple weekend evening?",
            options: [
                { text: "Late-night conversations listening to our playlist under starlight 🌌", type: "time" },
                { text: "Surprise cute treats and love coupons exchanged together 🎁", type: "gifts" },
                { text: "Holding hands tightly walking under one rain umbrella ☔", type: "touch" },
                { text: "Harsh reading his written poetry and promises softly 📜", type: "words" }
            ]
        },
        {
            title: "When misunderstandings happen, what heals the heart fastest?",
            options: [
                { text: "A humble, sincere apology with zero ego and changed actions 🕊️", type: "words" },
                { text: "Giving gentle, patient space and reassuring unconditional love ⏳", type: "time" },
                { text: "Bringing her favorite sweet treat with quiet understanding 🧁", type: "gifts" },
                { text: "A forehead kiss and holding hands saying 'I am never leaving' 🤝", type: "touch" }
            ]
        },
        {
            title: "What makes Baunii smile uncontrollably?",
            options: [
                { text: "When Harsh teases her 'Bauniii 🤏' and she pretends to be angry 🎀", type: "time" },
                { text: "When Harsh remembers the tiniest details of what she said 🧠", type: "acts" },
                { text: "Unlimited extra marshmallows on top of her hot chocolate ☕", type: "gifts" },
                { text: "When Harsh vows: 'Mera dil kal bhi tera tha, aaj bhi tera hai' 💖", type: "words" }
            ]
        }
    ];

    let currentQ = 0;
    const scores = { words: 0, time: 0, gifts: 0, touch: 0, acts: 0 };

    const quizBox = document.getElementById('quizBox');
    const certBox = document.getElementById('certBox');
    const stepBadge = document.getElementById('qStepBadge');
    const qTitle = document.getElementById('qTitle');
    const optionsList = document.getElementById('qOptionsList');

    function renderQuestion() {
        if (!quizBox || currentQ >= questions.length) {
            showCertificate();
            return;
        }

        const q = questions[currentQ];
        if (stepBadge) stepBadge.textContent = `QUESTION ${currentQ + 1} OF ${questions.length}`;
        if (qTitle) qTitle.textContent = q.title;

        if (optionsList) {
            optionsList.innerHTML = '';
            const letters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'q-option-btn';
                btn.onclick = () => selectOption(opt.type);
                btn.innerHTML = `
                    <span class="opt-letter">${letters[idx]}</span>
                    <span>${opt.text}</span>
                `;
                optionsList.appendChild(btn);
            });
        }
    }

    function selectOption(type) {
        scores[type] = (scores[type] || 0) + 1;
        currentQ++;

        if (navigator.vibrate) navigator.vibrate(25);

        if (currentQ < questions.length) {
            renderQuestion();
        } else {
            showCertificate();
        }
    }

    function showCertificate() {
        if (quizBox) quizBox.style.display = 'none';
        if (certBox) certBox.style.display = 'block';

        // Calculate highest score
        let topLang = "Words of Devotion & Affirmation 💌";
        let topType = "words";
        let max = -1;

        Object.keys(scores).forEach(k => {
            if (scores[k] > max) {
                max = scores[k];
                topType = k;
            }
        });

        if (topType === 'time') topLang = "Quality Time & Peaceful Presence ☕";
        else if (topType === 'gifts') topLang = "Sweet Treats & Thoughtful Gestures 🎁";
        else if (topType === 'touch') topLang = "Warm Hugs & Biometric Touch 🫂";
        else if (topType === 'acts') topLang = "Loyal Actions & Boundless Care 🛡️";

        const badgeEl = document.getElementById('certBadge');
        if (badgeEl) badgeEl.textContent = `PRIMARY LANGUAGE: ${topLang}`;

        if (window.confetti) {
            window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
    }

    window.downloadCertificateImage = function () {
        const cert = document.getElementById('certBox');
        if (!cert) return;

        if (window.html2canvas) {
            window.html2canvas(cert, { scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.download = `harsh-aradhya-love-certificate-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            alert("Certificate ready! Please screenshot to save 💖");
        }
    };

    window.restartQuiz = function () {
        currentQ = 0;
        Object.keys(scores).forEach(k => scores[k] = 0);
        if (certBox) certBox.style.display = 'none';
        if (quizBox) quizBox.style.display = 'block';
        renderQuestion();
    };

    document.addEventListener('DOMContentLoaded', renderQuestion);
})();
