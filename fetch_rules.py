import urllib.request

url = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        text = resp.read().decode("utf-8")
        dest = r"C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder\.agents\skills\web-design-guidelines\rules.md"
        with open(dest, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Successfully saved {len(text)} bytes of rules to {dest}")
        print("Sample rules:")
        for line in text.split("\n")[:30]:
            print(" ", line)
except Exception as e:
    print("Error:", e)
