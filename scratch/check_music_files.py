import os

for f in ["music.mp3", "music3.mp3"]:
    p = os.path.join("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets", f)
    if os.path.exists(p):
        print(f"{f}: size {os.path.getsize(p)} bytes")
