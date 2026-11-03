import urllib.request
import json

endpoints = {
    'gaming_mouse': ['gaming-mouse', 'antesports-gaming-mouse', 'asus-gaming-mouse', 'logitech-mouse'],
    'gaming_keyboard': ['gaming-keyboard', 'antesports-gaming-keyboard', 'asus-gaming-keyboard', 'logitech-keyboard', '60-keyboard'],
    'gaming_headset': ['7-1-surround-sound-headphones', 'antesports-gaming-headphones', 'logitech-headphones', 'asus-gaming-headphones'],
    'gaming_mousepad': ['mousepad', 'medium-mousepads', 'large-mousepads', 'antesports-gaming-mousepad'],
    'gaming_chair': ['gaming-chair', 'cybeart-gaming-chair', 'corsair-gaming-chair', 'antesports-gaming-chair'],
    'gaming_controller': ['gamepad', 'coolermaster-controllers', 'antesports-gamepad'],
    'webcam': ['computer-webcams', 'antesports-webcam', 'logitech-webcam', 'elgato-webcam'],
    'microphone': ['microphones', 'antesports-gaming-microphones', 'blue-yeti-microphone', 'logitech-microphone'],
    'elgato': ['elgato', 'elgato-capture-card', 'elgato-lights', 'elgato-streamdeck', 'elgato-teleprompter', 'elgato-green-screen', 'elgato-mounting'],
    'gaming_pc': ['gaming-pc', 'aaa-gaming-pcs', 'casual-gaming-pcs', 'esports-gaming-pcs', 'streaming-pc']
}

for cat, handles in endpoints.items():
    total = 0
    sample_title = ""
    for h in handles:
        url = f'https://computercare.in/collections/{h}/products.json?limit=20'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                data = json.loads(res.read().decode())
                prods = data.get('products', [])
                total += len(prods)
                if not sample_title and prods:
                    sample_title = prods[0]['title']
        except Exception as e:
            pass
    print(f"[{cat}]: {total} products found. Sample: {sample_title}")
