import os
import base64
from pathlib import Path
from io import BytesIO
from PIL import Image
from rembg import remove  # 배경 제거 라이브러리(rembg 사용 가정)
from google.cloud import storage
from sqlalchemy.orm import Session
from .config import GCS_KEY_PATH  # GCP 인증키 경로

# GCP 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GCS_KEY_PATH
storage_client = storage.Client()
bucket_name = list(storage_client.list_buckets())[0].name

def save_image(image: Image.Image, monster_id: int):    
    save_dir = Path("results")
    save_dir.mkdir(parents=True, exist_ok=True)

    resized = image.resize((81, 81))
    resized_path = save_dir / f"{monster_id}-org.png"
    resized.save(resized_path)

    output = remove(resized)
    output_path = save_dir / f"{monster_id}.png"
    output.save(output_path)

    # 4. GCP Storage에 업로드
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(f"{monster_id}.png")
    blob.upload_from_filename(str(output_path))
    print(f"Uploaded {monster_id}.png to GCP Storage!")

    gcs_url = f"https://storage.googleapis.com/cukemon/{monster_id}.png"

    return gcs_url