import yt_dlp
import os

out_file = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/khairiyat.mp3"
opts = {
    'format': 'mp3/bestaudio/best',
    'outtmpl': out_file.replace('.mp3', '') + '.%(ext)s',
    'quiet': False
}

try:
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download(['scsearch1:Khairiyat Pucho Chhichhore Arijit Singh Vocal Song'])
    print(f"Downloaded khairiyat.mp3! Size: {os.path.getsize(out_file) / (1024*1024):.2f} MB")
except Exception as e:
    print("Error:", e)
