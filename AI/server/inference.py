from diffusers import AutoPipelineForText2Image
import torch
from .config import INFERENCE_API_URL
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image
import io

INFERENCE_API_URL = INFERENCE_API_URL
MAX_WORKERS = 8

import requests

def model_inference(prompts):
    """
    prompts: List[str]
    return: List[(prompt, PIL.Image.Image)]
    """
    def _send(prompt):
        resp = requests.post(INFERENCE_API_URL, json={"prompt": f"a pokemon, {prompt}, no background"}, stream=True)
        if resp.status_code == 200 and resp.headers.get("Content-Type") == "image/png":
            img_bytes = resp.content
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            return prompt, img
        else:
            return prompt, None

    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(_send, p): p for p in prompts}
        for future in as_completed(futures):
            prompt, img = future.result()
            results.append((prompt, img))

    return results