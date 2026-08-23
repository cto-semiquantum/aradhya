import yt_dlp
import os

songs = [
    {
        "name": "agar_tum_saath_ho",
        "url": "ytsearch1:agar tum saath ho full song audio"
    },
    {
        "name": "channa_mereya",
        "url": "ytsearch1:channa mereya audio song"
    },
    {
        "name": "hamari_adhuri_kahani",
        "url": "ytsearch1:hamari adhuri kahani title track audio"
    },
    {
        "name": "tujhe_kitna_chahne_lage",
        "url": "ytsearch1:tujhe kitna chahne lage hum audio"
    },
    {
        "name": "khairiyat",
        "url": "ytsearch1:khairiyat sad song audio"
    },
    {
        "name": "bhula_dena",
        "url": "ytsearch1:bhula dena aashiqui 2 audio"
    }
]

output_dir = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets"

for s in songs:
    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        'outtmpl': os.path.join(output_dir, f"{s['name']}.%(ext)s"),
        'noplaylist': True
    }
    print(f"Searching and downloading {s['name']}...")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([s['url']])
        print(f"Downloaded {s['name']}!")
    except Exception as e:
        print(f"Error {s['name']}: {e}")

print("Direct audio downloads completed!")
