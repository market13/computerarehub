import os
from PIL import Image

dir_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/images/shop_by_category'))
total_before = 0
total_after = 0

for file in os.listdir(dir_path):
    if file.endswith('.png'):
        full_in = os.path.join(dir_path, file)
        out_name = os.path.splitext(file)[0] + '.webp'
        full_out = os.path.join(dir_path, out_name)
        
        sz_in = os.path.getsize(full_in)
        total_before += sz_in
        
        with Image.open(full_in) as im:
            # Resize slightly to standard retina 320x320 max for card display (displayed at 160x160)
            im.thumbnail((320, 320), Image.Resampling.LANCZOS)
            im.save(full_out, 'WEBP', quality=80)
            
        sz_out = os.path.getsize(full_out)
        total_after += sz_out
        print(f"{file}: {sz_in // 1024}KB -> {out_name}: {sz_out // 1024}KB")

if total_before > 0:
    print(f"\nTotal: {total_before // 1024}KB -> {total_after // 1024}KB (Saved {((total_before - total_after) / total_before)*100:.1f}%)")
