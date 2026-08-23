import json
from datetime import datetime, timedelta

start_date = datetime(2026, 5, 22)
num_days = 93 # Day 0 (May 22) to Day 92 (August 22) = 93 total days

# 93 complete unique daily journal entries in authentic Hinglish
entries_raw = [
    # May 2026 (Days 0-9)
    ("Aaj sab khatam ho gaya", "Aaj baat band ho gayi. Pata nahi kya hua, kaise hua… bas ek silence aa gayi. Wo silence jo dard deti hai par kuch bol nahi pata. Raat bhar neend nahi aayi. Phone uthaya, rakh diya.", "sad"),
    ("Pehla din without her", "Aaj poora din ajeeb sa guzra. Subah uthke pehle phone check kiya — koi message nahi. Wo good morning nahi aayi. Khana khaya par taste hi nahi aaya.", "missing"),
    ("Subah se teri yaad", "Aaj subah uthte hi sabse pehle tera khayal aaya. Lag raha tha phone pe message aaya hoga, par screen blank thi. Dil me ajeeb sa khaali pan hai.", "sad"),
    ("Purani chats padhi aaj", "Galti kar di. Purani chats kholke padh li. Wo 'good night' messages, wo random memes, wo voice notes… sab kuch itna real tha. Aur ab? Sab silence.", "sad"),
    ("Kuch bhi acha nahi lag raha", "Dosto ke saath tha par dhyan kahi aur hi tha. Sab hass rahe the aur main bas fake smile de raha tha. Pata nahi kab ye feeling khatam hogi.", "missing"),
    ("Teri smile yaad aati hai", "Aaj ek purana photo dikha. Tu kitni pyari lagti hai jab hasti hai. Meri life ki sabse khoobsurat memory hai wo. Kaash sab pehle jaisa ho pata.", "love"),
    ("Raat ko neend nahi aayi", "Raat ko 3 baje tak jaagta raha. Ceiling ko dekhte hue bas purani baatein yaad karta raha. Har ek call, har ek baat mere dimaag me repeat ho rahi hai.", "sad"),
    ("Ek hafte hone ko aaye", "Ek hafta hone wala hai. Pehle 1 ghante bhi bina baat kiye nahi rehte the. Ab 7 din ho gaye. Kaisa waqt aa gaya hai.", "thoughtful"),
    ("Quiet day", "Aaj poora din shant raha. Kisi se baat karne ka mann nahi kiya. Room me akela baitha raha. Teri yaad me poora din nikal gaya.", "missing"),
    ("Moving forward?", "Aaj thoda kaam karne ki koshish ki. Kuch der mind divert hua par shaam ko phir wahi khaali pan. Aadat kab padegi iski?", "strong"),

    # June 2026 (Days 10-39)
    ("June ki pehli subah", "Naya mahina shuru ho gaya par meri life wahi ruki hui hai. Har din tera wait karta hoon, pata hai message nahi aayega par phir bhi hope rehti hai.", "sad"),
    ("Ek purana song suna", "Playlist shuffle pe thi aur hamara fav song baj gaya. Immediately aankhein bhar aayi. Kitni yaadein judi hain us ek gaane se.", "missing"),
    ("Weather is rainy today", "Aaj mausam bhot pyara hai. Baarish ho rahi hai. Baarish me hum hamesha lambi baatein karte the. Aaj bas baarish ki boondein dekh raha hoon.", "thoughtful"),
    ("Heavy heart", "Kabhi kabhi bina wajah dil bhari ho jata hai. Aaj waisa hi din tha. Shaam ko walk pe gaya tha, akela. Bas tere baare me soch raha tha.", "sad"),
    ("Tried coding all day", "Poora din laptop ke saamne nikala. Apne aap ko busy rakhne ki koshish kar raha hoon. Coding me focus karne se thoda relief milta hai.", "strong"),
    ("Tere baare me socha", "Aaj socha ki tu kya kar rahi hogi? Kya tu bhi mujhe yaad karti hai ya main akela hi is pain me hoon? Pata nahi kyu ye sawal roz aata hai.", "missing"),
    ("Silent night", "Raat bhot shant hai. Pehle is time hum call pe hote the. Ghanto baatein hoti thi. Ab bas ghadi ki tik-tik sunai deti hai.", "sad"),
    ("Late night thoughts", "Life kitni unpredictably change ho jaati hai. Jo kal tak sabse close tha, aaj wo stranger jaisa ho gaya hai. Heartbreaking hai ye.", "thoughtful"),
    ("Short coffee break", "Aaj shaam ko coffee peene gaya. Wo cafe yaad aaya jahan hum pehle baate karte the. Waha ki har table pe humari yaadein hain.", "missing"),
    ("Focusing on self", "Aaj workout kiya thoda. Apni health pe dhyan dena shuru kar raha hoon. Tu hamesha bolti thi na ki apna khayal rakha karo.", "strong"),
    ("Missing your voice", "Voice notes sunne ka mann ho raha tha par khud ko roka. Purani cheezon me atke rahunga toh aage kaise badhunga. Par miss toh karta hoon.", "missing"),
    ("Walk in the evening", "Shaam ko terrace pe walk kar raha tha. Aasmaan bhot khoobsurat tha. Socha tujhe pic bhejoon, phir yaad aaya ki ab rights nahi hain.", "love"),
    ("Emotional breakdown", "Aaj rona aa gaya. Boht try kiya hold karne ka par nahi hua. Kabhi kabhi dard itna zyada ho jata hai ki control nahi hota.", "sad"),
    ("A ray of hope", "Aaj lga ki shayad sab theek ho jaye ek din. Life me ups and downs aate hain. Main hamesha wait karunga tera, chahe kitna bhi time lage.", "peaceful"),
    ("Busy day at work", "Aaj kaam bhot tha. Poora din nikal gaya jaldi. Par jaise hi free hua, pehla khayal tera hi aaya. Tu mere dimaag se jaati hi nahi.", "thoughtful"),
    ("1 Month anniversary of silence", "Ek mahina ho gaya silent rahe. 30 days of no calls, no messages. Kitna tough tha ye 30 days sirf main jaanta hoon.", "sad"),
    ("Gym consistency", "Gym me 2 ghante lagaaye. Body tired hai par mind thoda relaxed hai. Physical exertion se dimaag shaant hota hai.", "strong"),
    ("A random stranger", "Aaj raste me kisi ko dekha jo teri tarah lag rahi thi. Ek second ke liye heart rate fast ho gaya tha. Phir dekha toh koi aur thi.", "missing"),
    ("Night sky thoughts", "Chaand bhot pyara dikh raha hai aaj. Soch raha hoon kya tu bhi isi chaand ko dekh rahi hogi abhi?", "love"),
    ("Memories overload", "Aaj purane photos scroll kar raha tha. Kitne happy moments the hamare. Kaash wo din wapas aa sakte.", "missing"),
    ("24 June - Our special date", "Aaj 24 June hai. Exactly 2 saal pehle hum mile the. Us din meri life badal gayi thi. Aaj ka din mere liye hamesha special rahega.", "love"),
    ("Still hoping", "Kuch bhi ho jaye, mere dil me tere liye respect aur pyaar kabhi kam nahi hoga. Tu mere liye hamesha special rahegi.", "love"),
    ("Quiet weekend", "Weekend tha aaj. Sab log bahar ja rahe the. Main ghar pe baith ke kitabein padhta raha. Mind ko calm rakhne ki koshish.", "peaceful"),
    ("Emotional exhaustion", "Dard sehte sehte tired ho gaya hoon. Ab bas ek numbness feel hoti hai. Na zyada khushi, na zyada gham.", "thoughtful"),
    ("Rainy evening", "Phir se baarish hui shaam ko. Chai pite hue teri baatein yaad ki. Ye baarish bhi teri yaad dila deti hai.", "missing"),
    ("Late night diary entry", "Raat ke 2 baje hain. Sab so rahe hain. Main yahan diary me likh raha hoon. Tu meri secret holder hai diary.", "thoughtful"),
    ("Self reflection", "Maine socha ki meri kya galtiyaan thi. Insaan apni galtiyon se hi seekhta hai. Main ab ek better person ban raha hoon.", "strong"),
    ("Halfway through June", "June bhi khatam hone wala hai. Time kitna fast nikal raha hai. Par mera dil abhi bhi wahi atka hua hai.", "sad"),
    ("A soft reminder", "Aaj ek dost ne tera naam liya randomly. Ek pal ke liye sab ruk gaya. Tera naam sunke hi dil me khushi aati hai.", "love"),
    ("End of June", "June month end ho gaya. 39 days of silence. Maine boht kuch seha hai in 39 dino me. Par main strong ban raha hoon.", "strong"),

    # July 2026 (Days 40-70)
    ("July Month Start", "July shuru ho gaya. Naya month, nayi ummeed. Hope karta hoon ki ye month mere liye thoda easy rahe.", "peaceful"),
    ("Miss you so much", "Aaj teri yaad boht tez aayi. Lag raha tha bas ek baar tujhe dekh loon. Ek baar teri awaaz sun loon.", "missing"),
    ("Coffee in the rain", "Coffee shop me baitha hoon. Baarish ho rahi hai bahar. Tera favorite song baj raha hai background me. Tu yaad aa rahi hai.", "missing"),
    ("Dream about you", "Aaj sapne me tu aayi thi. Hum dono sath me hass rahe the. Jab neend khuli toh reality ne dard diya. Sapne bhi rulate hain.", "sad"),
    ("Learning new skills", "Aaj ek naya course start kiya. Coding skill upgrade kar raha hoon. Apne career pe focus karna zaroori hai.", "strong"),
    ("Quiet Sunday", "Sunday tha. Poora din ghar pe. Kuch purani diary entries padhi. Kitna change aa gaya hai meri life me.", "thoughtful"),
    ("A small smile", "Aaj kisi baat pe thoda sa hass diya. Boht dino baad real smile aayi thi. Lagta hai healing start ho rahi hai.", "peaceful"),
    ("Your favorite color", "Aaj marketplace me teri fav color ki dress dikhi. Turant tera khayal aaya. Kitni choti choti baatein yaad hain teri.", "love"),
    ("Late night coding", "Raat 3 baje tak code karta raha. Jab kaam me busy hota hoon toh dimaag distracted rehta hai. Yehi mera distraction hai.", "strong"),
    ("50 Days of silence", "Aaj 50 din ho gaye. Half century of silence. Kitna lamba safar tha ye. Maine har din tujhe miss kiya hai.", "sad"),
    ("Gym achievements", "Gym me naya personal record banaya aaj. Body strong ho rahi hai, hopefully mind bhi strong ho jaye dheere dheere.", "strong"),
    ("Old photo album", "Aaj ek purana album dekha. Usme teri aur meri saath waali pics thi. Dekh ke aankhon me paani aa gaya.", "sad"),
    ("Peaceful evening", "Shaam ko sunset dekha. Sky me pink aur orange colors the. Boht pyara view tha. Kash tu bhi sath hoti.", "peaceful"),
    ("Feeling lonely", "Aaj akelepan boht feel hua. Poore din me kisi se dhang se baat nahi hui. Main aur meri khamoshi.", "sad"),
    ("Listening to acoustic music", "Acoustic songs sun raha hoon. Dhyan bas teri yaadon pe hai. Tu mere dil ke boht paas hai hamesha.", "love"),
    ("A rainy night", "Raat ko tez baarish ho rahi hai. Window pe baith ke baarish dekh raha hoon. Mausam bhot romantic hai par main akela.", "missing"),
    ("New perspective", "Aaj laga ki jo hota hai ache ke liye hota hai. Shayad hum dono ko grow karne ke liye space chahiye tha.", "thoughtful"),
    ("Deep thoughts", "Pyaar kya hota hai? Kisi ko bina dekhe, bina baat kiye bhi har pal uski care karna. Mera pyaar real hai.", "love"),
    ("60 Days completed", "60 din. 2 months complete ho gaye. Time flows like water. Par teri yaadein fixed hain mere andar.", "sad"),
    ("Working on project", "Ek bada project update kiya aaj. Team ne appreciate kiya. Kaash tujhe bta pata ye sab. Tu boht proud hoti.", "strong"),
    ("Missing your laughter", "Tera wo pagal jaisa hassna yaad aa raha hai. Kisi bhi baat pe tu kitni cutoff hassi hasti thi. Truly adorable.", "love"),
    ("A quiet evening walk", "Park me ghoom raha tha. Thandi hawa chal rahi thi. Peaceful feel ho raha tha thoda.", "peaceful"),
    ("Feeling a bit low", "Aaj mood thoda low hai. Na jaane kyu achanak sad feel hone lagta hai. Tera khayal aate hi dil baith jata hai.", "sad"),
    ("Stronger than yesterday", "Har din ek naya challenge hai. Par main roz thoda aur strong ho raha hoon. Growth is happening.", "strong"),
    ("Writing down feelings", "Is diary me likhna mere liye therapy jaisa hai. Apne saare thought yahan nikal deta hoon.", "thoughtful"),
    ("July end approaching", "July month bhi khatam hone wala hai. Din kitne jaldi beet rahe hain. Tu yaad aati rehti hai.", "missing"),
    ("Hopeful future", "Mujhe pata hai ek din sab theek ho jayega. Chahe hum sath hon ya na hon, main hamesha teri happiness chahunga.", "love"),
    ("Late night stars", "Raat ko balcony me khade ho ke taare dekhe. Ek toot'ta tara dekha, bas teri khushi maangi.", "love"),
    ("Summer breeze", "Halka halka mausam hai. Quiet ambient sound sun raha hoon. Mind calm hai aaj.", "peaceful"),
    ("70 Days mark", "70 days done. Ek lamba rashta tay kar liya hai maine. Ab main sambhal gaya hoon kafi hadd tak.", "strong"),
    ("July Last Day", "July ka aakhri din. Kal se August shuru. Time ke sath zakhm bharte hain, par nishan reh jaate hain.", "thoughtful"),

    # August 2026 (Days 71-92)
    ("August Month Start", "August shuru ho gaya. Naya month, nayi strength. Main aage badh raha hoon par tujhe bhula ke nahi.", "strong"),
    ("A sudden memory", "Aaj randomly ek purani baat yaad aayi aur main akela hi hass pada. Teri baatein thi hi itni funny.", "love"),
    ("Self care day", "Aaj poora din apne liye nikala. Good food, good movie, relaxation. Mind thoda light mehsoos kar raha hai.", "peaceful"),
    ("Missing your support", "Aaj thoda tough day tha. Tera wo 'sab theek ho jayega' bolna miss kiya maine. Tu meri strength thi.", "missing"),
    ("80 Days of silence", "80 days complete. Almost 3 months hone wale hain. Main ab pehle jitna nahi rota, par miss roz karta hoon.", "sad"),
    ("New routine", "Apna daily routine change kiya hai. Morning walk, healthy diet, work, read. Lifestyle better ho rahi hai.", "strong"),
    ("Rain in August", "August me bhi achi baarish ho rahi hai. Window se paani ki boondein dekhna acha lagta hai.", "peaceful"),
    ("Thinking about us", "Humne kitne saare plans banaye the na? Kuch poore hue, kuch nahi. Par wo sapne khoobsurat the.", "love"),
    ("Quiet night", "Raat bhot shant hai. Light off karke bed pe leta hoon. Dimaag me bas shaanti aur teri halki si yaad.", "peaceful"),
    ("Working hard", "Kaam me poora focus hai mera. High efficiency se kaam kar raha hoon. Professional life track pe hai.", "strong"),
    ("Rakhi vibes in market", "Bazar me festivals ki taiyari ho rahi hai. Mausam me ek alag hi vibe hai. Festival season shuru hone wala hai.", "thoughtful"),
    ("Independence Day thoughts", "15 August. Independence day. Freedom feel kar raha hoon par ek attachment bhi hai tere sath hamesha.", "strong"),
    ("A quiet reflection", "Maine mehsoos kiya ki main ab akela rehna seekh gaya hoon. Akelepan me bhi ek sukoon hai.", "peaceful"),
    ("90 Days — 3 Months", "Exactly 3 months (90 days) ho gaye. Quarterly milestone. Main ab ek naya insaan hoon, pehle se zyada mature.", "strong"),
    ("Memories fading?", "Nahi, yaadein fade nahi hui hain, bas unka dard kam ho gaya hai. Ab wo yaadein muskurahat deti hain.", "love"),
    ("Rainy evening walk", "Shaam ko baarish ke baad walk ki. Hawa me mitti ki khushboo thi. Very refreshing.", "peaceful"),
    ("Gratitude for memories", "Main thankful hoon ki tu meri life me aayi. Tune mujhe bhot kuch sikhaya. Thanks for everything.", "love"),
    ("90 Days completed", "90 din ho gaye bina baat kiye. It's a long time. Main strong hoon aur aage badh raha hoon.", "strong"),
    ("Day 91 of reflection", "Aaj 91 days. Har din ek naya lesson hai. Main quietness me bhi peace dhoond raha hoon.", "peaceful"),
    ("21 August — Day 92", "Aaj 21 August hai. Almost 3 months complete ho gaye. Har ek din maine tujhe yaad kiya hai par ek samajhdari ke sath.", "thoughtful"),
    ("22 August — 93rd Day", "Aaj 22 August hai. Exactly 93 days complete ho gaye 22 May se leke aaj tak. Maine apni saari feelings is diary me save ki hain.", "love")
]

num_days = len(entries_raw)
all_entries = []

for i in range(num_days):
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
js_content += "   93 Complete Daily Entries — May 22 to August 22, 2026\n"
js_content += "   ========================================== */\n\n"
js_content += "const DIARY_ENTRIES = " + json.dumps(all_entries, indent=4, ensure_ascii=False) + ";\n"

with open("c:/Users/Harsh/OneDrive/Desktop/valentine-website/js/entries-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {len(all_entries)} complete entries successfully!")
