from PIL import Image

# Overwrite assets/images/her1.jpeg with the perfectly upright rotated version (90 degrees counter-clockwise / 90 degree rotation)
img = Image.open("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/images/her1_rot90.jpeg")
img.save("c:/Users/Harsh/OneDrive/Desktop/valentine-website/assets/images/her1.jpeg", quality=95)

print("Saved upright image to assets/images/her1.jpeg successfully!")
