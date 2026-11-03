import urllib.request
import json

url = 'https://computercare.in/collections.json?limit=250'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as res:
        data = json.loads(res.read().decode())
        collections = data.get('collections', [])
        print(f"Total collections: {len(collections)}")
        for col in collections:
            handle = col.get('handle', '')
            title = col.get('title', '')
            for kw in ['head', 'audio', 'cam', 'mic', 'pad', 'chair', 'game', 'stream', 'pc', 'mouse', 'keyboard']:
                if kw in handle.lower() or kw in title.lower():
                    print(f"  {handle} -> {title}")
                    break
except Exception as e:
    print("Error:", e)
