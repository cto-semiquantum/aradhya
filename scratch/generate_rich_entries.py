import json
from datetime import datetime, timedelta

start_date = datetime(2026, 5, 22, 20, 0, 0)

routines = [
    "Subah 8 baje college gaya, lectures attend kiye. Canteen me friends ke saath chai pi rahe the par dhyan poora tumhare khayal me hi tha. Project work me thoda busy tha, shaam ko ghar aaya, thak gaya tha. Room ki light off ki, tumhari photo dekhi aur muskura kar so gaya.",
    "Lab practical thaa aaj, poora din coding aur circuit test me nikal gaya. Dosto ne puchha shaam ko bahar chalein? Maine mana kar diya. Ghar aake thoda padha, tumhari pic dekhi aur so gaya.",
    "College canteen me baith ke dosto ki baatein sun raha tha, par mind me tumhara wo pyara smile ghoom raha tha. Shaam ko room aake naya project code submit kiya. Bed pe lete hi tumhari photo dekhi aur soo gaya.",
    "Subah college late ho gaya thaa, jaldi me assignment submit kiya. Prof ne project presentation ki date de di. Shaam ko dosto ke sath chai pine gaya. Ghar aake late night laptop band kiya, tumhari pic dekhi aur so gaya.",
    "Poora din college library me bitaya, exam aur project ka tension thaa. Par har 15 min me phone screen off-on karke tumhari pic dekhta raha. Raat ko 11 baje lights dim ki, tumhari pic dekhi aur soo gaya.",
    "Aaj sunday thaa, poora din ghar pe project pe kaam kiya. Code debug karte karte thak gaya thaa. Shaam ko thoda walk pe gaya. Raat ko room me aaya, phone me tumhari photo kholi, use dekhte dekhte neend aa gayi.",
    "College me naye project ki team bani. Maine kaam sambhal liya taaki busy reh saku. Par kitna bhi kaam kar loon, shaam ko ghar aate hi tumhari kami mehsoos hoti hai. Night me tumhari pic dekh kar so gaya.",
    "Subah college bus me baith kar hamara favorite song sun raha tha. Weather bohot pyara tha. College me 3 lectures attend kiye. Shaam ko ghar aake assignment khatam kiya, tumhari photo dekhi aur so gaya.",
    "College me seminar tha, poora din auditorium me bita. Dosto ke sath thodi baatein hui. Shaam ko ghar aate waqt baarish hone lagi. Room aake kapde change kiye, tumhari photo screen par rakhi aur so gaya.",
    "Project ka code run nahi ho raha tha, 3 ghante bug fix karne me lag gaye. Akhir me build successful hua toh thoda sukoon mila. Phir ghar aake phone me tumhari photo dekhi aur ek meethi si smile ke saath so gaya.",
    "College se aate waqt shaam ko dosto ke sath tapri par chai pi. Sab apne baare me baat kar rahe the, mera dil bas tumhara naam le raha tha. Ghar aake bed pe leta, tumhari pic dekhi aur so gaya.",
    "Subah gym gaya, workout karke thoda refresh laga. Phir college ke 2 lectures liye. Shaam ko ghar aake project module upload kiya. Raat ko tumhari photo dekhte dekhte neend aa gayi.",
    "Poora din college me assignment complete karne me bita. Shaam ko rainy evening walk pe nikla. Garam chai pi aur tumhari purani baatein yaad aayi. Room aake tumhari pic dekhi aur so gaya.",
    "College me dosto ne treat di thi, sab hass rahe the. Main bhi smiling tha par andar se tumhari yaad aa rahi thi. Ghar aake late night code refactor kiya, tumhari photo dekhi aur so gaya.",
    "Subah 9 baje college presentation thi, sab badhiya raha. Prof ne appreciate kiya. Shaam ko room aake mom se baat ki. Raat ko 11:30 baje phone me tumhari pic dekhi aur soo gaya.",
    "Project ka phase 1 complete ho gaya aaj. Thoda satisfaction mila. Shaam ko dosto ke sath momos khane gaya. Ghar aake lights off ki, tumhari photo screen pe dekhi aur so gaya.",
    "College off tha, poora din room me baith ke naya skill seekha aur project banaya. Shaam ko balcony se mausam dekha. Night me tumhari pic dekh kar ek pyaari si smile ke saath so gaya.",
    "College library me shaant baith ke padhai ki. Har page turning pe tumhara khayal aaya. Shaam ko dosto ke sath thoda time bita. Ghar aake late night tumhari pic dekhi aur so gaya.",
    "Subah se rain ho rahi thi, college jaane ka mann nahi tha par compulsory lab thaa. Lab me code compile karke ghar aaya. Room me lights dim karke tumhari pic dekhi aur soo gaya.",
    "College me sports event ka announcement hua, dosto ne mera naam daal diya. Din bhar masti hui. Shaam ko thak kar room aaya, tumhari photo dekhi aur so gaya."
]

titles_list = [
    "College & Busy Day", "Lab Practical & Coding", "Library Hours & Memories",
    "Rainy Commute & Assignment", "Project Presentation", "Sunday Coding & Walk",
    "Team Project & Evening Memories", "Bus Ride & Songs", "Seminar & Rain Drops",
    "Late Night Bug Fix", "College Tapri Chai", "Gym & Lectures",
    "Rainy Evening Walk", "Canteen Treat & Code Refactor", "Presentation Success",
    "Project Phase 1 Done", "Room Coding & Sunset", "Library Quiet Hours",
    "Compulsory Lab & Coding", "Sports Event & Fatigue"
]

entries = []
current_date = start_date

for i in range(93):
    d_str = current_date.strftime("%Y-%m-%dT%H:%M:%S")
    days_since = i
    
    if i == 0:
        title = "22 May — Aaj sab khatam ho gaya?"
        text = "Aaj 22 May ko baat band ho gayi. Dil itna bhari tha ki college se room aate waqt raaste bhar chup raha. Room me light off ki, tumhari photo dekhte dekhte raat bhar ro raha hoon. Main kaise rahunga tere bina?"
        mood = "sad"
    elif i == 92:
        title = "22 August — 93rd Day of Endless Love"
        text = "Aaj 22 August hai. Exactly 93 days complete ho gaye 22 May se leke aaj tak. Poora din college, projects aur daily routine chal raha hai... par har raat ghar aake jab tumhari photo dekhta hoon, toh dil wahi bolta hai — main kal bhi tera tha, aaj bhi tera hoon, aur hamesha tera hi rahunga. ❤️"
        mood = "love"
    else:
        r_text = routines[i % len(routines)]
        date_nice = current_date.strftime("%d %B")
        title = f"{date_nice} (Day {i+1}) — {titles_list[i % len(titles_list)]}"
        text = f"{r_text}"
        
        moods = ["missing", "love", "thoughtful", "sad", "peaceful", "strong"]
        mood = moods[i % len(moods)]

    entry = {
        "id": 1000 + i,
        "date": d_str,
        "title": title,
        "text": text,
        "mood": mood,
        "daysSince": days_since
    }
    entries.append(entry)
    current_date += timedelta(days=1)

file_content = "/* ==========================================\n"
file_content += "   DIARY ENTRIES DATA\n"
file_content += "   93 Detailed & Realistic Daily Entries — May 22 to August 22, 2026\n"
file_content += "   ========================================== */\n\n"
file_content += "const DIARY_ENTRIES = " + json.dumps(entries, indent=4) + ";\n"

output_path = r"c:\Users\Harsh\OneDrive\Desktop\valentine-website\js\entries-data.js"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(file_content)

print(f"Successfully generated 93 clean entries in {output_path}")
