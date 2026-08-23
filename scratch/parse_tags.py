import os

def parse_id3(filepath):
    try:
        with open(filepath, 'rb') as f:
            data = f.read(5000)
            print(f"Reading header of {filepath}:")
            # Look for readable strings
            printable = "".join([chr(b) if 32 <= b <= 126 else " " for b in data])
            words = [w for w in printable.split() if len(w) > 3]
            print(words[:20])
    except Exception as e:
        print(e)

parse_id3("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/music.mp3")
parse_id3("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/music3.mp3")
