import urllib.request
import json
import os
import re

output_dir = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets"

# List of songs to fetch real MP3 audio files
songs_to_fetch = [
    {
        "filename": "agar_tum_saath_ho.mp3",
        "query": "Agar Tum Saath Ho Tamasha Arijit Singh Alka Yagnik"
    },
    {
        "filename": "channa_mereya.mp3",
        "query": "Channa Mereya Ae Dil Hai Mushkil Arijit Singh"
    },
    {
        "filename": "hamari_adhuri_kahani.mp3",
        "query": "Hamari Adhuri Kahani Title Track Arijit Singh"
    },
    {
        "filename": "tujhe_kitna_chahne_lage.mp3",
        "query": "Tujhe Kitna Chahne Lage Kabir Singh Arijit Singh"
    },
    {
        "filename": "khairiyat.mp3",
        "query": "Khairiyat Chhichhore Arijit Singh"
    },
    {
        "filename": "bhula_dena.mp3",
        "query": "Bhula Dena Aashiqui 2 Mustafa Zahid"
    }
]

print("Searching and downloading MP3s...")

# We can search archive.org or public mp3 repositories
import yt_dlp

ydl_opts = {
    'format': 'ba/best',
    'outtmpl': os.path.join(output_dir, '%(filename)s.%(ext)s'),
    'quiet': True,
    'no_warnings': True,
    'extract_flat': False
}

# Use yt-dlp with SoundCloud or Youtube Search
for item in songs_to_fetch:
    out_file = os.path.join(output_dir, item['filename'])
    print(f"\nProcessing {item['filename']}...")
    
    # Try soundcloud or youtube search
    search_url = f"scsearch1:{item['query']}"
    
    opts = {
        'format': 'mp3/bestaudio/best',
        'outtmpl': out_file.replace('.mp3', '') + '.%(ext)s',
        'quiet': False
    }
    
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([search_url])
        print(f"Downloaded {item['filename']} successfully!")
    except Exception as e:
        print(f"Soundcloud failed for {item['filename']}: {e}")
        # Try fallback ytsearch
        try:
            yt_opts = {
                'format': 'm4a/bestaudio/best',
                'outtmpl': out_file.replace('.mp3', '') + '.%(ext)s',
                'quiet': False
            }
            with yt_dlp.YoutubeDL(yt_opts) as ydl:
                ydl.download([f"ytsearch1:{item['query']} audio"])
            print(f"Downloaded via ytsearch for {item['filename']}!")
        except Exception as e2:
            print(f"Fallback failed for {item['filename']}: {e2}")

print("\nDone processing!")
