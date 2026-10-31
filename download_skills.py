import urllib.request
import json
import os

def download_dir(repo, path, dest):
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
            download_dir(repo, item["path"], sub_dest)

if __name__ == "__main__":
    base_dest = r"C:\Users\Hp\.gemini\antigravity\scratch\custom-pc-builder\.agents\skills"
    # Check skills in repo
    list_url = "https://api.github.com/repos/anthropics/skills/contents/skills"
    req = urllib.request.Request(list_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as resp:
        skills = [i["name"] for i in json.loads(resp.read().decode())]
    print(f"Available skills in anthropics/skills: {skills}")

    for target in ["frontend-design", "webapp-testing"]:
        # Find matching skill name
        matches = [s for s in skills if target.lower() in s.lower()]
        if matches:
            skill_name = matches[0]
            print(f"\nFound match for {target}: {skill_name}")
            dest_dir = os.path.join(base_dest, skill_name)
            download_dir("anthropics/skills", f"skills/{skill_name}", dest_dir)
        else:
            print(f"\nCould not find {target} directly, checking all skills...")
