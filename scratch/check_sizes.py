import os

# Check sizes of all downloaded song files
assets_dir = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets"
files = [f for f in os.listdir(assets_dir) if f.endswith(('.mp3', '.m4a'))]

for f in files:
    fp = os.path.join(assets_dir, f)
    print(f"{f}: {os.path.getsize(fp) / (1024*1024):.2f} MB")
