import os
import sys
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "client"))
PUBLIC_DATA_DIR = os.path.join(CLIENT_DIR, "public", "data")
PUBLIC_IMG_DIR = os.path.join(CLIENT_DIR, "public", "images", "products")
CASE_IMG_DIR = os.path.join(PUBLIC_IMG_DIR, "case")

os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)
os.makedirs(CASE_IMG_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r'<[^<]+?>', ' ', raw_html)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def is_actual_cabinet(title, p_type, tags):
    t_lower = title.lower()
    # Exclude fans, brackets, cables, accessories
    negative_terms = [
        "fan", "fans", "fan kit", "fan pack", "single pack", "triple pack",
        "riser cable", "gpu bracket", "holder", "led strip", "light bar",
        "dust filter", "front panel only", "controller", "hub", "vertical mount"
    ]
    for term in negative_terms:
        # Check whole word match or distinct phrase
        if re.search(r'\b' + re.escape(term) + r'\b', t_lower):
            # Special case: some cabinets say "with 4 ARGB Fans" or "4x Fans Included"
            if "with " + term in t_lower or "pre-installed " + term in t_lower or "included" in t_lower or "4f" in t_lower:
                continue
            return False

    # Check positive indicators for cabinets
    positive_terms = ["cabinet", "case", "chassis", "tower", "mid tower", "mini tower", "full tower", "mini-itx"]
    has_positive = any(term in t_lower for term in positive_terms) or p_type.lower() in ["pc cabinet", "pc case"]

    return has_positive

def classify_cabinet_type(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()

    # Form factor
    form_factor = "Mid Tower"
    if "full tower" in text or "xl" in text or "7000" in text or "780" in text or "huge" in text:
        form_factor = "Full Tower"
    elif "mini tower" in text or "matx" in text or "micro atx" in text or "200 air" in text or "2500d" in text:
        form_factor = "Micro-ATX Mini Tower"
    elif "mini-itx" in text or "itx" in text or "sff" in text or "nr200" in text or "a4-h2o" in text:
        form_factor = "Mini-ITX SFF"

    # Style / Architecture
    cabinet_style = "High-Airflow Mesh"
    if "o11" in text or "panoramic" in text or "dual chamber" in text or "vision" in text or "crystal" in text or "king 95" in text or "y60" in text or "y70" in text or "ch780" in text or "view" in text:
        cabinet_style = "Panoramic Dual-Chamber Glass"
    elif "mesh" in text or "airflow" in text or "air" in text or "4000d" in text or "5000d" in text or "lancool" in text or "td500" in text:
        cabinet_style = "High-Airflow Mesh"
    elif "silent" in text or "define" in text or "solid" in text:
        cabinet_style = "Silent Workstation"
    elif "rgb" in text or "argb" in text or "tg" in text:
        cabinet_style = "Showcase Tempered Glass"

    # Color
    color = "Black"
    if "white" in text:
        color = "White"
    elif "pink" in text:
        color = "Pink"
    elif "grey" in text or "gray" in text or "gunmetal" in text:
        color = "Gunmetal Grey"

    # Supported motherboards
    mb_support = ["ATX", "Micro-ATX", "Mini-ITX"]
    if "eatx" in text or "e-atx" in text or form_factor == "Full Tower":
        mb_support = ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"]
    elif form_factor == "Micro-ATX Mini Tower":
        mb_support = ["Micro-ATX", "Mini-ITX"]
    elif form_factor == "Mini-ITX SFF":
        mb_support = ["Mini-ITX"]

    max_gpu = 420 if form_factor == "Full Tower" else (390 if "o11" in text or "mesh" in text else 340)

    return {
        "form_factor": form_factor,
        "cabinet_style": cabinet_style,
        "color": color,
        "supported_motherboards": mb_support,
        "max_gpu_length": max_gpu,
        "side_panel": "Panoramic Glass" if "glass" in cabinet_style.lower() else "Tempered Glass",
        "included_fans": "ARGB Fans Included" if ("argb" in text or "rgb" in text or "4f" in text or "3f" in text) else "Airflow Fans"
    }

def download_image(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(target_path, "wb") as f:
                f.write(data)
        return True
    except Exception as e:
        return False

def scrape_genuine_cabinets():
    print("Scraping genuine PC Cabinets from Computer Care...")
    all_raw_cabinets = []

    # Fetch pages of pc-cabinet collection
    for page in range(1, 8):
        url = f"https://computercare.in/collections/pc-cabinet/products.json?limit=250&page={page}"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                prods = data.get("products", [])
                if not prods:
                    break
                all_raw_cabinets.extend(prods)
                print(f"  Page {page}: {len(prods)} items (Total: {len(all_raw_cabinets)})")
                time.sleep(0.2)
        except Exception as e:
            print(f"Error on page {page}: {e}")
            break

    print(f"\nFiltering genuine PC Cabinets out of {len(all_raw_cabinets)} items...")
    genuine_cabinets = []
    download_tasks = []

    for p in all_raw_cabinets:
        title = p.get("title", "")
        p_type = p.get("product_type", "")
        tags = p.get("tags", [])
        body = clean_html(p.get("body_html", ""))
        variants = p.get("variants", [])
        images = p.get("images", [])

        if not variants or not images:
            continue

        var0 = variants[0]
        try:
            price = float(var0.get("price", 0))
            compare_price = float(var0.get("compare_at_price") or 0)
        except:
            continue

        # Real PC cabinets in India generally cost ₹2,200+ (Fans are under ₹2,000)
        if price < 2200:
            continue

        if not is_actual_cabinet(title, p_type, tags):
            continue

        specs = classify_cabinet_type(title, tags, body)

        # Process image links
        product_images = []
        local_images = []
        for idx, img in enumerate(images[:4]):
            src = img.get("src", "")
            if not src:
                continue
            ext = ".jpg"
            if ".png" in src.lower():
                ext = ".png"
            elif ".webp" in src.lower():
                ext = ".webp"

            clean_handle = re.sub(r'[^a-zA-Z0-9_\-]', '', p.get("handle", str(p["id"])))[:50]
            local_filename = f"{p['id']}_{idx}_{clean_handle}{ext}"
            local_filepath = os.path.join(CASE_IMG_DIR, local_filename)
            rel_path = f"/images/products/case/{local_filename}"

            product_images.append(src)
            local_images.append(rel_path)
            download_tasks.append((src, local_filepath))

        item = {
            "id": p["id"],
            "title": title,
            "handle": p.get("handle", ""),
            "vendor": p.get("vendor", "Custom"),
            "category": "case",
            "product_type": "PC Cabinet",
            "price": int(price),
            "compare_at_price": int(compare_price) if compare_price > 0 else int(price * 1.2),
            "available": var0.get("available", True),
            "sku": var0.get("sku", ""),
            "image": local_images[0] if local_images else (product_images[0] if product_images else ""),
            "cdn_image": product_images[0] if product_images else "",
            "images": local_images,
            "cdn_images": product_images,
            "specs": specs,
            "description": body[:500] if body else title,
            "url": f"https://computercare.in/products/{p.get('handle', '')}"
        }
        genuine_cabinets.append(item)

    print(f"\nFound {len(genuine_cabinets)} GENUINE PC Cabinets!")
    # Show breakdown by style
    styles = {}
    for c in genuine_cabinets:
        st = c["specs"]["cabinet_style"]
        styles[st] = styles.get(st, 0) + 1
    print("Cabinets by style:")
    for s, count in styles.items():
        print(f"  - {s}: {count}")

    # Download images concurrently
    print(f"\nDownloading images for genuine cabinets ({len(download_tasks)} images)...")
    success = 0
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(download_image, src, dest): (src, dest) for src, dest in download_tasks}
        for f in as_completed(futures):
            if f.result():
                success += 1
            if success % 50 == 0:
                print(f"  Downloaded {success}/{len(download_tasks)} images...")
    print(f"Downloaded {success} cabinet images successfully!")

    # Update products.json
    prod_path = os.path.join(PUBLIC_DATA_DIR, "products.json")
    with open(prod_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    catalog["case"] = genuine_cabinets
    with open(prod_path, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print(f"Updated {prod_path} with {len(genuine_cabinets)} real PC Cabinets!")

if __name__ == "__main__":
    scrape_genuine_cabinets()
