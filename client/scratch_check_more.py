import urllib.request
import json

possible = [
    'headphone', 'headset', 'gaming-headset', 'gaming-headsets', 'audio',
    'gamepad', 'controller', 'gamepads', 'gaming-gamepad', 'gaming-accessories',
    'webcam', 'webcams', 'cameras', 'streaming-devices', 'streaming',
    'gaming-pc', 'prebuilt-pc', 'custom-pc', 'streaming-pc', 'workstation-pc',
    'esports-pc', 'aaa-gaming-pc', 'casual-gaming-pc'
]

for c in possible:
    url = f'https://computercare.in/collections/{c}/products.json?limit=5'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            data = json.loads(res.read().decode())
            prods = data.get('products', [])
            if len(prods) > 0:
                print(f'FOUND: {c} ({len(prods)} products) -> {prods[0]["title"]}')
    except Exception as e:
        pass
