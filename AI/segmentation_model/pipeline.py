from .utils import *
import torch
from torchvision import transforms
from .model import get_model
from torchvision.transforms.functional import to_pil_image

device = 'cuda' if torch.cuda.is_available() else 'cpu'
weight_path = "segmentation_model/results/weights/model_epoch_40.pth"
model = get_model(in_channels=3)
model.load_state_dict(torch.load(weight_path))

def remove_bg(img, device="cuda"):
    model.to(device)
    model.eval()

    to_tensor = transforms.ToTensor()
    with torch.no_grad():
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
        rgba_img = padded_tensor.clone()  # (3, H, W)
        alpha = pred_mask.squeeze(0) * 255  # (H, W), 0 또는 255

        rgba_np = torch.cat([rgba_img * 255, alpha.unsqueeze(0)], dim=0).byte()  # (4, H, W)
        rgba_pil = to_pil_image(rgba_np, mode='RGBA')
    return rgba_pil 