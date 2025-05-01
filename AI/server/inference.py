from diffusers import AutoPipelineForText2Image
import torch
from .config import MODEL_PATH, CHECKPOINT
from io import BytesIO
import base64
from rembg import remove
from PIL import Image
from pathlib import Path
from sqlalchemy.orm import Session

def model_inference(monster_id: int, monster_description: str):
    print("runing")
    checkpoint = CHECKPOINT
    pipeline = AutoPipelineForText2Image.from_pretrained('stable-diffusion-v1-5/stable-diffusion-v1-5', torch_dtype=torch.float16).to('cuda')
    pipeline.load_lora_weights(f'{MODEL_PATH}/checkpoint-{checkpoint}')
    print("model loaded")

    image = pipeline(f"a poketmon, {monster_description}, no background").images[0]
    return image

def save_image(image: Image.Image, monster_id: int, monster, db: Session):
    resized_image = image.resize((81, 81))
    save_path = Path(f"results/{monster_id}-org.png")
    resized_image.save(save_path)

    output = remove(resized_image)

    save_path = Path(f"results/{monster_id}.png")
    output.save(save_path)

    buffered = BytesIO()
    output.save(buffered, format="PNG")
    buffered.seek(0)

    encoded_string = base64.b64encode(buffered.read()).decode('utf-8')
    monster.image = encoded_string