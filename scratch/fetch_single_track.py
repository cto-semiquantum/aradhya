import yt_dlp
import os

out_path = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/agar_tum_saath_ho.mp3"

ydl_opts = {
    'format': 'mp3/bestaudio/best',
    'outtmpl': out_path,
    'quiet': False
}

search_url = "scsearch1:Agar Tum Saath Ho Tamasha Alka Yagnik 5 minutes"

try:
    if os.path.exists(out_path):
        os.remove(out_path)
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([search_url])
    print(f"Downloaded new size: {os.path.getsize(out_path) / (1024*1024):.2f} MB")
except Exception as e:
    print("Error:", e)
