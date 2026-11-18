import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

out_dir = r"C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder\client\public\images\products\gaming_pc"
os.makedirs(out_dir, exist_ok=True)

try:
    font_bold = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 15)
    font_small = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 13)
    font_screen = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 14)
    font_badge = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 12)
except Exception:
    font_bold = font_small = font_screen = font_badge = None

width, height = 500, 500
img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
draw = ImageDraw.Draw(img)

# Soft shadow underneath monitor and cabinet
shadow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
# Monitor base shadow
sdraw.ellipse([80, 420, 310, 448], fill=(0, 0, 0, 60))
# Tower shadow
sdraw.ellipse([300, 420, 450, 448], fill=(0, 0, 0, 75))
shadow = shadow.filter(ImageFilter.GaussianBlur(12))
img.paste(shadow, (0, 0), shadow)
draw = ImageDraw.Draw(img)

# --- 1. ZEBRONICS 19-INCH MONITOR ---
# Stand base
draw.rounded_rectangle([150, 410, 240, 430], radius=5, fill="#1e293b", outline="#334155")
# Stand neck
draw.rectangle([185, 340, 205, 415], fill="#0f172a", outline="#1e293b")

# Monitor Outer Bezel (19" Widescreen 16:9 ratio)
mon_poly = [60, 150, 330, 350]
draw.rounded_rectangle(mon_poly, radius=8, fill="#0f172a", outline="#334155", width=3)

# Monitor Screen Display Area
draw.rounded_rectangle([68, 158, 322, 332], radius=4, fill="#0284c7")

# Vibrant Desktop Wallpaper gradient effect on screen
screen_img = Image.new("RGBA", (254, 174), (0, 0, 0, 0))
sc_draw = ImageDraw.Draw(screen_img)
for y in range(174):
    r = int(14 + (y / 174) * 40)
    g = int(116 + (y / 174) * 80)
    b = int(144 + (y / 174) * 110)
    sc_draw.line([(0, y), (254, y)], fill=(r, g, b, 255))
# Stylized abstract geometric wave on desktop screen
sc_draw.polygon([(0, 100), (80, 60), (160, 120), (254, 80), (254, 174), (0, 174)], fill=(15, 23, 42, 180))
sc_draw.polygon([(40, 120), (120, 70), (200, 140), (254, 110), (254, 174), (0, 174)], fill=(56, 189, 248, 120))
# Screen text
sc_draw.text((127, 45), 'ZEBRONICS 19" HD', fill=(255, 255, 255, 230), font=font_screen, anchor="mm")
img.paste(screen_img, (68, 158), screen_img)
draw = ImageDraw.Draw(img)

# Zebronics logo on bottom monitor bezel
draw.text((195, 341), "ZEBRONICS", fill="#94a3b8", anchor="mm")


# --- 2. COMPUTER CARE PC TOWER (Right Side) ---
# Tower Body
tower_poly = [(315, 120), (445, 95), (445, 425), (315, 435)]
draw.polygon(tower_poly, fill="#111827", outline="#1f2937")

# Front face of Tower
front_poly = [(315, 120), (370, 110), (370, 430), (315, 435)]
draw.polygon(front_poly, fill="#030712", outline="#374151")

# Front Panel Brushed Texture
for y in range(160, 410, 10):
    draw.line([(325, y), (360, y - 2)], fill="#1f2937", width=1)

# Power Button (Blue LED)
draw.ellipse([335, 135, 349, 149], fill="#0284c7", outline="#38bdf8")
draw.rectangle([330, 160, 338, 166], fill="#6b7280")
draw.rectangle([344, 160, 352, 166], fill="#6b7280")

# Optical Drive Bay Outline
draw.rectangle([323, 180, 362, 205], outline="#374151", width=1)

# Side Panel of Tower
side_poly = [(370, 110), (445, 95), (445, 425), (370, 430)]
draw.polygon(side_poly, fill="#1f2937", outline="#374151")

# Side Ventilation Grid
for y in range(220, 340, 12):
    draw.line([(390, y), (425, y - 4)], fill="#111827", width=3)

# Intel Inside Badge on Tower
draw.rounded_rectangle([326, 385, 360, 405], radius=3, fill="#0284c7")
draw.text((343, 395), "i3", fill="#ffffff", anchor="mm")


try:
    font_bold = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 15)
    font_small = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 13)
    font_screen = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 14)
    font_badge = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 12)
except Exception:
    font_bold = font_small = font_screen = font_badge = None

# Top Left Badge: Complete Desktop PC Setup
draw.rounded_rectangle([20, 20, 230, 56], radius=6, fill="#0f172a", outline="#38bdf8", width=1)
draw.text((125, 38), "FULL SETUP: PC + MONITOR", fill="#38bdf8", font=font_badge, anchor="mm")

# Top Right Price Badge: Rs. 9,999 ONLY
draw.rounded_rectangle([325, 20, 480, 56], radius=8, fill="#dc2626", outline="#f87171", width=1)
draw.text((402, 38), "SPECIAL: Rs. 9,999", fill="#ffffff", font=font_bold, anchor="mm")

# Bottom Specs Strip Pill
draw.rounded_rectangle([20, 455, 480, 488], radius=6, fill="#f1f5f9", outline="#cbd5e1", width=1)
draw.text((250, 472), "Core i3 (3rd Gen) - 8GB RAM - 256GB SSD - 19\" Zebronics Monitor", fill="#0f172a", font=font_small, anchor="mm")

final_path = os.path.join(out_dir, "computercare-i3-3rdgen-zebronics-19inch-combo.jpg")
img.convert("RGB").save(final_path, quality=95)
print(f"Generated product combo image at: {final_path}")
