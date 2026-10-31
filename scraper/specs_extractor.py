import os
import json
import re
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_DIR = os.path.join(BASE_DIR, "..", "client")
PUBLIC_DATA_DIR = os.path.join(CLIENT_DIR, "public", "data")
PUBLIC_IMG_DIR = os.path.join(CLIENT_DIR, "public", "images", "products")

os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r'<[^<]+?>', ' ', raw_html)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def extract_cpu_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    socket = "Unknown"
    if "lga 1700" in text or "lga1700" in text or "12th gen" in text or "13th gen" in text or "14th gen" in text:
        socket = "LGA1700"
    elif "am5" in text or "ryzen 7000" in text or "ryzen 8000" in text or "ryzen 9000" in text or "7800x3d" in text or "7950x" in text or "7600" in text:
        socket = "AM5"
    elif "am4" in text or "ryzen 5000" in text or "ryzen 3000" in text or "5600" in text or "5800x3d" in text or "5700x" in text:
        socket = "AM4"
    elif "lga 1851" in text or "lga1851" in text or "core ultra" in text:
        socket = "LGA1851"
    elif "lga 1200" in text or "lga1200" in text or "10th gen" in text or "11th gen" in text:
        socket = "LGA1200"

    cores = 6
    m_cores = re.search(r'(\d+)\s*(?:cores|core)', text)
    if m_cores:
        cores = int(m_cores.group(1))
    elif "i9" in text or "ryzen 9" in text:
        cores = 16
    elif "i7" in text or "ryzen 7" in text:
        cores = 8
    elif "i5" in text or "ryzen 5" in text:
        cores = 6
    elif "i3" in text or "ryzen 3" in text:
        cores = 4

    tdp = 65
    if "x3d" in text or "14900" in text or "13900" in text or "14700" in text:
        tdp = 125
    elif "k" in title.lower() or "kf" in title.lower():
        tdp = 125

    has_igpu = True
    if " f " in title.lower() or title.lower().endswith("f") or " kf " in title.lower():
        has_igpu = False

    return {
        "socket": socket,
        "cores": cores,
        "threads": cores * 2 if "intel" not in text or "hyper" in text else cores * 2,
        "tdp": tdp,
        "has_igpu": has_igpu
    }

def extract_motherboard_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    socket = "Unknown"
    if "z790" in text or "b760" in text or "h610" in text or "z690" in text or "b660" in text or "lga1700" in text or "lga 1700" in text:
        socket = "LGA1700"
    elif "x670" in text or "b650" in text or "a620" in text or "am5" in text:
        socket = "AM5"
    elif "b550" in text or "b450" in text or "a520" in text or "x570" in text or "am4" in text:
        socket = "AM4"
    elif "z890" in text or "b860" in text or "lga1851" in text:
        socket = "LGA1851"

    form_factor = "ATX"
    if "mini-itx" in text or "itx" in text or "mini itx" in text:
        form_factor = "Mini-ITX"
    elif "m-atx" in text or "matx" in text or "micro atx" in text or "micro-atx" in text or "-m" in title.lower():
        form_factor = "Micro-ATX"
    elif "e-atx" in text or "eatx" in text:
        form_factor = "E-ATX"

    ram_type = "DDR5"
    if "ddr4" in text:
        ram_type = "DDR4"
    elif "ddr5" in text:
        ram_type = "DDR5"
    elif socket == "AM4":
        ram_type = "DDR4"
    elif socket == "AM5":
        ram_type = "DDR5"

    has_wifi = "wifi" in text or "wi-fi" in text

    return {
        "socket": socket,
        "form_factor": form_factor,
        "ram_type": ram_type,
        "ram_slots": 2 if form_factor == "Mini-ITX" else 4,
        "has_wifi": has_wifi
    }

def extract_gpu_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    vram = "8GB"
    m_vram = re.search(r'(\d+)\s*gb', text)
    if m_vram:
        vram = f"{m_vram.group(1)}GB"

    tdp = 200
    if "4090" in text:
        tdp = 450
    elif "4080" in text or "7900 xtx" in text:
        tdp = 320
    elif "4070 ti" in text or "7900 xt" in text:
        tdp = 285
    elif "4070" in text or "7800 xt" in text:
        tdp = 220
    elif "4060 ti" in text or "7700 xt" in text:
        tdp = 165
    elif "4060" in text or "7600" in text:
        tdp = 115
    elif "3060" in text or "6600" in text:
        tdp = 170

    length_mm = 280
    if "3 fan" in text or "triple fan" in text or "tuf" in text or "rog" in text or "aorus" in text or "4090" in text or "4080" in text:
        length_mm = 320
    elif "dual" in text or "twin" in text or "2 fan" in text:
        length_mm = 245
    elif "itx" in text or "single fan" in text:
        length_mm = 170

    return {
        "vram": vram,
        "tdp": tdp,
        "recommended_psu": tdp + 350,
        "length_mm": length_mm
    }

def extract_ram_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    ram_type = "DDR5" if "ddr5" in text else "DDR4"
    
    speed = 3200 if ram_type == "DDR4" else 6000
    m_speed = re.search(r'(\d{4})\s*mhz', text)
    if m_speed:
        speed = int(m_speed.group(1))

    capacity = 16
    m_cap = re.search(r'(\d+)\s*gb', text)
    if m_cap:
        capacity = int(m_cap.group(1))

    is_rgb = "rgb" in text or "argb" in text

    return {
        "ram_type": ram_type,
        "speed": f"{speed}MHz",
        "capacity_gb": capacity,
        "is_rgb": is_rgb
    }

def extract_storage_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    stype = "NVMe SSD"
    if "hdd" in text or "hard drive" in text or "barracuda" in text:
        stype = "HDD"
    elif "sata" in text or "2.5 inch" in text or "2.5\"" in text:
        stype = "SATA SSD"
    elif "m.2" in text or "nvme" in text or "gen4" in text or "gen3" in text or "gen5" in text:
        stype = "NVMe M.2 SSD"

    capacity = "1TB"
    m_cap = re.search(r'(\d+)\s*(tb|gb)', text)
    if m_cap:
        capacity = f"{m_cap.group(1)}{m_cap.group(2).upper()}"

    read_speed = "3500 MB/s"
    if "gen5" in text:
        read_speed = "10,000+ MB/s"
    elif "gen4" in text or "7000" in text or "7400" in text or "sn850" in text or "980 pro" in text or "990 pro" in text:
        read_speed = "7000+ MB/s"
    elif stype == "HDD":
        read_speed = "180 MB/s"
    elif stype == "SATA SSD":
        read_speed = "550 MB/s"

    return {
        "storage_type": stype,
        "capacity": capacity,
        "read_speed": read_speed
    }

def extract_psu_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    wattage = 650
    m_w = re.search(r'(\d{3,4})\s*w', text)
    if m_w:
        wattage = int(m_w.group(1))

    efficiency = "80 Plus Bronze"
    if "titanium" in text:
        efficiency = "80 Plus Titanium"
    elif "platinum" in text:
        efficiency = "80 Plus Platinum"
    elif "gold" in text:
        efficiency = "80 Plus Gold"
    elif "bronze" in text:
        efficiency = "80 Plus Bronze"

    modular = "Non-Modular"
    if "fully modular" in text or "full modular" in text or "gold" in efficiency or "platinum" in efficiency:
        modular = "Full Modular"
    elif "semi-modular" in text or "semi modular" in text:
        modular = "Semi-Modular"

    return {
        "wattage": wattage,
        "efficiency": efficiency,
        "modular": modular
    }

def extract_case_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    form_factors = ["ATX", "Micro-ATX", "Mini-ITX"]
    if "mini-itx" in text and "atx" not in text:
        form_factors = ["Mini-ITX"]
    elif "matx" in text or "micro atx" in text:
        form_factors = ["Micro-ATX", "Mini-ITX"]

    color = "Black"
    if "white" in text:
        color = "White"

    rgb = "rgb" in text or "argb" in text
    has_glass = "tempered glass" in text or "tg" in text or "glass" in text

    # 3D cabinet style mapping
    style = "panoramic_glass" if ("o11" in text or "panoramic" in text or "dual chamber" in text or "vision" in text) else "mesh_airflow"

    return {
        "supported_motherboards": form_factors,
        "color": color,
        "rgb_fans": rgb,
        "side_panel": "Tempered Glass" if has_glass else "Mesh",
        "max_gpu_length": 380 if "full" in text or "mid" in text else 330,
        "max_cooler_height": 170,
        "cabinet_style": style
    }

def extract_cooler_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    ctype = "Air Cooler"
    radiator_size = None
    if "360" in text:
        ctype = "Liquid AIO 360mm"
        radiator_size = 360
    elif "240" in text:
        ctype = "Liquid AIO 240mm"
        radiator_size = 240
    elif "280" in text:
        ctype = "Liquid AIO 280mm"
        radiator_size = 280
    elif "liquid" in text or "aio" in text:
        ctype = "Liquid AIO"
        radiator_size = 240

    is_rgb = "rgb" in text or "argb" in text

    return {
        "cooler_type": ctype,
        "radiator_size": radiator_size,
        "is_rgb": is_rgb,
        "tdp_rating": 250 if radiator_size == 360 else (200 if radiator_size == 240 else 180)
    }

def extract_monitor_specs(title, tags, body):
    text = (title + " " + " ".join(tags) + " " + body).lower()
    size = "27 Inch"
    m_size = re.search(r'(\d{2}(?:\.\d)?)\s*(?:inch|\"|\-inch)', text)
    if m_size:
        size = f"{m_size.group(1)}\""

    refresh_rate = "144Hz"
    m_hz = re.search(r'(\d{2,3})\s*hz', text)
    if m_hz:
        refresh_rate = f"{m_hz.group(1)}Hz"

    res = "1080p FHD"
    if "4k" in text or "3840x2160" in text or "uhd" in text:
        res = "4K UHD"
    elif "1440p" in text or "qhd" in text or "2k" in text or "2560x1440" in text:
        res = "1440p QHD"

    panel = "IPS"
    if "oled" in text:
        panel = "OLED"
    elif "va" in text:
        panel = "VA"

    return {
        "size": size,
        "refresh_rate": refresh_rate,
        "resolution": res,
        "panel_type": panel
    }
