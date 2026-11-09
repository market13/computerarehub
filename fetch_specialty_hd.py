import urllib.request, json

headers = {'User-Agent': 'Mozilla/5.0'}

targets = [
    ('gamedev', 'game-development-pcs'),
    ('gamedev_legacy', 'legacyx-game-development-pc'),
    ('aiml', 'ai-deep-learning-pcs'),
    ('aiml_dev', 'ai-development-pc'),
    ('rendering', 'blender-rendering-pcs'),
    ('rendering_nerox', 'nerox-rendering-pc'),
    ('streaming', 'desktop-streaming-pc'),
    ('streaming_avianx', 'avianx-streaming-pc'),
    ('editing', 'artisanx-editing-pc'),
    ('editing_adobe', 'adobe-editing-pcs')
]

for label, handle in targets:
    url = f'https://elitehubs.com/collections/{handle}/products.json?limit=5'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            prods = data.get('products', [])
            print(f'=== {label} ({handle}) : {len(prods)} prods ===')
            for p in prods[:3]:
                print(f"  Title: {p['title']}")
                for img in p.get('images', [])[:2]:
                    print(f"    Img: {img.get('src')}")
    except Exception as e:
        print(f'{label} err: {e}')
