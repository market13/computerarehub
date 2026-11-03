import urllib.request
import re

url = "https://computercare.in"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print("HTML length:", len(html))
        
        # Look for theme colors / styles
        colors = set(re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b', html))
        print("Colors sampled:", list(colors)[:20])
        
        # Search for main navigation text
        navs = re.findall(r'<nav[^>]*>(.*?)</nav>', html, re.DOTALL)
        print("Found nav elements:", len(navs))
        
        # Search for titles / categories
        categories = re.findall(r'/collections/([a-zA-Z0-9\-]+)', html)
        unique_cats = list(dict.fromkeys(categories))
        print(f"Found {len(unique_cats)} collection links. Sample:")
        for c in unique_cats[:25]:
            print("  -", c)

        # Check font imports
        fonts = re.findall(r'fonts\.googleapis\.com/css2\?family=([^"\'&]+)', html)
        print("Google Fonts:", fonts)
except Exception as e:
    print("Error:", e)
