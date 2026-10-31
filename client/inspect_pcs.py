import json

with open('C:/Users/Hp/.gemini/antigravity/scratch/custom-pc-builder/client/public/data/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

pcs = data.get('gaming_pc', [])
print("Total gaming_pc products:", len(pcs))
if pcs:
    print("\nFirst PC sample:")
    print(json.dumps(pcs[0], indent=2))
    print("\nMin price PC:")
    sorted_pcs = sorted(pcs, key=lambda x: x.get('price', 999999))
    print(json.dumps(sorted_pcs[0], indent=2))
