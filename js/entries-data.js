/* ==========================================
   DIARY ENTRIES DATA
   Hardcoded entries — shown on deployed site
   New entries are added here manually
   ========================================== */

const DIARY_ENTRIES = [

    // ===== MAY 2026 =====

    {
        id: 1001,
        date: "2026-05-22T23:45:00",
        title: "Aaj sab khatam ho gaya",
        text: "Aaj baat band ho gayi. Pata nahi kya hua, kaise hua… bas ek silence aa gayi. Wo silence jo dard deti hai par kuch bol nahi pata. Raat bhar neend nahi aayi. Phone uthaya, rakh diya. Message type kiya, delete kar diya. Shayad kuch cheezein bolne se nahi, chup rehne se zyada toot'ti hain.",
        mood: "sad",
        daysSince: 0
    },
    {
        id: 1002,
        date: "2026-05-23T21:30:00",
        title: "Pehla din without her",
        text: "Aaj poora din ajeeb sa guzra. Subah uthke pehle phone check kiya — koi message nahi. Wo good morning nahi aayi. Khana khaya par taste hi nahi aaya. Har jagah uski yaad aa rahi hai. Ek din bhi nahi hua aur lagta hai mahine ho gaye.",
        mood: "missing",
        daysSince: 1
    },
    {
        id: 1003,
        date: "2026-05-25T22:15:00",
        title: "Purani chats padhi aaj",
        text: "Galti kar di. Purani chats kholke padh li. Wo 'good night' messages, wo random memes, wo voice notes… sab kuch itna real tha. Aur ab? Sab kuch ek archive me band hai. Rona aaya par roya nahi. Shayad strong banna padega.",
        mood: "sad",
        daysSince: 3
    },
    {
        id: 1004,
        date: "2026-05-28T20:00:00",
        title: "Uska ek purana photo mila gallery me",
        text: "Gallery scroll kar raha tha aur ek photo aa gayi uski. Wo hass rahi thi usme. Itni genuine smile thi. Miss kar raha hoon wo hassi. Par kya kare, kuch cheezein hamare haath me nahi hoti.",
        mood: "missing",
        daysSince: 6
    },
    {
        id: 1005,
        date: "2026-05-31T23:00:00",
        title: "Ek hafte se zyada ho gaye",
        text: "9 din. 9 din bina usse baat kiye. Pehle toh 1 ghante bhi mushkil tha. Ab 9 din ho gaye. Dard hai par aadat bhi ho rahi hai dheere dheere. Shayad yehi sabse scary cheez hai — dard ki aadat pad jaana.",
        mood: "thoughtful",
        daysSince: 9
    },

    // ===== JUNE 2026 =====

    {
        id: 1006,
        date: "2026-06-03T21:00:00",
        title: "Raat ko uski yaad bahut aayi",
        text: "Din me toh kaam me busy raha. Par raat ko jab sab shant hota hai, tab uski yaad sabse zyada aati hai. Wo raat bhar calls yaad aate hain. Wo random baatein. Kash ek baar phir se sun sakta wo awaaz.",
        mood: "missing",
        daysSince: 12
    },
    {
        id: 1007,
        date: "2026-06-10T19:30:00",
        title: "Coding me dhyan lagaya",
        text: "Aaj decide kiya ki apne aap pe focus karunga. Poora din coding ki. Ek naya project start kiya. Thoda acha laga. Shayad khud ko busy rakhna hi best hai abhi ke liye. Par phir bhi, background me ek cheez hamesha chalti rehti hai — uski yaad.",
        mood: "strong",
        daysSince: 19
    },
    {
        id: 1008,
        date: "2026-06-15T22:45:00",
        title: "Uska birthday yaad aa gaya",
        text: "Randomly calendar dekha aur socha ki uska birthday kab hai. Phir yaad aaya. Bhejunga wish ya nahi? Nahi bhejunga shayad. Ya bhejunga? Pata nahi. Itna overthink karta hoon har cheez pe ab.",
        mood: "thoughtful",
        daysSince: 24
    },
    {
        id: 1009,
        date: "2026-06-20T21:15:00",
        title: "Ek mahina hone wala hai",
        text: "Almost ek mahina ho jayega. Time kitna fast jaata hai aur kitna slow bhi. Din fast jaate hain par raatein bahut lambi lagti hain. Main theek hoon. Ya shayad theek hone ki koshish me hoon. Dono me farq hai.",
        mood: "peaceful",
        daysSince: 29
    },
    {
        id: 1010,
        date: "2026-06-24T20:00:00",
        title: "Aaj hum mile the — 2 saal pehle",
        text: "24 June 2024. Aaj hi ke din hum pehli baar mile the. Do saal pehle. Us din mujhe kya pata tha ki ye insaan meri life ka itna important part ban jayega. Aaj wo yaad bhi khoobsurat lagti hai aur dard bhi deti hai.",
        mood: "love",
        daysSince: 33
    },
    {
        id: 1011,
        date: "2026-06-30T23:30:00",
        title: "Ek poora mahina",
        text: "30 din. Ek poora mahina bina usse baat kiye. Kabhi socha nahi tha ki ye possible hoga. Par ho gaya. Main abhi bhi sochta hoon uske baare me — har roz. Par ab rone ki jagah bas ek dull sa dard rehta hai andar. Shayad isi ko 'moving on' kehte hain. Ya shayad nahi.",
        mood: "sad",
        daysSince: 39
    },

    // ===== JULY 2026 =====

    {
        id: 1012,
        date: "2026-07-05T20:30:00",
        title: "Dream aaya uska",
        text: "Aaj sapne me dikhi wo. Hum baat kar rahe the normally jaise pehle karte the. Phir neend khuli aur realize hua ki sapna tha. Subah bahut kharab mood tha. Sapne kyun dikhate hain wo cheezein jo hamare paas nahi hain?",
        mood: "missing",
        daysSince: 44
    },
    {
        id: 1013,
        date: "2026-07-12T19:00:00",
        title: "Gym join kiya",
        text: "Aaj gym join kar liya. Socha ki physical health pe dhyan dunga. Workout ke baad thoda acha laga. Endorphins kaam karte hain shayad. Slowly apne aap ko rebuild kar raha hoon. Ek din at a time.",
        mood: "strong",
        daysSince: 51
    },
    {
        id: 1014,
        date: "2026-07-18T22:00:00",
        title: "Ek gaana suna jo hum dono suno karte the",
        text: "Spotify pe randomly wo gaana aa gaya. Immediately skip karna chahiye tha par nahi kiya. Poora suna. Aankhein bhar aayi. Kuch gaane, kuch jagahein, kuch smells — sab usse connected hain. Har jagah uski presence hai even when she's not here.",
        mood: "sad",
        daysSince: 57
    },
    {
        id: 1015,
        date: "2026-07-25T21:30:00",
        title: "2 mahine ho gaye",
        text: "Do mahine. 64 din. Ab counting band karni chahiye shayad. Par nahi hoti. Har din ek reminder hai ki kitna waqt ho gaya. Main better feel kar raha hoon pehle se. Coding me mann laga hai, gym ja raha hoon, friends se milta hoon. Par andar ek kona hai jo sirf uska hai. Wo khali hai.",
        mood: "thoughtful",
        daysSince: 64
    },

    // ===== AUGUST 2026 =====

    {
        id: 1016,
        date: "2026-08-02T20:00:00",
        title: "Valentine website update kiya",
        text: "Aaj wo purana valentine website khola. Dekh ke bahut kuch yaad aa gaya. Socha ki isko update karunga. Naya design, better animations. Shayad ye mera tarika hai express karne ka — code ke through. Wo shayad kabhi dekhegi bhi nahi. Par main toh apne liye bhi likh sakta hoon na.",
        mood: "love",
        daysSince: 72
    },
    {
        id: 1017,
        date: "2026-08-08T21:45:00",
        title: "Kisi ne pucha 'tu theek hai?'",
        text: "Aaj ek friend ne randomly pucha — 'bhai tu theek hai? Kuch dino se alag lagta hai.' Main hass ke bol diya haan. Par sach me theek hoon kya? Shayad 70% theek hoon. 30% abhi bhi process kar raha hoon sab kuch.",
        mood: "thoughtful",
        daysSince: 78
    },
    {
        id: 1018,
        date: "2026-08-15T19:00:00",
        title: "Independence Day — aur meri independence?",
        text: "Desh ka independence day hai. Main bhi independent hoon ab. Akela. Par independent. Dono me farq hai na? Akela hona aur independent hona. Aaj pehli baar socha ki shayad ye time mujhe chahiye tha. Khud ko samajhne ke liye. Grow karne ke liye.",
        mood: "strong",
        daysSince: 85
    },
    {
        id: 1019,
        date: "2026-08-20T22:30:00",
        title: "3 mahine",
        text: "Teen mahine. 90 din. Quarter year. Main ab pehle se better hoon, ye sach hai. Par usse bhool paaya? Bilkul nahi. Aur shayad bhoolna chahiye bhi nahi. Kuch log bhoolne ke liye nahi hote. Kuch log yaad rakhne ke liye hote hain. Wo waisi hai.",
        mood: "peaceful",
        daysSince: 90
    },
    {
        id: 1020,
        date: "2026-08-23T11:00:00",
        title: "Diary feature banaya website me",
        text: "Aaj ye diary feature banaya apni valentine website me. Ab yahan daily likhunga. Apne din ke baare me, apne feelings ke baare me, uski yaad ke baare me. Ye mera safe space hai. Koi judge nahi karega. Bas main aur meri baatein. Aur shayad ek din wo bhi padhegi ye sab. Tab usse pata chalega ki har ek din usne mere saath guzara tha — chahe physically nahi, par mere dimaag me hamesha.",
        mood: "love",
        daysSince: 93
    }

];
