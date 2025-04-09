from diffusers import AutoPipelineForText2Image
import torch

pipeline = AutoPipelineForText2Image.from_pretrained('stabilityai/stable-diffusion-xl-base-1.0', torch_dtype=torch.float16).to('cuda')
pipeline.load_lora_weights('sWizad/pokemon-trainer-sprite-pixelart', weight_name='pk_trainer_xl_v1.safetensors')
image = pipeline('poketmon ball').images[0]
image.save("temp.png")