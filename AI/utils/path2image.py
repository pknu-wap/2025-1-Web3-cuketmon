import os
import pandas as pd
import requests

# CSV 파일 로드
csv_path = "/home/pys/2025-1-Web3-cuketmon/AI/filtered_file.csv"
df = pd.read_csv(csv_path)

# 저장할 폴더 지정
save_folder = "/mnt/nas-drive/pys/cuketmon/datasets/pokemon_images"
os.makedirs(save_folder, exist_ok=True)

# 이미지 다운로드 및 저장
for index, row in df.iterrows():
    image_url = row["image"]
    
    if pd.isna(image_url):  # URL이 없는 경우 건너뜀
        continue

    # 파일명 생성: "versions/" 이후의 경로만 사용
    filename = row["image_filename"]
    save_path = os.path.join(save_folder, filename)

    # 이미지 다운로드
    response = requests.get(image_url)
    if response.status_code == 200:
        with open(save_path, "wb") as f:
            f.write(response.content)
        print(f"Saved: {save_path}")
    else:
        print(f"Failed to download: {image_url}")

print("All images processed!")
