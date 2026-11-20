import os
import base64
from PIL import Image, ImageDraw

def generate_assets():
    src_path = 'C:/Users/Hp/.gemini/antigravity/brain/1d61eb77-5216-484b-b8c2-03bbdb30fcba/.user_uploaded/media_1795168732964_4289a8ce.jpg'
    pub_dir = 'client/public'
    img_dir = os.path.join(pub_dir, 'images')
    os.makedirs(img_dir, exist_ok=True)

    src = Image.open(src_path)
    print(f"Loaded source image: {src.size}, format: {src.format}")

    # 1. Full logo image (crop clean black padding around full content)
    # Full content is around x: 250..775, y: 140..525
    # Let's crop full content with balanced padding
    full_crop_x1 = 200
    full_crop_y1 = 110
    full_crop_x2 = 824
    full_crop_y2 = 560
    full_logo = src.crop((full_crop_x1, full_crop_y1, full_crop_x2, full_crop_y2))
    full_logo.save(os.path.join(img_dir, 'logo.png'), 'PNG', optimize=True)
    print("Saved images/logo.png")

    # 2. Square full logo (512x512 square containing full logo on black)
    # Content width = 624, height = 450. Max dim is 624.
    # Let's create a 700x700 canvas on black, paste full logo, resize to 512x512
    sq_canvas = Image.new('RGB', (700, 700), (0, 0, 0))
    paste_x = (700 - (full_crop_x2 - full_crop_x1)) // 2
    paste_y = (700 - (full_crop_y2 - full_crop_y1)) // 2
    sq_canvas.paste(full_logo, (paste_x, paste_y))
    logo_square_512 = sq_canvas.resize((512, 512), Image.Resampling.LANCZOS)
    logo_square_512.save(os.path.join(img_dir, 'logo-square.png'), 'PNG', optimize=True)
    print("Saved images/logo-square.png")

    # 3. Square CC Emblem (Master for all Favicons / App Icons)
    # Emblem center: (513.5, 270.0), emblem width: 465, height: 254
    # On an N=680 square canvas, all pixels fit safely inside Google's circular mask (radius 340)
    N = 680
    emblem_crop_x1, emblem_crop_y1 = 260, 130
    emblem_crop_x2, emblem_crop_y2 = 767, 410
    emblem_crop = src.crop((emblem_crop_x1, emblem_crop_y1, emblem_crop_x2, emblem_crop_y2))

    emblem_canvas = Image.new('RGB', (N, N), (0, 0, 0))
    paste_emb_x = (N - (emblem_crop_x2 - emblem_crop_x1)) // 2
    paste_emb_y = (N - (emblem_crop_y2 - emblem_crop_y1)) // 2
    emblem_canvas.paste(emblem_crop, (paste_emb_x, paste_emb_y))

    # Save master square emblem
    logo_mark_512 = emblem_canvas.resize((512, 512), Image.Resampling.LANCZOS)
    logo_mark_512.save(os.path.join(img_dir, 'logo-mark.png'), 'PNG', optimize=True)
    logo_mark_512.save(os.path.join(pub_dir, 'android-chrome-512x512.png'), 'PNG', optimize=True)
    print("Saved logo-mark.png & android-chrome-512x512.png")

    # 4. Generate all required sizes
    sizes = {
        'android-chrome-192x192.png': 192,
        'favicon-192x192.png': 192,
        'apple-touch-icon.png': 180,
        'favicon-144x144.png': 144,
        'favicon-96x96.png': 96,
        'favicon-48x48.png': 48,
        'favicon-32x32.png': 32,
        'favicon-16x16.png': 16,
        'favicon.png': 48
    }

    images_dict = {}
    for filename, sz in sizes.items():
        resized = emblem_canvas.resize((sz, sz), Image.Resampling.LANCZOS)
        out_path = os.path.join(pub_dir, filename)
        resized.save(out_path, 'PNG', optimize=True)
        images_dict[sz] = resized
        print(f"Saved {filename} ({sz}x{sz})")

    # 5. Generate multi-resolution favicon.ico (48x48, 32x32, 16x16)
    # PIL saves .ico with multiple sizes by providing a list to append_images
    ico_path = os.path.join(pub_dir, 'favicon.ico')
    img_48 = images_dict[48]
    img_32 = images_dict[32]
    img_16 = images_dict[16]
    img_48.save(ico_path, format='ICO', sizes=[(48, 48), (32, 32), (16, 16)])
    print(f"Saved multi-resolution favicon.ico with sizes: 48x48, 32x32, 16x16")

    # 6. Generate crisp favicon.svg with embedded 96x96 base64 PNG
    b64_96 = base64.b64encode(open(os.path.join(pub_dir, 'favicon-96x96.png'), 'rb').read()).decode('utf-8')
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
  <image href="data:image/png;base64,{b64_96}" x="0" y="0" width="96" height="96"/>
</svg>
'''
    with open(os.path.join(pub_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Saved favicon.svg")

    print("\nAll brand logo and favicon assets generated successfully!")

if __name__ == '__main__':
    generate_assets()
