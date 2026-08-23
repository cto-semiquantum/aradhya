import os
from PIL import Image

src_img = r"c:\Users\Harsh\OneDrive\Desktop\valentine-website\assets\images\her1.jpeg"
out_dir = r"c:\Users\Harsh\OneDrive\Desktop\valentine-website\assets\images"

img = Image.open(src_img).convert("RGBA")

# Create 192x192
img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
img_192.save(os.path.join(out_dir, "icon-192.png"), "PNG")

# Create 512x512
img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
img_512.save(os.path.join(out_dir, "icon-512.png"), "PNG")

print("PWA PNG Icons created successfully!")
