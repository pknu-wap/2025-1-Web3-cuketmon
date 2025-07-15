import os
from pathlib import Path
from PIL import Image
from segmentation_model.pipeline import remove_bg

from google.cloud import storage
from .config import GCS_PATH, GCS_KEY_PATH

# GCP 설정
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GCS_KEY_PATH
storage_client = storage.Client()
bucket_name = list(storage_client.list_buckets())[0].name

def save_image(image: Image.Image, monster_id: int):    
    save_dir = Path("results")
    save_dir.mkdir(parents=True, exist_ok=True)

    resized = image.resize((256, 256))
    resized_path = save_dir / f"{monster_id}-org.png"
    resized.save(resized_path)

    output = remove_bg(resized, device="cuda")
    output_path = save_dir / f"{monster_id}.png"
    output.save(output_path)

    # 4. GCP Storage에 업로드
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(f"{monster_id}.png")
    blob.upload_from_filename(str(output_path))
    print(f"Uploaded {monster_id}.png to GCP Storage!")

    gcs_url = f"{GCS_PATH}/{monster_id}.png"

    return gcs_url
