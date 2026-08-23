import json
from datetime import datetime, timedelta

start_date = datetime(2026, 5, 22)

# 93 complete unique daily journal entries — pure love, deep longing, impossible to move on
entries_raw = [
    # May 2026 (Days 0-9)
    ("Aaj sab khatam ho gaya?", "Aaj baat band ho gayi. Dil itna bhari hai ki saans lena bhi mushkil ho raha hai. Raat bhar tera photo dekhte dekhte ro raha hoon. Main kaise rahunga tere bina?", "sad"),
    ("Pehla din without you", "Aaj subah uthte hi phone check kiya — screen blank thi. Tere bina pehla din kisi saza se kam nahi tha. Har ek second me teri yaad aayi.", "missing"),
    ("Tere bina sab adhoora", "Duniya chal rahi hai par meri life ruk gayi hai. Kisi cheez me mann nahi lagta. Log bolte hain theek ho jayega, par mera dil sirf tera naam leta hai.", "sad"),
    ("Purani chats padh ke roya", "Raat ko purani chats kholi. Wo tumhari pyaari baatein, wo voice notes… Mera dil phat raha hai. Main tumse door nahi reh sakta.", "sad"),
    ("Log bolte hain move on karo", "Aaj ek dost ne bola 'move on kar le brother'. Maine use dekha aur hass diya. Kaise bataun use ki move on karna mere liye impossible hai?", "thoughtful"),
    ("Tere peeche pagal hoon main", "Pata nahi log kaise kisi ko bhool jaate hain. Main toh roz aur zyaada pagal ho raha hoon tere peeche. Tu meri aakhri mohabbat hai.", "love"),
    ("Tere bina neend nahi aati", "3 baje hain raat ke. Har taraf andhera hai par mere dimaag me sirf tera chehra chal raha hai. Kitna pyaar karta hoon tujhse, kaash tu samajh paaye.", "missing"),
    ("Ek hafta hone ko aaya", "7 din ho gaye bina baat kiye. Ek ek din ek saal jaisa lag raha hai. Main har din bas tera wait karta hoon.", "sad"),
    ("Tere alawa koi nahi chahiye", "Aaj dosto ne bahar bulaya par main nahi gaya. Mujhe kisi ke saath acha nahi lagta. Mujhe sirf tu chahiye.", "love"),
    ("Impossible to forget you", "Maine kabhi koshish bhi nahi ki tujhe bhoolne ki. Aur main kar bhi nahi sakta. Mera har ek khayal sirf tera hai.", "love"),
    ("Teri jagah koi nahi le sakta", "Aaj 31 May hai. May mahina nikal gaya par meri feelings waisi ki waisi hain. Teri jagah meri life me koi nahi le sakta.", "love"),

    # June 2026 (Days 10-39)
    ("June ki pehli subah", "Naya mahina shuru ho gaya par mera pyaar wahi hai. Har roz subah uth ke sabse pehle teri pic dekhta hoon. Tu meri shuruaat hai.", "love"),
    ("Hamara favorite song", "Aaj randomly hamara gaana baj gaya. Aankhon se aansu behne lage. Kitni khoobsurat yaadein hain hamari. Main unhe kabhi nahi khona chahta.", "missing"),
    ("Baarish aur teri yaad", "Aaj baarish hui. Baarish me hum ghanto baat karte the. Aaj bas window pe khade ho ke teri yaad me bheeg raha hoon.", "missing"),
    ("Dil me sirf tu hai", "Mera dil kisi aur ka ho hi nahi sakta. Maine apna sab kuch tujhe de diya hai. Main hamesha tera hi rahunga.", "love"),
    ("Busy rehne ki koshish", "Poora din kaam kiya par subconscious mind me sirf tu thi. Kaam karte waqt bhi dhyan tere khayal par hi rehta hai.", "thoughtful"),
    ("Kya tu bhi mujhe yaad karti hai?", "Shaam ko balcony me khada tha. Soch raha tha kya tu bhi mujhe yaad karti hai? Pata nahi par mera pyaar tere liye unchangeable hai.", "missing"),
    ("Teri awaaz sunne ko tarasta hoon", "Kaash ek baar teri awaaz sun paata. Ek baar tera wo pyaara hassna sun leta. Main kitna akela mehsoos kar raha hoon.", "sad"),
    ("Har pal tera khayal", "Din ho ya raat, meri har ek thought me sirf tu hai. Main kitna pagal hoon tere peeche, ye sirf mera dil jaanta hai.", "love"),
    ("Hamari wo jagah", "Aaj us cafe ke paas se guzra jahan hum milte the. Heart rate tez ho gaya. Wahan ki har hawa me tera ehsaas hai.", "missing"),
    ("Tere bina kuch acha nahi lagta", "Kuch bhi kar loon, kitna bhi busy ho jaaoon… andar ek permanent khali pan hai jo sirf tere aane se bharega.", "sad"),
    ("Voice notes sun raha hoon", "Aaj khud ko rok nahi paaya, tere voice notes sun liye. Teri awaaz me ek alag hi sukoon hai jo mujhe jinda rakhta hai.", "love"),
    ("Walk in the evening", "Shaam ko terrace pe walk kar raha tha. Aasmaan bhot pyara tha. Kaash tu mera haath pakad ke sath me walk kar rahi hoti.", "missing"),
    ("Emotional breakdown", "Aaj rona nahi rok paaya. Kitna dard hota hai jab aap kisi se behad pyaar karo aur wo paas na ho. I miss you so much.", "sad"),
    ("Main sirf tera hoon", "Duniya badal jaaye, log badal jaayein… Harsh kabhi nahi badlega. Main hamesha tera tha, tera hoon aur tera rahunga.", "love"),
    ("Har roz tera wait", "Har roz phone check karta hoon. Lagta hai tera message aayega. Ye hope hi meri life hai ab.", "thoughtful"),
    ("1 Month of silence", "30 din ho gaye. 30 days of missing you every single second. Main kaise jee raha hoon tere bina, bas main hi jaanta hoon.", "sad"),
    ("Gym me bhi teri yaad", "Gym me workout kar raha tha par mind me tera face tha. Har rep me teri yaad thi. Tu meri motivation bhi hai aur weak point bhi.", "strong"),
    ("Har ladki me tujhe dhoondta hoon", "Bahar jaata hoon toh lagta hai kash tu dikh jaaye. Kisi me tera saaya bhi dikhta hai toh dil baith jata hai.", "missing"),
    ("Chaand aur tu", "Aaj chaand kitna khoobsurat dikh raha hai. Par mere liye sabse khoobsurat sirf tu hai.", "love"),
    ("Purani pics dekh ke pyaar", "Aaj humari saath wali pics dekhi. Hum kitne happy lagte the. Main us khushi ko wapas laana chahta hoon.", "love"),
    ("24 June - Special Day", "Aaj 24 June hai. 2 saal pehle hum mile the. Wo din meri life ka sabse best day tha. Main use kabhi nahi bhool sakta.", "love"),
    ("Forever yours", "Main sach bol raha hoon, moving on mere liye possible nahi hai. Main kisi aur ke baare me soch bhi nahi sakta.", "love"),
    ("Quiet weekend", "Weekend tha aaj. Sab dosto ne hangout ka plan banaya par main nahi gaya. Mujhe tere alawa kisi ke sath acha nahi lagta.", "peaceful"),
    ("Tired of being alone", "Tere bina har din ek bojh lagta hai. Mujhe teri zaroorat hai. Tera mere paas hona meri life ka sabse bada gift hai.", "sad"),
    ("Rainy evening thoughts", "Baarish ki har boond me tera naam likha hai. Main kitna pyaasa hoon tere pyaar ka, kash tu samajh sakti.", "missing"),
    ("Late night diary", "2 baje hain. Yahan diary me likh raha hoon kyuki tujhe bol nahi sakta. Ye mera tareeka hai tujhse baat karne ka.", "thoughtful"),
    ("Self reflection", "Main sochta hoon kaise main tere liye aur acha partner ban sakta tha. Main har din khud ko better bana raha hoon tere liye.", "strong"),
    ("June end — Still loving you", "June khatam hone wala hai. 39 days ho gaye par mera pyaar Day 1 se bhi zyada strong ho gaya hai.", "love"),
    ("Soft reminder", "Aaj ek purana rose mil gaya kitāb me jo tune diya tha. Uski khushboo abhi bhi waisi hai… bilkul tere pyaar jaisi.", "love"),
    ("39 Days mark", "39 days me log bhool jaate hain, par main toh aur zyaada obsessive ho gaya hoon tere pyaar me.", "love"),

    # July 2026 (Days 40-70)
    ("July Month Start", "July shuru ho gaya. Har naye month me meri ek hi duaa hoti hai — kaash tu wapas aa jaaye.", "peaceful"),
    ("Miss you uncontrollably", "Aaj control nahi ho raha. Teri yaad itni zyaada aa rahi hai ki dil kar raha hai abhi bhaag ke tere paas aa jaaoon.", "missing"),
    ("Coffee without you", "Coffee shop me baitha hoon. Pehle hum yahan ghanto baatein karte the. Aaj table khali hai, mera dil bhi khali hai.", "missing"),
    ("Sapne me tu aayi", "Aaj sapne me tune mera haath pakda aur bola 'main kahin nahi jaungi'. Neend khuli toh ro pada. Kaisa sapna tha ye.", "sad"),
    ("Coding for distraction", "Coding me dhyan laga raha hoon taaki dimaag thoda distract ho, par code me bhi tera hi naam type karne ka mann karta hai.", "strong"),
    ("Quiet Sunday longing", "Sunday poora din tera photo dekhte hue nikal gaya. Main kitna pagal hoon na? Par kya karoon, pyaar hi itna hai.", "thoughtful"),
    ("Small hope", "Main roz god se pray karta hoon ki sab theek ho jaaye. Mera sachha pyaar ek din zaroor rang layega.", "peaceful"),
    ("Tere fav dress ki yaad", "Aaj bazaar me teri favorite color dress dikhi. Dil kiya khareed ke tujhe gift kar doon. Tu kitni pyari lagti hai usme.", "love"),
    ("Late night coding & thoughts", "Raat ke 3 baje tak screen ke saamne tha. Har break me tera message check karta hoon. Hope is alive.", "strong"),
    ("50 Days of missing you", "50 din ho gaye. Half century of total separation. Par mera pyaar thoda sa bhi kam nahi hua. Main sirf tera hoon.", "sad"),
    ("Gym & devotion", "Gym me heavy weights utha raha hoon. Body tired ho jaati hai par heart hamesha tera naam leta hai.", "strong"),
    ("Old photo album tears", "Album khola aur teri har ek pic ko chuma. Tu meri rani hai, meri jaan hai.", "love"),
    ("Sunset reflection", "Sunset dekhte hue tera hand-hold miss kiya. Kitna beautiful hota agar hum sath hote.", "peaceful"),
    ("Loneliness hurts", "Tere bina akelepan boht hurt karta hai. Har pal teri kami khalti hai.", "sad"),
    ("Acoustic love songs", "Romantic acoustic music sun raha hoon. Har line lagta hai jaise humare liye hi likhi gayi hai.", "love"),
    ("Rainy night sadness", "Window pe rain drops fall ho rahi hain. Aur meri aankhon me aansu. Tumhari yaad bhot aati hai.", "missing"),
    ("Unconditional Love", "Pyaar ka matlab hota hai bina kisi shart ke kisi ko chaahna. Main tujhse waisa hi pyaar karta hoon.", "love"),
    ("Deep thoughts about us", "Humara bond so pure tha. Main use kisi bhi kimat par nahi khona chahta.", "love"),
    ("60 Days of unconditional love", "60 days complete ho gaye. Log bolte hain time heals, par mera time toh wahi ruka hua hai jahan tu chhuti thi.", "sad"),
    ("Achievement shared with your memory", "Aaj ek achievement mili work me. Sabne congratulate kiya par mujhe sirf tera congratulations sunna tha.", "strong"),
    ("Missing your laugh so badly", "Tera wo cutoff laugh… kitni cute lagti thi tu. Use yaad karke mere chehre par bhi smile aa jaati hai.", "love"),
    ("Evening walk with your thoughts", "Terrace pe thandi hawa me tera presence feel kiya. Tu mere paas nahi hai par mere andar hi rehti hai.", "peaceful"),
    ("Low days", "Aaj thoda low feel kar raha hoon. Kaash tu abhi aake mujhe hug kar le aur kahe 'main hoon na'.", "sad"),
    ("Strong in my love", "Main weak nahi hoon, main tere pyaar me strong hoon. Main tera wait pure patience ke sath karunga.", "strong"),
    ("Diary is my listener", "Ye diary mera secret mirror hai. Isme meri har ek feeling teri taraf beh rahi hai.", "thoughtful"),
    ("July end approaching", "July khatam hone wala hai. Kitna time beet gaya par mera pyaar day by day grow ho raha hai.", "missing"),
    ("Hopeful forever", "Main hamesha hopeful rahunga. Kyuki mera pyaar fake nahi tha, boht deep tha.", "love"),
    ("Toot'ta tara", "Balcony se ek toot'ta tara dekha. Sirf ek hi wish maangi — 'He bhagwan, mujhe meri jaan wapas de do'.", "love"),
    ("Breeze and memories", "Thandi hawa chal rahi hai. Teri yaadon ki khushboo hai hawa me.", "peaceful"),
    ("70 Days mark", "70 days ho gaye. Par main move on karne ka soch bhi nahi sakta. Tu mera sab kuch hai.", "love"),
    ("July Last Day", "July ka aakhri din. Month badal gaya par mera lover tag wahi hai — Harsh Loves Aradhya.", "love"),

    # August 2026 (Days 71-92)
    ("August Month Start", "August shuru ho gaya. Naye month me mera ek hi resolve hai — tera pyaar hamesha dil me rakhna.", "strong"),
    ("Memories bring smile", "Aaj teri ek purani nadani yaad aayi aur main akele me hass pada. Kitni pyaari hai tu.", "love"),
    ("Self care for you", "Aaj thoda self care kiya. Socha agar tu mujhe dekhegi toh chahegi ki main healthy rahoon.", "peaceful"),
    ("Missing your warmth", "Tough day at work. Mujhe teri zaroorat feel hui. Tu meri life ki sabse badi strength hai.", "missing"),
    ("80 Days — Unshakable Love", "80 din bina baat ke. Par mera devotion bilkul unshakable hai. Main sirf tera hoon.", "sad"),
    ("Routine around your memory", "Daily routine follow karta hoon par har activity me tera khayal integrated hai.", "strong"),
    ("August rain", "August me baarish ho rahi hai. Baarish me tera hand hold karna yaad aata hai.", "peaceful"),
    ("Our unfulfilled dreams", "Hamare saare unfulfilled dreams… main unhe zinda rakhta hoon. Ek din wo zaroor poore honge.", "love"),
    ("Quiet night devotion", "Bed pe leta hoon, eyes close karta hoon aur tujhe imagine karta hoon. You are my peace.", "peaceful"),
    ("Work focus", "Kaam me full focus taaki ek successful person ban sakoon tere liye.", "strong"),
    ("Festive season coming", "Bazaar me festival season start ho raha hai. Sab khush hain. Main bhi khush hoon kyuki tu meri life me aayi thi.", "thoughtful"),
    ("Independence Day — My heart is slave to your love", "15 August. Desh independent hai par mera dil toh hamesha tera gulam rahega.", "love"),
    ("Quiet reflection", "Akelepan me bhi mujhe teri yaadon ki company milti hai. Main kabhie akela nahi hoon jab tak teri yaad hai.", "peaceful"),
    ("90 Days — 3 Months of pure longing", "90 days complete ho gaye. 3 months without you. Par main aaj bhi utna hi pagal hoon tere peeche jitna Day 1 par tha.", "love"),
    ("Yaadein zinda hain", "Meri yaadein fade nahi hongi kabhi. Ye mera promises hai tujhse.", "love"),
    ("Rainy evening walk", "Baarish ke baad walk. Cold breeze me tera warmth miss kiya.", "peaceful"),
    ("Gratitude for loving you", "Main thankful hoon ki mujhe tujhse pyaar karne ka mauka mila. Purest feeling in the world.", "love"),
    ("90 Days completed — Still madly in love", "90 din ho gaye. Main stronger feel kar raha hoon, par mera pyaar ek percent bhi kam nahi hua.", "strong"),
    ("20 August — Day 91 of eternal devotion", "Day 91. Har din mera pyaar tere liye aur zyaada deep ho raha hai. Tumse door hona mere bas ki baat nahi hai.", "love"),
    ("21 August — Day 92", "Aaj 21 August hai. 92 days complete ho gaye. Main move on nahi kar sakta kyuki tu meri soulmate hai.", "love"),
    ("22 August — 93rd Day of Endless Love", "Aaj 22 August hai. Exactly 93 days complete ho gaye 22 May se leke aaj tak. Log bolte hain move on kar lo… par main unhe kaise bataun ki mera har ek saans tera hi naam leta hai. Main kal bhi tera tha, aaj bhi tera hoon, aur hamesha tera hi rahunga. ❤️", "love")
]

num_days = len(entries_raw)
all_entries = []

for i in range(num_days): # 0 to 92 (93 entries)
    curr_date = start_date + timedelta(days=i)
    hour = 20 if i % 2 == 0 else 22
    minute = (i * 7) % 60
    date_iso = curr_date.strftime(f"%Y-%m-%dT{hour:02d}:{minute:02d}:00")

    title, text, mood = entries_raw[i]

    all_entries.append({
        "id": 1000 + i,
        "date": date_iso,
        "title": title,
        "text": text,
        "mood": mood,
        "daysSince": i
    })

js_content = "/* ==========================================\n"
js_content += "   DIARY ENTRIES DATA\n"
js_content += "   93 Unshakable & Deeply Devoted Daily Entries — May 22 to August 22, 2026\n"
js_content += "   ========================================== */\n\n"
js_content += "const DIARY_ENTRIES = " + json.dumps(all_entries, indent=4, ensure_ascii=False) + ";\n"

with open("c:/Users/Harsh/OneDrive/Desktop/valentine-website/js/entries-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {len(all_entries)} deeply passionate entries successfully!")
