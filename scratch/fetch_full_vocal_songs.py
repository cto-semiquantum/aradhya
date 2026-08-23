import yt_dlp
import os

songs = [
    {
        "filename": "agar_tum_saath_ho.mp3",
        "query": "scsearch1:Agar Tum Saath Ho Tamasha Full Original Song Alka Yagnik Arijit Singh"
    },
    {
        "filename": "channa_mereya.mp3",
        "query": "scsearch1:Channa Mereya Ae Dil Hai Mushkil Full Original Vocal Song Arijit Singh"
    },
    {
        "filename": "hamari_adhuri_kahani.mp3",
        "query": "scsearch1:Hamari Adhuri Kahani Title Track Original Vocal Arijit Singh"
    },
    {
        "filename": "tujhe_kitna_chahne_lage.mp3",
        "query": "scsearch1:Tujhe Kitna Chahne Lage Kabir Singh Original Vocal Arijit Singh"
    },
    {
        "filename": "khairiyat.mp3",
        "query": "scsearch1:Khairiyat Sad Version Original Vocal Arijit Singh"
    },
    {
        "filename": "bhula_dena.mp3",
        "query": "scsearch1:Bhula Dena Mujhe Aashiqui 2 Original Vocal Mustafa Zahid"
    }
]

output_dir = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets"

for item in songs:
    out_file = os.path.join(output_dir, item['filename'])
    print(f"\nFetching vocal track for {item['filename']}...")
    
    opts = {
        'format': 'mp3/bestaudio/best',
        'outtmpl': out_file.replace('.mp3', '') + '.%(ext)s',
        'quiet': False
    }
    
    try:
        if os.path.exists(out_file):
            os.remove(out_file)
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([item['query']])
        print(f"Successfully downloaded vocal track {item['filename']}! Size: {os.path.getsize(out_file) / (1024*1024):.2f} MB")
    except Exception as e:
        print(f"Error downloading {item['filename']}: {e}")

# Copy agar_tum_saath_ho.mp3 to music.mp3
import shutil
src = os.path.join(output_dir, "agar_tum_saath_ho.mp3")
dst = os.path.join(output_dir, "music.mp3")
if os.path.exists(src):
    shutil.copyfile(src, dst)
    print("Updated music.mp3 with full vocal track!")

print("\nFinished downloading all full vocal song tracks!")
