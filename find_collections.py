import urllib.request, json

headers = {'User-Agent': 'Mozilla/5.0'}
all_colls = []
for page in range(1, 10):
    url = f'https://elitehubs.com/collections.json?limit=250&page={page}'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            colls = data.get('collections', [])
            if not colls:
                break
            all_colls.extend(colls)
    except Exception as e:
        print(f'Error page {page}: {e}')
        break

print(f'Total collections across pages: {len(all_colls)}')
for c in all_colls:
    h = c['handle'].lower()
    t = c['title'].lower()
    if any(k in h or k in t for k in ['game', 'render', 'stream', 'edit', 'aiml', 'ai', 'special', 'custom-pc', 'pre-built']):
        print(f"{c['handle']}: {c['title']}")
