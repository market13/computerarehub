import urllib.request
import json
import time

def explore():
    url = "https://elitehubs.com/products.json?limit=250&page=1"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            products = data.get("products", [])
            print(f"Total products on page 1: {len(products)}")
            types = {}
            for p in products:
                pt = p.get("product_type") or "Unknown"
                types[pt] = types.get(pt, 0) + 1
            print("\nProduct Types on page 1:")
            for k, v in sorted(types.items(), key=lambda x: -x[1]):
                print(f"  {k}: {v}")
            
            # Sample product
            if products:
                sample = products[0]
                print("\nSample Product:")
                print(f"  Title: {sample.get('title')}")
                print(f"  Type: {sample.get('product_type')}")
                print(f"  Vendor: {sample.get('vendor')}")
                print(f"  Variants: {len(sample.get('variants', []))}")
                if sample.get('variants'):
                    v = sample['variants'][0]
                    print(f"  Price: {v.get('price')}")
                print(f"  Images: {len(sample.get('images', []))}")
                if sample.get('images'):
                    print(f"  Image URL 0: {sample['images'][0].get('src')}")
                print(f"  Tags: {sample.get('tags')[:5]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    explore()
