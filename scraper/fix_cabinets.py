import urllib.request
import json
import re

url = "https://elitehubs.com/collections/pc-cabinet/products.json?limit=100"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        prods = data.get("products", [])
        print(f"Collection pc-cabinet count: {len(prods)}")
        for p in prods[:25]:
            pt = p.get("product_type", "")
            title = p.get("title", "")
            price = p.get("variants", [{}])[0].get("price", "0")
            print(f"- Type: [{pt}] | Title: {title} | Price: Rs. {price}")
except Exception as e:
    print("Error:", e)
