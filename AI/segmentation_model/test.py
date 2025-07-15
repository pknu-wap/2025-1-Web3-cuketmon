import os
import glob
import torch
import numpy as np
from PIL import Image
from collections import Counter
from torchvision import transforms
from torchvision.utils import save_image
from model import get_model
from torchvision.transforms.functional import to_pil_image
from utils import *

# 설정
image_dir = "../results"
weight_path = "results/weights/model_epoch_40.pth"
save_dir = "AI/results/predictions"
os.makedirs(save_dir, exist_ok=True)

# 모델 준비
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = get_model(in_channels=3).to(device)
model.load_state_dict(torch.load(weight_path, map_location=device))
model.eval()

to_tensor = transforms.ToTensor()
image_paths = glob.glob(os.path.join(image_dir, "*-org.png"))
print(f"Found {len(image_paths)} test images.")

with torch.no_grad():
    for img_path in image_paths:
        filename = os.path.basename(img_path).replace("-org.png", "")
        img = Image.open(img_path).convert("RGB")

        # 패딩 + 리사이즈
        padded_resized_img = pad_and_resize_mode_padding(img, pad_ratio=0.2, size=(256, 256))
        tensor_img = to_tensor(padded_resized_img).unsqueeze(0).to(device)

        # 모델 추론
        output = model(tensor_img)
        pred = torch.sigmoid(output)
        pred_bin = (pred > 0.5).float().cpu()

        # 마스킹
        pred_mask = pred_bin[0]
        padded_tensor = to_tensor(padded_resized_img)
        masked_img = padded_tensor * pred_mask

        # 저장
        save_image(pred_mask, os.path.join(save_dir, f"{filename}_pred.png"))
        save_image(masked_img, os.path.join(save_dir, f"{filename}_masked.png"))

        # RGBA 저장
        rgba_img = padded_tensor.clone()  # (3, H, W)
        alpha = pred_mask.squeeze(0) * 255  # (H, W), 0 또는 255

        rgba_np = torch.cat([rgba_img * 255, alpha.unsqueeze(0)], dim=0).byte()  # (4, H, W)
        rgba_pil = to_pil_image(rgba_np, mode='RGBA')
        rgba_pil.save(os.path.join(save_dir, f"{filename}_rgba.png"))

print("✅ 테스트 완료. 결과 저장됨:", save_dir)
