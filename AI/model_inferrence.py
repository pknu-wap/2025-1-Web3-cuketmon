from diffusers import AutoPipelineForText2Image
import torch
checkpoint=15000

pipeline = AutoPipelineForText2Image.from_pretrained('stable-diffusion-v1-5/stable-diffusion-v1-5', torch_dtype=torch.float16).to('cuda')
pipeline.load_lora_weights(f'/mnt/nas-drive/pys/cuketmon/weight/checkpoint-{checkpoint}')
image = pipeline('a poketmon, red human-like with big knuckle, black background').images[0]
image.save(f"{checkpoint}-1.png")