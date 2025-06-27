import bentoml
from PIL.Image import Image
import time

MODEL_ID = "stable-diffusion-v1-5/stable-diffusion-v1-5"
sample_prompt = "a pokemon, yellow, dragon, no background"
my_image = bentoml.images.Image(python_version="3.12.3") \
      .requirements_file("requirements.txt")

@bentoml.service(
    traffic={
        "timeout": 300,
        "max_concurrency": 8,
    },
    resources={
        "gpu": 2,
        "gpu_type": "nvidia-l4",
    },
    workers=2,
    lazy=False  # ✅ 핵심!

)
class CukemonGenerator:
    def __init__(self):
        from diffusers import AutoPipelineForText2Image
        import torch

        self.gpu_idx = bentoml.server_context.worker_index % 2
        self.cuda = torch.device(f"cuda:{self.gpu_idx}")
        print(f"[INFO] Worker {bentoml.server_context.worker_index} using {self.cuda}")

        self.pipe = AutoPipelineForText2Image.from_pretrained(
            "stable-diffusion-v1-5/stable-diffusion-v1-5",
            torch_dtype=torch.float16
        )
        self.pipe.load_lora_weights("/mnt/nas-drive/pys/cuketmon/second/weight/checkpoint-5000")
        self.pipe.to(self.cuda)

    @bentoml.api
    def txt2img(
            self,
            prompt: str = sample_prompt,
    ) -> Image:
            s = time.time()
            image = self.pipe(
                prompt=prompt,
                num_inference_steps=25,
            ).images[0]
            e = time.time()
            print(self.cuda,"[INFO] inference time:", e-s)
            return image