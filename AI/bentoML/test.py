import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

API_URL = "http://localhost:3000/txt2img"
payload = {
    "prompt": "a pokemon, yellow, dragon, no background"
}

def send_request(idx):
    # 서버는 Content-Type: image/png 으로 raw PNG 바이트를 반환한다고 가정
    resp = requests.post(API_URL, json=payload, stream=True)
    return idx, resp.status_code, resp

def main():
    output_dir = Path("./outputs")
    output_dir.mkdir(exist_ok=True)

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(send_request, i) for i in range(2)]
        for future in as_completed(futures):
            idx, status, resp = future.result()
            if status == 200 and resp.headers.get("Content-Type") == "image/png":
                out_path = output_dir / f"image_{idx}.png"
                with open(out_path, "wb") as f:
                    for chunk in resp.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                print(f"[{idx}] Saved image to {out_path}")
            else:
                print(f"[{idx}] Error {status}: {resp.text[:200]}")

if __name__ == "__main__":
    main()
