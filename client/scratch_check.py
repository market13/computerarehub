import urllib.request
import json

collections = [
    'gaming-mouse', 'mouse', 'gaming-keyboard', 'keyboard', 
    'gaming-headphones', 'headphones', 'mousepad', 'gaming-mousepad',
    'gaming-chair', 'gaming-controllers', 'controller', 'controllers',
    'webcam', 'microphone', 'microphones', 'elgato', 'prebuilt-pc', 'gaming-pc'
]

for c in collections:
    url = f'https://computercare.in/collections/{c}/products.json?limit=5'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            data = json.loads(res.read().decode())
            prods = data.get('products', [])
            print(f'YES {c}: {len(prods)} products found. Sample: {prods[0]["title"] if prods else "none"}')
    except Exception as e:
        print(f'NO {c}: {e}')
