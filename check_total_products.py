import urllib.request
import json
import time

def check_pages():
    page = 1
    total_products = 0
    type_counts = {}
    while True:
        url = f"https://computercare.in/products.json?limit=250&page={page}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                prods = data.get("products", [])
                if not prods:
                    break
                total_products += len(prods)
                for p in prods:
                    t = p.get("product_type") or "Other"
                    type_counts[t] = type_counts.get(t, 0) + 1
                print(f"Page {page}: {len(prods)} products (Cumulative: {total_products})")
                page += 1
                time.sleep(0.3)
                if page > 30: # safety limit in case it's huge
                    break
        except Exception as e:
            print(f"Error on page {page}: {e}")
            break
    print(f"\nTotal products found: {total_products}")
    print("\nSummary of Product Types:")
    for k, v in sorted(type_counts.items(), key=lambda x: -x[1]):
        print(f"  {k}: {v}")

if __name__ == "__main__":
    check_pages()
