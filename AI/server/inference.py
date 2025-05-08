from diffusers import AutoPipelineForText2Image
import torch
from .config import MODEL_PATH, CHECKPOINT
from io import BytesIO
import base64
from rembg import remove
from PIL import Image
from pathlib import Path
from sqlalchemy.orm import Session


print("Loading model...")
pipeline = AutoPipelineForText2Image.from_pretrained(
    'stable-diffusion-v1-5/stable-diffusion-v1-5', 
    torch_dtype=torch.float16
).to('cuda')
pipeline.load_lora_weights(f'{MODEL_PATH}/checkpoint-{CHECKPOINT}')
print("Model loaded.")

def model_inference(prompt: str):
    prompt = f"a poketmon, {prompt}, no background"
    image = pipeline(prompt).images[0]
    return image