import yt_dlp
import os

songs = [
    {
        "name": "agar_tum_saath_ho",
        "url": "https://www.youtube.com/watch?v=sK7riqg25Ac"
    },
    {
        "name": "channa_mereya",
        "url": "https://www.youtube.com/watch?v=284Ov7ys14E"
    },
    {
        "name": "hamari_adhuri_kahani",
        "url": "https://www.youtube.com/watch?v=_aL5u2zmsC0"
    },
    {
        "name": "tujhe_kitna_chahne_lage",
        "url": "https://www.youtube.com/watch?v=2GfTMdWfN5I"
    },
    {
        "name": "khairiyat",
        "url": "https://www.youtube.com/watch?v=hoNb6HuNmU0"
    },
    {
        "name": "bhula_dena",
        "url": "https://www.youtube.com/watch?v=fH_0nS3i2_U"
    }
]

output_dir = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets"

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '128',
    }],
    'outtmpl': os.path.join(output_dir, '%(name)s.%(ext)s'),
}

for s in songs:
    out_path = os.path.join(output_dir, f"{s['name']}.mp3")
    if os.path.exists(out_path):
        print(f"Skipping {s['name']}, already exists.")
        continue
    
    print(f"Downloading {s['name']}...")
    opts = ydl_opts.copy()
    opts['outtmpl'] = os.path.join(output_dir, f"{s['name']}.%(ext)s")
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([s['url']])
        print(f"Successfully downloaded {s['name']}.mp3!")
    except Exception as e:
        print(f"Failed to download {s['name']}: {e}")

print("All song downloads processing finished!")
