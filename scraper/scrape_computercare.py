import os
import sys
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
import re

from specs_extractor import (
    clean_html,
    extract_cpu_specs,
    extract_motherboard_specs,
    extract_gpu_specs,
    extract_ram_specs,
    extract_storage_specs,
    extract_psu_specs,
    extract_case_specs,
    extract_cooler_specs,
    extract_monitor_specs
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "client"))
PUBLIC_DATA_DIR = os.path.join(CLIENT_DIR, "public", "data")
PUBLIC_IMG_DIR = os.path.join(CLIENT_DIR, "public", "images", "products")

os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

CATEGORY_MAP = {
    "PC Cabinet": "case",
    "PC CAbinet": "case",
    "PC Case": "case",
    "Graphic Card": "gpu",
    "Motherboard": "motherboard",
    "Ram": "ram",
    "RAM": "ram",
    "SSD": "storage",
    "HDD": "storage",
    "Power Supply Unit": "psu",
    "Liquid Cooler": "cooler",
    "Air Cooler": "cooler",
    "PC Cooler": "cooler",
    "Processor": "cpu",
    "Gaming Monitor": "monitor",
    "monitor": "monitor",
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
        # print(f"Error downloading {url}: {e}")
        return False

def scrape_computercare(max_pages=20, max_images_per_cat=60):
    print("Starting Computer Care catalog scrape...")
    all_raw_products = []

    for page in range(1, max_pages + 1):
        url = f"https://computercare.in/products.json?limit=250&page={page}"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = json.loads(resp.read().decode())
                prods = data.get("products", [])
                if not prods:
                    break
                all_raw_products.extend(prods)
                print(f"Fetched page {page} - {len(prods)} products (Total: {len(all_raw_products)})")
                time.sleep(0.2)
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

    print(f"\nProcessing {len(all_raw_products)} raw products into PC Builder components...")
    
    categorized = {
        "case": [],
        "cpu": [],
        "motherboard": [],
        "gpu": [],
        "ram": [],
        "storage": [],
        "psu": [],
        "cooler": [],
        "monitor": [],
        "gaming_pc": []
    }

    image_download_tasks = []

    for p in all_raw_products:
        p_type = p.get("product_type", "")
        title = p.get("title", "")
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

        if price <= 0:
            continue

        # Determine category
        t_lower = title.lower()
        p_vendor = p.get("vendor", "")
        if "custom pc build" in t_lower or "pre-built" in t_lower or "gaming pc" in t_lower or p_vendor == "PC Build":
            cat = "gaming_pc"
        else:
            cat = CATEGORY_MAP.get(p_type)
            if not cat:
                # Fallback by title keywords
            if "geforce rtx" in t_lower or "radeon rx" in t_lower or "graphics card" in t_lower:
                cat = "gpu"
            elif "processor" in t_lower or "ryzen 7" in t_lower or "ryzen 5" in t_lower or "core i5" in t_lower or "core i7" in t_lower:
                cat = "cpu"
            elif "motherboard" in t_lower:
                cat = "motherboard"
            elif "cabinet" in t_lower or "chassis" in t_lower:
                cat = "case"
            elif "power supply" in t_lower or "smps" in t_lower:
                cat = "psu"
            elif "liquid cooler" in t_lower or "cpu cooler" in t_lower or "aio" in t_lower:
                cat = "cooler"
            elif "ddr4" in t_lower or "ddr5" in t_lower:
                cat = "ram"
            elif "nvme" in t_lower or "solid state drive" in t_lower or "internal ssd" in t_lower:
                cat = "storage"
            elif "monitor" in t_lower:
                cat = "monitor"

        if not cat or cat not in categorized:
            continue

        # Extract specifications based on category
        specs = {}
        if cat == "cpu":
            specs = extract_cpu_specs(title, tags, body)
        elif cat == "motherboard":
            specs = extract_motherboard_specs(title, tags, body)
        elif cat == "gpu":
            specs = extract_gpu_specs(title, tags, body)
        elif cat == "ram":
            specs = extract_ram_specs(title, tags, body)
        elif cat == "storage":
            specs = extract_storage_specs(title, tags, body)
        elif cat == "psu":
            specs = extract_psu_specs(title, tags, body)
        elif cat == "case":
            specs = extract_case_specs(title, tags, body)
        elif cat == "cooler":
            specs = extract_cooler_specs(title, tags, body)
        elif cat == "monitor":
            specs = extract_monitor_specs(title, tags, body)

        cat_img_dir = os.path.join(PUBLIC_IMG_DIR, cat)
        os.makedirs(cat_img_dir, exist_ok=True)

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
            local_filepath = os.path.join(cat_img_dir, local_filename)
            rel_path = f"/images/products/{cat}/{local_filename}"

            product_images.append(src)
            local_images.append(rel_path)

            image_download_tasks.append((src, local_filepath, cat))

        prod_item = {
            "id": p["id"],
            "title": title,
            "handle": p.get("handle", ""),
            "vendor": p.get("vendor", "Custom"),
            "category": cat,
            "product_type": p_type,
            "price": int(price),
            "compare_at_price": int(compare_price) if compare_price > 0 else int(price * 1.15),
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

        categorized[cat].append(prod_item)

    print("\nCategorized Components Count:")
    for c, items in categorized.items():
        print(f"  {c.upper()}: {len(items)} items")

    # Download images concurrently
    print(f"\nScheduling download of {len(image_download_tasks)} product images...")
    # Prioritize top products per category to keep download swift & robust
    prioritized_tasks = []
    cat_counts = {}
    for task in image_download_tasks:
        src, dest, cat = task
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
        if cat_counts[cat] <= max_images_per_cat * 4: # download up to 4 images for top products
            prioritized_tasks.append((src, dest))

    print(f"Downloading {len(prioritized_tasks)} prioritized images in parallel...")
    success_count = 0
    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(download_image, src, dest): (src, dest) for src, dest in prioritized_tasks}
        for f in as_completed(futures):
            if f.result():
                success_count += 1
            if success_count % 50 == 0:
                print(f"  Downloaded {success_count}/{len(prioritized_tasks)} images...")

    print(f"\nSuccessfully downloaded {success_count} product images locally!")

    # Save to public/data/products.json
    output_path = os.path.join(PUBLIC_DATA_DIR, "products.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(categorized, f, indent=2, ensure_ascii=False)
    print(f"Saved categorized catalog to {output_path}")

    # Also generate featured build presets
    generate_presets(categorized)

def generate_presets(cat):
    presets = [
        {
            "id": "starter-esports",
            "name": "Apex Esports Starter",
            "tier": "Budget 1080p Gaming",
            "target": "1080p Ultra 144+ FPS in CS2, Valorant, Fortnite, GTA V",
            "color_theme": "#06b6d4",
            "cabinet_color": "Black",
            "rgb_mode": "Cyberpunk Cyan",
            "components": {
                "case": cat["case"][0]["id"] if cat["case"] else None,
                "cpu": cat["cpu"][0]["id"] if cat["cpu"] else None,
                "motherboard": cat["motherboard"][0]["id"] if cat["motherboard"] else None,
                "gpu": cat["gpu"][0]["id"] if cat["gpu"] else None,
                "ram": cat["ram"][0]["id"] if cat["ram"] else None,
                "storage": cat["storage"][0]["id"] if cat["storage"] else None,
                "psu": cat["psu"][0]["id"] if cat["psu"] else None,
                "cooler": cat["cooler"][0]["id"] if cat["cooler"] else None,
            }
        },
        {
            "id": "pro-creator-gaming",
            "name": "Phantom Stealth Studio",
            "tier": "1440p High Performance",
            "target": "1440p High FPS, 4K Video Editing & Unreal Engine 5",
            "color_theme": "#a855f7",
            "cabinet_color": "White",
            "rgb_mode": "Neon Purple Pulse",
            "components": {
                "case": cat["case"][1]["id"] if len(cat["case"]) > 1 else None,
                "cpu": cat["cpu"][1]["id"] if len(cat["cpu"]) > 1 else None,
                "motherboard": cat["motherboard"][1]["id"] if len(cat["motherboard"]) > 1 else None,
                "gpu": cat["gpu"][1]["id"] if len(cat["gpu"]) > 1 else None,
                "ram": cat["ram"][1]["id"] if len(cat["ram"]) > 1 else None,
                "storage": cat["storage"][1]["id"] if len(cat["storage"]) > 1 else None,
                "psu": cat["psu"][1]["id"] if len(cat["psu"]) > 1 else None,
                "cooler": cat["cooler"][1]["id"] if len(cat["cooler"]) > 1 else None,
            }
        },
        {
            "id": "godlike-enthusiast",
            "name": "TITAN Hyperion Overkill",
            "tier": "Extreme 4K OLED Monster",
            "target": "4K Max Ray-Tracing, Local LLM AI Training & 240Hz 4K",
            "color_theme": "#ec4899",
            "cabinet_color": "Black",
            "rgb_mode": "Chroma RGB Wave",
            "components": {
                "case": cat["case"][2]["id"] if len(cat["case"]) > 2 else None,
                "cpu": cat["cpu"][2]["id"] if len(cat["cpu"]) > 2 else None,
                "motherboard": cat["motherboard"][2]["id"] if len(cat["motherboard"]) > 2 else None,
                "gpu": cat["gpu"][2]["id"] if len(cat["gpu"]) > 2 else None,
                "ram": cat["ram"][2]["id"] if len(cat["ram"]) > 2 else None,
                "storage": cat["storage"][2]["id"] if len(cat["storage"]) > 2 else None,
                "psu": cat["psu"][2]["id"] if len(cat["psu"]) > 2 else None,
                "cooler": cat["cooler"][2]["id"] if len(cat["cooler"]) > 2 else None,
            }
        }
    ]

    preset_path = os.path.join(PUBLIC_DATA_DIR, "presets.json")
    with open(preset_path, "w", encoding="utf-8") as f:
        json.dump(presets, f, indent=2)
    print(f"Saved build presets to {preset_path}")

if __name__ == "__main__":
    scrape_computercare(max_pages=15, max_images_per_cat=40)
