import urllib.request
import json
import os

def download_github_dir(repo, path, dest):
    url = f"https://api.github.com/repos/{repo}/contents/{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as resp:
            items = json.loads(resp.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return

    os.makedirs(dest, exist_ok=True)
    for item in items:
        if item["type"] == "file":
            file_url = item["download_url"]
            file_dest = os.path.join(dest, item["name"])
            print(f"Downloading {item['name']} -> {file_dest}")
            try:
                file_req = urllib.request.Request(file_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(file_req) as fresp:
                    content = fresp.read()
                    with open(file_dest, "wb") as f:
                        f.write(content)
            except Exception as e:
                print(f"Error downloading {file_url}: {e}")
        elif item["type"] == "dir":
            sub_dest = os.path.join(dest, item["name"])
            download_github_dir(repo, item["path"], sub_dest)

if __name__ == "__main__":
    base_dest = r"C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder\.agents\skills\web-design-guidelines"
    # Check repo structure
    req = urllib.request.Request("https://api.github.com/repos/vercel-labs/agent-skills/contents/skills", headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as resp:
            skills = [i["name"] for i in json.loads(resp.read().decode())]
            print("Available skills in vercel-labs/agent-skills:", skills)
            if "web-design-guidelines" in skills:
                download_github_dir("vercel-labs/agent-skills", "skills/web-design-guidelines", base_dest)
            else:
                matches = [s for s in skills if "design" in s or "web" in s]
                print("Matches:", matches)
                for m in matches:
                    download_github_dir("vercel-labs/agent-skills", f"skills/{m}", os.path.join(r"C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder\.agents\skills", m))
    except Exception as e:
        print("Error checking skills folder, checking root:", e)
        # Check root
        req2 = urllib.request.Request("https://api.github.com/repos/vercel-labs/agent-skills/contents", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req2) as resp2:
            root_items = [i["name"] for i in json.loads(resp2.read().decode())]
            print("Root items:", root_items)
            for item in root_items:
                if "design" in item or "guidelines" in item or "web" in item:
                    download_github_dir("vercel-labs/agent-skills", item, base_dest)
