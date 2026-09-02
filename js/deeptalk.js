/* ==========================================
   MIDNIGHT DEEP TALK & SOUL CARDS LOGIC
   ========================================== */

(function () {
    const questions = [
        // Vulnerability & Healing
        { cat: "Vulnerability 🕊️", text: "Humare relationship ka woh kaunsa lamha tha jab tumhe mehsoos hua ki Harsh sach me dil se badal raha hai?" },
        { cat: "Vulnerability 🕊️", text: "Jab tum gusse ya dukh me hoti ho, toh tumhe kaisa comfort sabse zyada sukoon deta hai?" },
        { cat: "Vulnerability 🕊️", text: "Woh kaunsi ek aisi baat hai jo tumne kabhi kisi ko nahi batayi par mujhse share karna chahti ho?" },
        { cat: "Vulnerability 🕊️", text: "Kya tumhe lagta hai ki waqt har zakhm ko bhar deta hai agar niyat me sachai ho?" },
        { cat: "Vulnerability 🕊️", text: "Harsh ki aisi kaunsi aadat hai jise dekh kar tumhe lagta hai 'Haaye, ye kitna masoom hai'?" },

        // Sweet Memories & Firsts
        { cat: "Sweet Memories 🎞️", text: "Hamari pehli aisi chat kaunsi thi jise padh kar tum phone dekh kar akele me muskura rahi thi?" },
        { cat: "Sweet Memories 🎞️", text: "Pehli baar jab Harsh ne tumhe 'Bauniii' bola tha, tab tumhara pehla reaction kya tha?" },
        { cat: "Sweet Memories 🎞️", text: "Agar humari story par ek movie bane, toh uska sabse romantic interval scene kaunsa hoga?" },
        { cat: "Sweet Memories 🎞️", text: "Hamare gaano me se woh kaunsa ek gaana hai jo sunte hi sirf meri yaad aati hai?" },

        // Future & Dreams
        { cat: "Future Dreams 🔮", text: "Table #0411 par jab hum pehli baar aamne-saamne baithenge, toh pehli cheez tum kya bologi?" },
        { cat: "Future Dreams 🔮", text: "Hamari pehli road trip par gaana kaun bajayega aur snacks kaun sambhalega?" },
        { cat: "Future Dreams 🔮", text: "Ek rainy evening par: Hot chocolate in bed ya balcony me hath pakad kar rain dekhna?" },
        { cat: "Future Dreams 🔮", text: "Agli 5 saal me humara sabse pyara routine kya hona chahiye?" },

        // Cute Banter & Inside Jokes
        { cat: "Cute Banter 🎀", text: "Sach batao, kya tum sach me mera muh tod dogi ya sirf daraane ke liye bolti ho? 👊" },
        { cat: "Cute Banter 🎀", text: "Agar mujhe 1 ghante ke liye tumhara personal assistant banna ho, toh tumhara pehla order kya hoga?" },
        { cat: "Cute Banter 🎀", text: "Cafe Aru ke saare samose tum akele kha jaogi ya 1 bite mujhe bhi dogi?" },
        { cat: "Cute Banter 🎀", text: "Ham dono me se zyada moody kaun hai (aur kripya sach batayein)?" }
    ];

    let currentPool = [...questions];
    let activeQuestion = questions[0];
    const card = document.getElementById('soulCard');
    const qText = document.getElementById('cardQuestion');
    const qCat = document.getElementById('cardCategory');

    function drawCard() {
        if (!card) return;
        card.classList.remove('is-flipped');

        setTimeout(() => {
            activeQuestion = currentPool[Math.floor(Math.random() * currentPool.length)];
            if (qText) qText.textContent = `"${activeQuestion.text}"`;
            if (qCat) qCat.textContent = activeQuestion.cat;
            setTimeout(() => {
                card.classList.add('is-flipped');
                if (navigator.vibrate) navigator.vibrate(30);
            }, 250);
        }, 300);
    }

    window.flipActiveCard = function () {
        if (card) card.classList.toggle('is-flipped');
    };

    window.nextSoulCard = function () {
        drawCard();
    };

    window.filterDeck = function (cat, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');

        if (cat === 'all') {
            currentPool = [...questions];
        } else {
            currentPool = questions.filter(q => q.cat.includes(cat));
        }
        drawCard();
    };

    document.addEventListener('DOMContentLoaded', drawCard);
})();
