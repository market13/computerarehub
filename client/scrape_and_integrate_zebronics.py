import urllib.request
import json
import os
import re
import sys
import time

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DATA_DIR = os.path.join(BASE_DIR, 'public', 'data')
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, 'public', 'images', 'products')
PRODUCTS_JSON_PATH = os.path.join(PUBLIC_DATA_DIR, 'products.json')
DIST_PRODUCTS_JSON_PATH = os.path.join(BASE_DIR, 'dist', 'data', 'products.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
}

def clean_html(raw_html):
    if not raw_html:
        return ""
    cleanr = re.compile('<.*?>')
    return re.sub(cleanr, '', raw_html).strip()

def download_image(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response, open(target_path, 'wb') as out_file:
            out_file.write(response.read())
        return True
    except Exception as e:
        return False

def determine_category(prod):
    title = prod.get('title', '').lower()
    ptype = (prod.get('product_type') or '').lower()
    tags = [t.lower() for t in prod.get('tags', [])]
    
    if 'cabinet' in title or 'cabinet' in ptype or 'mid tower' in title or 'matx' in title or 'chassis' in title:
        return 'case'
    if 'liquid cooler' in ptype or 'air cooler' in ptype or 'aio' in title or 'cooler' in title:
        return 'cooler'
    if 'keyboard' in title or 'keyboard' in ptype:
        return 'gaming_keyboard'
    if 'mousepad' in title or 'mousepad' in ptype or 'pad' in title:
        return 'gaming_mousepad'
    if 'mouse' in title or 'mouse' in ptype:
        return 'gaming_mouse'
    if 'headphone' in title or 'headphone' in ptype or 'headset' in title:
        return 'gaming_headset'
    if 'power supply' in ptype or 'psu' in title or '500w' in title or '600w' in title or '750w' in title:
        return 'psu'
    if 'webcam' in title or 'webcam' in ptype or 'camera' in title:
        return 'webcam'
    if 'fan' in title or 'fan' in ptype:
        return 'case_fan'
        
    return 'case' # fallback

print("Fetching Zebronics collection from EliteHubs...")
url = "https://elitehubs.com/collections/zebronics/products.json?limit=250"
req = urllib.request.Request(url, headers=HEADERS)
with urllib.request.urlopen(req, timeout=12) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    raw_products = data.get('products', [])

print(f"Fetched {len(raw_products)} raw Zebronics products.")

with open(PRODUCTS_JSON_PATH, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

# Ensure all category keys exist
for cat in ['case', 'cooler', 'gaming_keyboard', 'gaming_mousepad', 'gaming_mouse', 'gaming_headset', 'psu', 'webcam', 'case_fan', 'monitor']:
    if cat not in catalog:
        catalog[cat] = []

added_counts = {}
seen_ids = set()
for cat, items in catalog.items():
    for item in items:
        seen_ids.add(str(item.get('id', '')))

for p in raw_products:
    pid = str(p.get('id', ''))
    title = p.get('title', '').strip()
    title_lower = title.lower()
    
    cat_key = determine_category(p)
    full_id = f"{cat_key}_{pid}"
    if full_id in seen_ids or pid in seen_ids:
        continue
        
    variants = p.get('variants', [{}])
    variant = variants[0] if variants else {}
    
    try:
        price = float(variant.get('price', 0))
    except (ValueError, TypeError):
        price = 0
        
    try:
        compare_price = float(variant.get('compare_at_price') or price)
    except (ValueError, TypeError):
        compare_price = price
        
    if price <= 0:
        continue
        
    images = p.get('images', [])
    cdn_image = images[0].get('src', '') if images else ''
    
    # Image directory mapping
    subdir_map = {
        'case': 'case',
        'cooler': 'cooler',
        'gaming_keyboard': 'keyboard',
        'gaming_mousepad': 'mousepad',
        'gaming_mouse': 'mouse',
        'gaming_headset': 'headset',
        'psu': 'psu',
        'webcam': 'webcam',
        'case_fan': 'case_fan',
        'monitor': 'monitor'
    }
    img_subdir = subdir_map.get(cat_key, cat_key)
    target_dir = os.path.join(PUBLIC_IMG_DIR, img_subdir)
    os.makedirs(target_dir, exist_ok=True)
    
    handle = p.get('handle', 'item')
    img_filename = f"zeb_{cat_key}_{pid}_{handle[:25]}.jpg"
    img_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', img_filename)
    local_path = os.path.join(target_dir, img_filename)
    rel_img_path = f"/images/products/{img_subdir}/{img_filename}"
    
    downloaded = False
    if cdn_image:
        downloaded = download_image(cdn_image, local_path)
    final_image = rel_img_path if downloaded else (cdn_image or '/images/placeholder.jpg')
    
    # Construct specs
    specs = {
        'vendor': 'Zebronics',
        'in_stock': variant.get('available', True)
    }
    
    if cat_key == 'case':
        is_panoramic = 'cube' in title_lower or 'glass' in title_lower or 'tg' in title_lower or 'panoramic' in title_lower
        is_mesh = 'mesh' in title_lower or 'airflow' in title_lower
        is_white = 'white' in title_lower
        style = 'Panoramic Dual-Chamber Glass' if is_panoramic else ('High-Airflow Mesh' if is_mesh else 'Compact Micro-ATX')
        specs.update({
            'form_factor': 'Mid Tower' if 'mid tower' in title_lower or 'atx' in title_lower else 'Micro-ATX',
            'cabinet_style': style,
            'color': 'White' if is_white else 'Black',
            'supported_motherboards': ['ATX', 'Micro-ATX', 'Mini-ITX'],
            'max_gpu_length': 340,
            'side_panel': 'Tempered Glass' if ('tg' in title_lower or 'glass' in title_lower) else 'Acrylic',
            'included_fans': 'ARGB Fans Included' if 'argb' in title_lower else 'Included Fans'
        })
    elif cat_key == 'gaming_keyboard':
        specs.update({
            'mechanical': 'mechanical' in title_lower or 'switch' in title_lower,
            'wireless': 'wireless' in title_lower or 'pro' in title_lower,
            'layout': 'TKL' if 'tkl' in title_lower else 'Full Size',
            'rgb': 'rgb' in title_lower or 'rainbow' in title_lower
        })
    elif cat_key == 'gaming_mouse':
        specs.update({
            'wireless': 'wireless' in title_lower or 'bluetooth' in title_lower,
            'type': 'Wireless' if 'wireless' in title_lower else 'Wired',
            'rgb': 'rgb' in title_lower or 'optical' in title_lower
        })
    elif cat_key == 'cooler':
        is_aio = 'aio' in title_lower or 'liquid' in title_lower
        specs.update({
            'cooler_type': 'AIO Liquid Cooler' if is_aio else 'Air Cooler',
            'radiator_size': '360mm' if '360' in title_lower else ('240mm' if '240' in title_lower else '120mm'),
            'rgb': 'ARGB' if 'argb' in title_lower else 'RGB',
            'has_display': 'lcd' in title_lower or 'display' in title_lower
        })
    elif cat_key == 'psu':
        wattage = 500
        for w in [450, 500, 550, 600, 650, 700, 750, 850]:
            if str(w) in title_lower:
                wattage = w
                break
        specs.update({
            'wattage': wattage,
            'rating': '80 Plus Bronze' if 'bronze' in title_lower else 'Standard 80 Plus',
            'modular': 'Modular' if 'modular' in title_lower else 'Non-Modular'
        })
        
    prod_obj = {
        'id': full_id,
        'title': title,
        'vendor': 'Zebronics',
        'price': int(price),
        'compare_at_price': int(compare_price) if compare_price > price else int(price * 1.2),
        'category': cat_key,
        'product_type': p.get('product_type') or 'Zebronics Hardware',
        'available': variant.get('available', True),
        'sku': variant.get('sku') or f"ZEB-{pid}",
        'image': final_image,
        'cdn_image': cdn_image,
        'handle': p.get('handle', ''),
        'url': f"https://elitehubs.com/products/{p.get('handle', '')}",
        'description': clean_html(p.get('body_html', ''))[:200] + '...',
        'tags': p.get('tags', []) + ['Zebronics', 'Gaming'],
        'specs': specs
    }
    
    catalog[cat_key].append(prod_obj)
    seen_ids.add(full_id)
    added_counts[cat_key] = added_counts.get(cat_key, 0) + 1

# Now add Zebronics Gaming & Office Monitors
zeb_monitors = [
    {
        'id': 'monitor_zeb_ac32fhd',
        'title': 'ZEBRONICS Zeb-AC32FHD 32 Inch Curved FHD 165Hz VA Panel 1MS Bezel-Less Gaming Monitor',
        'handle': 'zebronics-zeb-ac32fhd-32-inch-curved-fhd-165hz-gaming-monitor',
        'vendor': 'Zebronics',
        'category': 'monitor',
        'product_type': 'Gaming Monitor',
        'price': 14499,
        'compare_at_price': 19999,
        'available': True,
        'sku': 'ZEB-AC32FHD',
        'image': 'https://m.media-amazon.com/images/I/71pUj+n7W7L._SX679_.jpg',
        'cdn_image': 'https://m.media-amazon.com/images/I/71pUj+n7W7L._SX679_.jpg',
        'description': '32 Inch 1800R Curved Screen with 165Hz refresh rate, 1ms response time, 99% sRGB color gamut, dual HDMI and DisplayPort inputs, and built-in stereo speakers.',
        'tags': ['Zebronics', 'Gaming Monitor', 'Curved', '165Hz', 'FHD'],
        'specs': {
            'vendor': 'Zebronics',
            'size': '32"',
            'refresh_rate': '165Hz',
            'resolution': '1080p FHD',
            'panel_type': 'Curved VA',
            'in_stock': True
        }
    },
    {
        'id': 'monitor_zeb_a27fhd',
        'title': 'ZEBRONICS Zeb-A27FHD 27 Inch Curved FHD 165Hz VA Panel 1MS HDR10 Gaming Monitor',
        'handle': 'zebronics-zeb-a27fhd-27-inch-curved-fhd-165hz-gaming-monitor',
        'vendor': 'Zebronics',
        'category': 'monitor',
        'product_type': 'Gaming Monitor',
        'price': 11999,
        'compare_at_price': 16999,
        'available': True,
        'sku': 'ZEB-A27FHD',
        'image': 'https://m.media-amazon.com/images/I/71vU+J9h+8L._SX679_.jpg',
        'cdn_image': 'https://m.media-amazon.com/images/I/71vU+J9h+8L._SX679_.jpg',
        'description': '27 Inch Immersive Curved Full HD Gaming Monitor with 165Hz refresh rate, 1ms MPRT, HDR10 support, ultra-thin bezels, and built-in speakers.',
        'tags': ['Zebronics', 'Gaming Monitor', 'Curved', '165Hz', '27 Inch'],
        'specs': {
            'vendor': 'Zebronics',
            'size': '27"',
            'refresh_rate': '165Hz',
            'resolution': '1080p FHD',
            'panel_type': 'Curved VA',
            'in_stock': True
        }
    },
    {
        'id': 'monitor_zeb_a24fhd',
        'title': 'ZEBRONICS Zeb-A24FHD 24 Inch FHD 100Hz IPS Panel 1MS Ultra-Slim Gaming Monitor',
        'handle': 'zebronics-zeb-a24fhd-24-inch-fhd-100hz-ips-gaming-monitor',
        'vendor': 'Zebronics',
        'category': 'monitor',
        'product_type': 'Gaming Monitor',
        'price': 6899,
        'compare_at_price': 9999,
        'available': True,
        'sku': 'ZEB-A24FHD',
        'image': 'https://m.media-amazon.com/images/I/71z7wYh4M7L._SX679_.jpg',
        'cdn_image': 'https://m.media-amazon.com/images/I/71z7wYh4M7L._SX679_.jpg',
        'description': '24 Inch IPS Bezel-Less display with 100Hz refresh rate, 1ms response time, HDMI & VGA connectivity, wide viewing angles, and flicker-free technology.',
        'tags': ['Zebronics', 'Gaming Monitor', 'IPS', '100Hz', '24 Inch'],
        'specs': {
            'vendor': 'Zebronics',
            'size': '24"',
            'refresh_rate': '100Hz',
            'resolution': '1080p FHD',
            'panel_type': 'IPS',
            'in_stock': True
        }
    },
    {
        'id': 'monitor_zeb_v19hd',
        'title': 'ZEBRONICS Zeb-V19HD 18.5 Inch HD 60Hz Slim LED Office & Home Monitor',
        'handle': 'zebronics-zeb-v19hd-18-5-inch-hd-60hz-monitor',
        'vendor': 'Zebronics',
        'category': 'monitor',
        'product_type': 'Monitor',
        'price': 3499,
        'compare_at_price': 5499,
        'available': True,
        'sku': 'ZEB-V19HD',
        'image': 'https://m.media-amazon.com/images/I/71KxO2x6wHL._SX679_.jpg',
        'cdn_image': 'https://m.media-amazon.com/images/I/71KxO2x6wHL._SX679_.jpg',
        'description': 'Compact 18.5 Inch HD monitor (1366x768) with 60Hz refresh rate, HDMI and VGA ports, wall mountable design, and anti-glare screen.',
        'tags': ['Zebronics', 'Office Monitor', '18.5 Inch', 'HD'],
        'specs': {
            'vendor': 'Zebronics',
            'size': '19"',
            'refresh_rate': '60Hz',
            'resolution': '1366x768 HD',
            'panel_type': 'TN',
            'in_stock': True
        }
    },
    {
        'id': 'monitor_zeb_s32a',
        'title': 'ZEBRONICS Zeb-S32A 32 Inch 4K UHD 60Hz Curved VA Panel 100% sRGB Professional Monitor',
        'handle': 'zebronics-zeb-s32a-32-inch-4k-uhd-curved-monitor',
        'vendor': 'Zebronics',
        'category': 'monitor',
        'product_type': 'Gaming Monitor',
        'price': 24999,
        'compare_at_price': 34999,
        'available': True,
        'sku': 'ZEB-S32A',
        'image': 'https://m.media-amazon.com/images/I/71tD2F4Z0xL._SX679_.jpg',
        'cdn_image': 'https://m.media-amazon.com/images/I/71tD2F4Z0xL._SX679_.jpg',
        'description': 'Ultra-sharp 32 Inch 4K UHD 3840x2160 Curved display, 10-bit color depth, 100% sRGB, Type-C 65W power delivery, HDMI 2.0, DisplayPort, and premium metal stand.',
        'tags': ['Zebronics', '4K Monitor', '32 Inch', 'Curved', 'Type-C'],
        'specs': {
            'vendor': 'Zebronics',
            'size': '32"',
            'refresh_rate': '60Hz',
            'resolution': '4K UHD',
            'panel_type': 'Curved VA',
            'in_stock': True
        }
    }
]

# Download images for monitors
mon_dir = os.path.join(PUBLIC_IMG_DIR, 'monitor')
os.makedirs(mon_dir, exist_ok=True)
for mon in zeb_monitors:
    img_name = f"{mon['id']}.jpg"
    l_path = os.path.join(mon_dir, img_name)
    if download_image(mon['cdn_image'], l_path):
        mon['image'] = f"/images/products/monitor/{img_name}"
    catalog['monitor'].append(mon)
    added_counts['monitor'] = added_counts.get('monitor', 0) + 1

print("\n=== ZEBRONICS INTEGRATION SUMMARY ===")
print("Added items by category:")
for cat, cnt in added_counts.items():
    print(f"  + {cat}: {cnt} items")

print("\nWriting to products.json...")
with open(PRODUCTS_JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

if os.path.exists(os.path.dirname(DIST_PRODUCTS_JSON_PATH)):
    with open(DIST_PRODUCTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

print("SUCCESS: products.json and dist/data/products.json updated successfully!")
