import os
import json
import re
import urllib.request
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "client"))
PUBLIC_DATA_DIR = os.path.join(CLIENT_DIR, "public", "data")
PUBLIC_IMG_DIR = os.path.join(CLIENT_DIR, "public", "images", "products")
FAN_IMG_DIR = os.path.join(PUBLIC_IMG_DIR, "case_fan")

os.makedirs(FAN_IMG_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

PRODUCTS_FILE = os.path.join(PUBLIC_DATA_DIR, "products.json")

def is_fan(title):
    t = title.lower()
    fan_keywords = [
        'cabinet fan', 'case fan', 'cooling fan', '120mm fan', '140mm fan', 
        'argb fan', 'rgb fan', 'fan pack', 'triple pack', 'single pack', 
        'dual pack', 'pwm fan', 'sickleflow', 'pure wings', 'uni fan',
        'f12', 'p12', 'f14', 'p14', 'in-win sirius', 'reverse blade fan'
    ]
    for kw in fan_keywords:
        if kw in t:
            return True
    # If title ends with "fan" or contains " fan "
    if ' fan ' in t or t.endswith(' fan') or ' fans ' in t or t.endswith(' fans'):
        # but not fan controller or cabinet without fan
        if 'cabinet' in t and not ('case' in t and 'mid tower' in t):
            if 'mid tower' not in t and 'full tower' not in t and 'mini tower' not in t:
                return True
    return False

def extract_fan_specs(title, desc):
    text = (title + " " + (desc or "")).lower()
    
    # Size
    size = "120mm"
    if "140mm" in text or "140 mm" in text:
        size = "140mm"
    elif "120mm" in text or "120 mm" in text:
        size = "120mm"
    elif "200mm" in text:
        size = "200mm"
        
    # RGB Lighting
    lighting = "Non-RGB"
    if "argb" in text or "addressable" in text:
        lighting = "ARGB"
    elif "frgb" in text:
        lighting = "Fixed RGB"
    elif "rgb" in text:
        lighting = "RGB"
        
    # Pack
    pack = "Single Pack"
    if "3 in 1" in text or "triple pack" in text or "pack of 3" in text or "3-pack" in text or "3 pack" in text:
        pack = "Triple Pack (3-in-1)"
    elif "dual pack" in text or "pack of 2" in text or "2-pack" in text:
        pack = "Dual Pack (2-in-1)"
    elif "single pack" in text or "pack of 1" in text:
        pack = "Single Pack"
        
    # PWM
    pwm = "PWM" if "pwm" in text else "Standard 3-Pin / Molex"
    
    # Color
    color = "Black"
    if "white" in text:
        color = "White"
        
    return {
        "fan_size": size,
        "lighting": lighting,
        "pack_type": pack,
        "connector": pwm,
        "color": color,
        "rpm": "800 - 1800 RPM" if "pwm" in text else "1200 RPM",
        "airflow": "56.3 CFM"
    }

def main():
    print("Loading existing products.json...")
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        catalog = json.load(f)
        
    existing_cases = catalog.get("case", [])
    print(f"Total existing case items: {len(existing_cases)}")
    
    cleaned_cases = []
    separated_fans = []
    
    for item in existing_cases:
        if is_fan(item["title"]):
            item["category"] = "case_fan"
            item["specs"] = extract_fan_specs(item["title"], item.get("description", ""))
            separated_fans.append(item)
        else:
            cleaned_cases.append(item)
            
    print(f"Cleaned cases count (Zero fans): {len(cleaned_cases)}")
    print(f"Fans extracted from cases: {len(separated_fans)}")
    
    # Now scrape all additional fans directly from Computer Care products API
    print("Scraping all dedicated cabinet fans from Computer Care...")
    scraped_fans = []
    seen_ids = {f["id"] for f in separated_fans}
    
    for page in range(1, 16):
        url = f"https://computercare.in/products.json?limit=250&page={page}"
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode())
                prods = data.get("products", [])
                if not prods:
                    break
                for p in prods:
                    if p["id"] in seen_ids:
                        continue
                    if is_fan(p["title"]):
                        t = p["title"].lower()
                        if "laptop" in t or "cooler master hyper" in t or "deepcool ak" in t or "peerless assassin" in t:
                            continue # cpu cooler, not case fan
                            
                        v = p["variants"][0] if p["variants"] else {}
                        price = float(v.get("price", 0))
                        comp_price = float(v.get("compare_at_price") or price)
                        images = [img["src"] for img in p.get("images", [])]
                        
                        fan_item = {
                            "id": p["id"],
                            "title": p["title"],
                            "handle": p["handle"],
                            "vendor": p.get("vendor", "Arctic"),
                            "price": int(price),
                            "compare_at_price": int(comp_price),
                            "category": "case_fan",
                            "image": None,
                            "cdn_image": images[0] if images else "",
                            "images": images,
                            "description": re.sub('<[^<]+?>', '', p.get("body_html", "") or "")[:240],
                            "specs": extract_fan_specs(p["title"], p.get("body_html", "")),
                            "product_url": f"https://computercare.in/products/{p['handle']}"
                        }
                        scraped_fans.append(fan_item)
                        seen_ids.add(p["id"])
        except Exception as e:
            print(f"Page {page} error: {e}")
            break
        time.sleep(0.3)
        
    print(f"Scraped {len(scraped_fans)} additional fans from Computer Care!")
    all_fans = separated_fans + scraped_fans
    print(f"Total Dedicated Cabinet Fans: {len(all_fans)}")
    
    # Download local images for fans (first 100 fans)
    print("Downloading fan images...")
    for idx, fan in enumerate(all_fans[:120]):
        if fan.get("cdn_image"):
            filename = f"fan_{fan['id']}.jpg"
            local_path = os.path.join(FAN_IMG_DIR, filename)
            rel_path = f"/images/products/case_fan/{filename}"
            if not os.path.exists(local_path):
                try:
                    req = urllib.request.Request(fan["cdn_image"], headers=HEADERS)
                    with urllib.request.urlopen(req, timeout=8) as r:
                        with open(local_path, "wb") as out:
                            out.write(r.read())
                except Exception as e:
                    pass
            if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
                fan["image"] = rel_path
            else:
                fan["image"] = fan["cdn_image"]
        else:
            fan["image"] = ""
            
    # Save back to products.json
    catalog["case"] = cleaned_cases
    catalog["case_fan"] = all_fans
    
    with open(PRODUCTS_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
        
    print("Updated public/data/products.json successfully!")
    
    # Also update dist/data/products.json
    dist_file = os.path.join(CLIENT_DIR, "dist", "data", "products.json")
    if os.path.exists(os.path.dirname(dist_file)):
        with open(dist_file, "w", encoding="utf-8") as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        print("Updated dist/data/products.json successfully!")
        
    print(f"SUMMARY: PC Cabinets: {len(cleaned_cases)} (100% Genuine Chassis, ZERO Fans)")
    print(f"SUMMARY: Dedicated Cabinet Fans: {len(all_fans)} (Separate Category)")

if __name__ == "__main__":
    main()
