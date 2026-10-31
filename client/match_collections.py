with open('C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/all_collections.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip()]

menu_items = [
    'Wired Gaming Mouse', 'Wireless Gaming Mouse', 'Razer Gaming Mouse', 'Logitech Gaming Mouse',
    'HyperX Gaming Mouse', 'Redragon Gaming Mouse', 'CORSAIR Gaming Mouse', 'Ant Esports Gaming Mouse',
    'CosmicByte Gaming Mouse',
    'Wired Gaming Keyboard', 'Wireless Gaming Keyboard', 'Razer Gaming Keyboard', 'Logitech Gaming Keyboard',
    'HyperX Gaming Keyboard', 'Redragon Gaming Keyboard', 'CORSAIR Gaming Keyboard', 'Ant Esports Gaming Keyboard',
    'CosmicByte Gaming Keyboard',
    'Wired Gaming Headphones', 'Wireless Gaming Headphones', 'Razer Gaming Headphones', 'Logitech Gaming Headphones',
    'HyperX Gaming Headphones', 'Redragon Gaming Headphones', 'CORSAIR Gaming Headphones', 'Ant Esports Gaming Headphones',
    'CosmicByte Gaming Headphones',
    'Popular : Medium Mousepad', 'Popular : Large Mousepad', 'Razer Gaming Mousepad', 'Logitech Gaming Mousepad',
    'HyperX Gaming Mousepad', 'Redragon Gaming Mousepad', 'CORSAIR Gaming Mousepad', 'Ant Esports Gaming Mousepad',
    'CosmicByte Gaming Mousepad',
    'AAA Gaming PC', 'Casual Gaming PC', 'Esports Gaming PC',
    'Ant Esports Gaming Chair', 'Cooler Master Gaming Chair', 'Cybeart Gaming Chair', 'CORSAIR Gaming Chair',
    'Wired Controllers', 'Wireless Controllers', 'Cosmic Byte Controllers', 'Ant Esports Controllers', 'Claw Controllers',
    'Logitech Webcam', 'Razer Webcam', 'Redragon Webcam', 'Elgato Webcam',
    'HyperX Microphones', 'Logitech Microphone', 'Razer Microphone', 'Blue Yeti Microphone', 'Ant Esports Microphone',
    'Elgato Capture Card', 'Elgato Streamdeck', 'Elgato Lights', 'Elgato Teleprompter', 'Elgato Green Screen', 'Elgato Mounting'
]

for item in menu_items:
    clean = item.lower().replace('popular : ', '').replace('gaming ', '').replace(' ', '-')
    matches = [l for l in lines if any(k in l.lower() for k in item.lower().split() if len(k) > 3)]
    best = [l for l in lines if item.lower().replace('popular : ', '') in l.lower()]
    print(f"{item} => {best[:2] if best else matches[:1]}")
