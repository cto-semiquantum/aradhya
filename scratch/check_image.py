from PIL import Image

img_path = "c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/images/her1.jpeg"
img = Image.open(img_path)

print(f"Original size: {img.size}")
print(f"EXIF info: {img.getexif()}")

# Let's rotate the image to be upright.
# Try rotating 90, 180, or 270 degrees.
# Let's save rotated versions: 90, 270, etc.

rot_90 = img.rotate(90, expand=True)
rot_90.save("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/images/her1_rot90.jpeg")

rot_270 = img.rotate(270, expand=True)
rot_270.save("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/images/her1_rot270.jpeg")

rot_180 = img.rotate(180, expand=True)
rot_180.save("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/images/her1_rot180.jpeg")

print("Saved rotated variants for inspection!")
