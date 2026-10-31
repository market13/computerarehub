import urllib.request
import json
import os
import re
import sys
import time
from urllib.parse import urlparse

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DATA_DIR = os.path.join(BASE_DIR, 'public', 'data')
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, 'public', 'images', 'products')
PRODUCTS_JSON_PATH = os.path.join(PUBLIC_DATA_DIR, 'products.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
}

CATEGORY_CONFIG = {
    'gaming_mouse': {
        'collections': ['gaming-mouse', 'antesports-gaming-mouse', 'logitech-mouse', 'asus-gaming-mouse', 'razer'],
        'filter_kw': ['mouse'],
        'img_subdir': 'mouse',
        'limit': 50
    },
    'gaming_keyboard': {
        'collections': ['gaming-keyboard', 'antesports-gaming-keyboard', 'logitech-keyboard', 'asus-gaming-keyboard', '60-keyboard'],
        'filter_kw': ['keyboard'],
        'img_subdir': 'keyboard',
        'limit': 50
    },
    'gaming_headset': {
        'collections': ['7-1-surround-sound-headphones', 'antesports-gaming-headphones', 'logitech-headphones', 'asus-gaming-headphones', 'claw-headphone'],
        'filter_kw': ['headphone', 'headset'],
        'img_subdir': 'headset',
        'limit': 50
    },
    'gaming_mousepad': {
        'collections': ['mousepad', 'medium-mousepads', 'large-mousepads', 'antesports-gaming-mousepad'],
        'filter_kw': ['mousepad', 'mouse pad', 'mat'],
        'img_subdir': 'mousepad',
        'limit': 40
    },
    'gaming_chair': {
        'collections': ['gaming-chair', 'cybeart-gaming-chair', 'corsair-gaming-chair', 'antesports-gaming-chair'],
        'filter_kw': ['chair'],
        'img_subdir': 'chair',
        'limit': 30
    },
    'gaming_controller': {
        'collections': ['gamepad', 'coolermaster-controllers', 'antesports-gamepad'],
        'filter_kw': ['controller', 'gamepad'],
        'img_subdir': 'controller',
        'limit': 30
    },
    'webcam': {
        'collections': ['computer-webcams', 'antesports-webcam', 'logitech-webcam', 'elgato-webcam'],
        'filter_kw': ['webcam', 'camera'],
        'img_subdir': 'webcam',
        'limit': 30
    },
    'microphone': {
        'collections': ['microphones', 'antesports-gaming-microphones', 'blue-yeti-microphone', 'logitech-microphone'],
        'filter_kw': ['microphone', 'mic'],
        'img_subdir': 'microphone',
        'limit': 30
    },
    'elgato': {
        'collections': ['elgato', 'elgato-capture-card', 'elgato-lights', 'elgato-streamdeck', 'elgato-teleprompter', 'elgato-green-screen', 'elgato-mounting'],
        'filter_kw': ['elgato'],
        'img_subdir': 'elgato',
        'limit': 40
    },
    'gaming_pc': {
        'collections': ['gaming-pc', 'aaa-gaming-pcs', 'casual-gaming-pcs', 'esports-gaming-pcs', 'streaming-pc', 'prebuilt-pc'],
        'filter_kw': ['pc', 'build', 'rig'],
        'img_subdir': 'gaming_pc',
        'limit': 50
    }
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

def scrape_category(cat_key, config):
    print(f"\n==========================================")
    print(f"SCRAPING CATEGORY: {cat_key.upper()}")
    print(f"==========================================")
    
    img_dir = os.path.join(PUBLIC_IMG_DIR, config['img_subdir'])
    os.makedirs(img_dir, exist_ok=True)
    
    seen_ids = set()
    products = []
    
    for coll in config['collections']:
        if len(products) >= config['limit']:
            break
        print(f"  Fetching collection: {coll} ...")
        for page in range(1, 4):
            if len(products) >= config['limit']:
                break
            url = f"https://elitehubs.com/collections/{coll}/products.json?limit=50&page={page}"
            try:
                req = urllib.request.Request(url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=10) as response:
                    data = json.loads(response.read().decode())
                    raw_prods = data.get('products', [])
                    if not raw_prods:
                        break
                    
                    for p in raw_prods:
                        pid = str(p.get('id', ''))
                        if pid in seen_ids:
                            continue
                        
                        title = p.get('title', '').strip()
                        title_lower = title.lower()
                        
                        # Verify title matches category
                        if not any(kw in title_lower for kw in config['filter_kw']):
                            # For elgato collection, title might not have 'elgato' if vendor is elgato
                            vendor = p.get('vendor', '').lower()
                            if cat_key == 'elgato' and 'elgato' in vendor:
                                pass
                            elif cat_key == 'gaming_pc' and ('custom pc' in title_lower or 'gaming pc' in title_lower or 'intel' in title_lower or 'ryzen' in title_lower):
                                pass
                            else:
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
                            
                        # Images
                        images = p.get('images', [])
                        cdn_image = images[0].get('src', '') if images else ''
                        if not cdn_image:
                            continue
                            
                        # Download image
                        img_filename = f"{config['img_subdir']}-{len(products)+1:04d}-{p.get('handle', 'item')[:30]}.jpg"
                        # sanitize filename
                        img_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', img_filename)
                        local_path = os.path.join(img_dir, img_filename)
                        rel_img_path = f"/images/products/{config['img_subdir']}/{img_filename}"
                        
                        downloaded = download_image(cdn_image, local_path)
                        final_image = rel_img_path if downloaded else cdn_image
                        
                        # Extract tags & specs
                        tags = p.get('tags', [])
                        vendor = p.get('vendor', '').strip()
                        
                        # Category-specific specs
                        specs = {
                            'vendor': vendor,
                            'in_stock': variant.get('available', True)
                        }
                        
                        if cat_key == 'gaming_mouse':
                            specs['wireless'] = 'wireless' in title_lower or 'bluetooth' in title_lower
                            specs['type'] = 'Wireless' if specs['wireless'] else 'Wired'
                            specs['rgb'] = 'rgb' in title_lower or 'argb' in title_lower
                        elif cat_key == 'gaming_keyboard':
                            specs['mechanical'] = 'mechanical' in title_lower or 'switch' in title_lower
                            specs['wireless'] = 'wireless' in title_lower or 'bluetooth' in title_lower
                            specs['layout'] = '60%' if '60%' in title_lower else 'TKL' if 'tkl' in title_lower else 'Full Size'
                        elif cat_key == 'gaming_pc':
                            specs['pc_tier'] = 'AAA Gaming' if 'aaa' in title_lower else 'Esports' if 'esports' in title_lower else 'Streaming' if 'stream' in title_lower else 'Casual Gaming'
                        elif cat_key == 'elgato':
                            specs['type'] = 'Stream Deck' if 'stream deck' in title_lower else 'Capture Card' if 'capture' in title_lower else 'Light' if 'light' in title_lower else 'Microphone' if 'wave' in title_lower else 'Gear'

                        prod_obj = {
                            'id': f"{cat_key}_{pid}",
                            'title': title,
                            'vendor': vendor,
                            'price': int(price),
                            'compare_at_price': int(compare_price) if compare_price > price else int(price * 1.15),
                            'category': cat_key,
                            'image': final_image,
                            'cdn_image': cdn_image,
                            'handle': p.get('handle', ''),
                            'url': f"https://elitehubs.com/products/{p.get('handle', '')}",
                            'description': clean_html(p.get('body_html', ''))[:200] + '...',
                            'tags': tags,
                            'specs': specs,
                            'in_stock': variant.get('available', True)
                        }
                        
                        seen_ids.add(pid)
                        products.append(prod_obj)
                        
                        if len(products) >= config['limit']:
                            break
            except Exception as e:
                print(f"    Error on {coll} page {page}: {e}")
            time.sleep(0.3)
            
    print(f"  [DONE] Total scraped for {cat_key}: {len(products)} products")
    return products

def main():
    print("Loading existing products.json...")
    with open(PRODUCTS_JSON_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)
        
    for cat_key, config in CATEGORY_CONFIG.items():
        prods = scrape_category(cat_key, config)
        catalog[cat_key] = prods
        print(f"  Added {len(prods)} to catalog['{cat_key}']")
        
    print("\nWriting updated catalog to products.json...")
    with open(PRODUCTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        
    # Also write to dist/data/products.json if it exists
    dist_path = os.path.join(BASE_DIR, 'dist', 'data', 'products.json')
    if os.path.exists(os.path.dirname(dist_path)):
        os.makedirs(os.path.dirname(dist_path), exist_ok=True)
        with open(dist_path, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
            
    print("ALL CATEGORIES SCRAPED AND SAVED SUCCESSFULLY!")
    print("Summary of counts:")
    for k, v in catalog.items():
        print(f"  - {k}: {len(v)} items")

if __name__ == '__main__':
    main()
