import urllib.request
import json

all_cols = []
for page in range(1, 10):
    url = f'https://elitehubs.com/collections.json?limit=250&page={page}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode())
            cols = data.get('collections', [])
            if not cols:
                break
            all_cols.extend(cols)
    except Exception as e:
        break

print(f"Total collections found: {len(all_cols)}")
with open('C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/all_collections.txt', 'w', encoding='utf-8') as f:
    for c in all_cols:
        f.write(f"{c.get('handle')}: {c.get('title')}\n")
