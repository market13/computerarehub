import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

out_dir = r"C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder\client\public\images\products\case"
os.makedirs(out_dir, exist_ok=True)

def create_cabinet_image(filename, brand, model_title, is_rgb=False, is_slim=False, has_smps_badge=False):
    width, height = 500, 500
    img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Soft ambient drop shadow underneath chassis
    shadow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    shadow_box = [110, 420, 390, 455] if not is_slim else [130, 420, 370, 450]
    sdraw.ellipse(shadow_box, fill=(0, 0, 0, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    img.paste(shadow, (0, 0), shadow)
    draw = ImageDraw.Draw(img)

    if is_slim:
        # Slim profile chassis (95mm profile)
        # Main Tower Body
        body_poly = [(160, 90), (330, 70), (345, 415), (175, 435)]
        draw.polygon(body_poly, fill="#131720", outline="#232b3b")

        # Side panel
        side_poly = [(190, 95), (325, 78), (340, 405), (205, 422)]
        draw.polygon(side_poly, fill="#1c2331", outline="#2e384d")
        
        # Side air ventilation slots
        for y in range(160, 360, 16):
            draw.line([(220, y), (280, y - 8)], fill="#111622", width=3)

        # Front panel (narrow perspective)
        front_poly = [(160, 90), (190, 95), (205, 422), (175, 435)]
        draw.polygon(front_poly, fill="#0d1117", outline="#2a3346")

        # Front power button & ports
        draw.ellipse([170, 120, 182, 132], fill="#38bdf8", outline="#7dd3fc")
        draw.rectangle([172, 145, 180, 153], fill="#475569")
        draw.rectangle([172, 160, 180, 168], fill="#475569")

        # Brand text
        draw.text((187, 390), brand.upper(), fill="#94a3b8", anchor="mm")

    elif is_rgb:
        # Gaming Chassis with Front Mesh / RGB / Side Glass Window
        # Front face
        front_poly = [(130, 100), (225, 75), (225, 420), (130, 435)]
        draw.polygon(front_poly, fill="#0f141c", outline="#252d3d")

        # Front Mesh pattern
        for y in range(130, 400, 10):
            draw.line([(140, y + 5), (215, y - 12)], fill="#1a202c", width=2)

        # ARGB Glowing Line / Stripe
        glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(glow_layer)
        rgb_colors = [(244, 63, 94), (168, 85, 247), (59, 130, 246), (16, 185, 129), (234, 179, 8)]
        for i, (x1, y1) in enumerate([(145, 120), (160, 190), (175, 260), (190, 330), (205, 400)]):
            c = rgb_colors[i % len(rgb_colors)]
            gdraw.ellipse([x1 - 10, y1 - 10, x1 + 10, y1 + 10], fill=(*c, 160))
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(8))
        img.paste(glow_layer, (0, 0), glow_layer)
        draw = ImageDraw.Draw(img)

        # Front RGB line
        draw.line([(145, 120), (205, 400)], fill="#38bdf8", width=4)

        # Side Acrylic / Tempered Glass Window
        side_poly = [(225, 75), (370, 95), (370, 405), (225, 420)]
        draw.polygon(side_poly, fill="#151b27", outline="#334155", width=2)
        
        # Interior preview through side window
        interior_window = [(235, 95), (360, 110), (360, 390), (235, 405)]
        draw.polygon(interior_window, fill="#0b0f17", outline="#1e293b")
        
        # Internal illuminated rear fan
        draw.ellipse([310, 140, 350, 180], outline="#a855f7", width=3)
        draw.ellipse([322, 152, 338, 168], fill="#ec4899")

        # GPU bracket inside
        draw.rectangle([250, 240, 345, 265], fill="#1e293b", outline="#3b82f6")
        
        # Glass Reflection highlight (subtle transparent sheen)
        glass_sheen = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        gsdraw = ImageDraw.Draw(glass_sheen)
        gsdraw.polygon([(260, 100), (280, 102), (250, 380), (235, 378)], fill=(255, 255, 255, 28))
        img.paste(glass_sheen, (0, 0), glass_sheen)
        draw = ImageDraw.Draw(img)

        # Top panel
        top_poly = [(130, 100), (225, 75), (370, 95), (275, 120)]
        draw.polygon(top_poly, fill="#1c2433", outline="#334155")
        # Top dust filter
        draw.polygon([(160, 103), (235, 83), (345, 98), (270, 118)], fill="#0f141d")

        # Brand Logo on bottom PSU shroud
        draw.text((290, 360), brand.upper(), fill="#64748b", anchor="mm")

    else:
        # Standard Clean Micro-ATX Office/Desktop Cabinet
        # Front face
        front_poly = [(135, 95), (230, 75), (230, 420), (135, 435)]
        draw.polygon(front_poly, fill="#111622", outline="#273248")

        # Front Panel Bezel Texture (Brushed lines)
        for y in range(140, 410, 12):
            draw.line([(145, y + 4), (220, y - 10)], fill="#182030", width=1)

        # 5.25" Drive bay simulation
        draw.polygon([(145, 125), (220, 110), (220, 155), (145, 170)], fill="#0c1018", outline="#222b3d")

        # Power button & Front I/O
        draw.ellipse([150, 102, 164, 114], fill="#0284c7", outline="#38bdf8")
        draw.rectangle([172, 102, 180, 110], fill="#475569")
        draw.rectangle([186, 99, 194, 107], fill="#475569")
        draw.rectangle([200, 96, 208, 104], fill="#475569")

        # Side panel
        side_poly = [(230, 75), (365, 95), (365, 405), (230, 420)]
        draw.polygon(side_poly, fill="#1a2230", outline="#2e3b52", width=2)
        
        # Side air vent grille
        for y in range(210, 310, 12):
            draw.line([(275, y), (325, y + 8)], fill="#0f141e", width=3)

        # Top panel
        top_poly = [(135, 95), (230, 75), (365, 95), (270, 115)]
        draw.polygon(top_poly, fill="#232e42", outline="#3b4a66")

        # Brand Stamp on front
        draw.text((182, 385), brand.upper(), fill="#94a3b8", anchor="mm")

    # If bundled SMPS badge
    if has_smps_badge:
        # Badge in top right corner
        draw.rounded_rectangle([330, 25, 475, 65], radius=6, fill="#047857", outline="#10b981", width=1)
        draw.text((402, 45), "WITH 450W SMPS", fill="#ffffff", anchor="mm")

    # Corner watermark/badge
    draw.rounded_rectangle([20, 25, 140, 55], radius=6, fill="#0f172a", outline="#334155")
    draw.text((80, 40), brand.upper(), fill="#f8fafc", anchor="mm")

    # Save as high-quality JPEG or PNG
    final_path = os.path.join(out_dir, filename)
    img.convert("RGB").save(final_path, quality=95)
    print(f"Generated: {final_path}")

cabinets = [
    ("intex-it-308-cabinet.jpg", "Intex", "IT-308 Classic Micro-ATX Cabinet", False, False, False),
    ("intex-it-212-cabinet.jpg", "Intex", "IT-212 Office Micro-ATX Cabinet", False, False, False),
    ("intex-corona-smps-cabinet.jpg", "Intex", "Corona Slim Cabinet with 450W SMPS", False, False, True),
    ("intex-wave-rgb-cabinet.jpg", "Intex", "Wave Gaming Micro-ATX Cabinet", True, False, False),

    ("geonix-gx-c100-cabinet.jpg", "Geonix", "GX-C100 Compact Micro-ATX Cabinet", False, False, False),
    ("geonix-gx-slim-cabinet.jpg", "Geonix", "GX-Slim Dual-Orientation Cabinet", False, True, False),
    ("geonix-gx-450-smps-cabinet.jpg", "Geonix", "GX-450 Cabinet with 450W SMPS", False, False, True),
    ("geonix-marvel-rgb-cabinet.jpg", "Geonix", "Marvel RGB Micro-ATX Gaming Cabinet", True, False, False),
]

for fn, b, t, rgb, slim, smps in cabinets:
    create_cabinet_image(fn, b, t, is_rgb=rgb, is_slim=slim, has_smps_badge=smps)

print("All 8 cabinet images generated successfully!")
