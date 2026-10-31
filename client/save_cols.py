import urllib.request
import json

url = 'https://elitehubs.com/collections.json?limit=250'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as res:
    data = json.loads(res.read().decode())
    collections = data.get('collections', [])
    with open('C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/collections.txt', 'w', encoding='utf-8') as f:
        for c in collections:
            f.write(f"{c.get('handle')}: {c.get('title')}\n")
    print(f"Saved {len(collections)} collections.")
