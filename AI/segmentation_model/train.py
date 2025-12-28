from model import get_model
import os
import torch
import torch.nn as nn
from tqdm import tqdm
from torchvision.utils import save_image

def create_center_weight_map(size, sigma=0.5, device='cpu'):
    H, W = size
    y = torch.linspace(-1, 1, H, device=device).unsqueeze(1)
    x = torch.linspace(-1, 1, W, device=device).unsqueeze(0)
    dist = x**2 + y**2
    weight = torch.exp(-dist / (2 * sigma**2))  # 중심일수록 값이 큼
    return weight  # shape: (H, W)

def train(train_loader, val_loader, device='cuda', num_epochs=10, save_dir=None):
    model = get_model(in_channels=3).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    loss_fn = nn.BCEWithLogitsLoss(reduction='none')  # 픽셀별 loss

    weights_dir = os.path.join(save_dir, "weights")
    visuals_dir = os.path.join(save_dir, "visuals")
    os.makedirs(weights_dir, exist_ok=True)
    os.makedirs(visuals_dir, exist_ok=True)

    # 이미지 크기 예를 들어 (H, W) = (256, 256) 이라고 가정하고 가중치 맵 생성
    # train_loader의 이미지 크기에 맞춰서 생성하세요.
    # (처음 배치의 크기로 생성하거나, 미리 알고있으면 고정)
    for images, _ in train_loader:
        _, _, H, W = images.shape
        center_weight_map = create_center_weight_map((H, W), sigma=0.5, device=device)
        # (H, W) -> (1, 1, H, W) 형태로 만들어 배치에 곱할 수 있도록 차원 맞추기
        center_weight_map = center_weight_map.unsqueeze(0).unsqueeze(0)
        break

    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        loop = tqdm(train_loader, desc=f"Epoch {epoch+1}/{num_epochs}", leave=False)
        for images, masks in loop:
            images = images.to(device)
            masks = masks.to(device).float()

            optimizer.zero_grad()
            outputs = model(images)

            loss = loss_fn(outputs, masks)  # (B, 1, H, W)
            # 가중치 맵을 브로드캐스팅하여 곱함
            weighted_loss = loss * center_weight_map  
            loss_mean = weighted_loss.mean()

            loss_mean.backward()
            optimizer.step()

            total_loss += loss_mean.item()
            loop.set_postfix(loss=loss_mean.item())

        avg_loss = total_loss / len(train_loader)
        print(f"Epoch [{epoch+1}/{num_epochs}] - Train Loss: {avg_loss:.4f}")

        epoch_folder = os.path.join(visuals_dir, f"epoch_{epoch+1:02d}")
        os.makedirs(epoch_folder, exist_ok=True)

        save_val_images(model, val_loader, device, epoch_folder, max_images=3)

        if (epoch + 1) % 10 == 0:
            weight_path = os.path.join(weights_dir, f"model_epoch_{epoch+1}.pth")
            torch.save(model.state_dict(), weight_path)
            print(f"Saved weights at epoch {epoch+1}")

    final_weight_path = os.path.join(weights_dir, "model_final.pth")
    torch.save(model.state_dict(), final_weight_path)
    print("Training finished. Final model saved.")




def save_val_images(model, val_loader, device, save_folder, max_images=3):
    model.eval()
    os.makedirs(save_folder, exist_ok=True)
    with torch.no_grad():
        for i, (images, masks) in enumerate(val_loader):
            images = images.to(device)                  # (B, 3, H, W)
            outputs = model(images)                      # (B, 1, H, W)
            preds = torch.sigmoid(outputs)
            preds = (preds > 0.5).float()               # 바이너리 마스크

            if i >= max_images:
                break

            # batch 내 첫 이미지
            orig_img = images[0].cpu()                   # (3, H, W)
            gt_mask = masks[0].unsqueeze(0).cpu()        # (1, H, W)
            pred_mask = preds[0].unsqueeze(0).cpu()      # (1, H, W)

            # 원본 이미지와 예측 마스크 곱하기 (마스킹된 이미지)
            masked_img = orig_img * pred_mask             # broadcasting (3, H, W) * (1, H, W)

            save_image(orig_img, os.path.join(save_folder, f"img_{i}.png"))
            save_image(gt_mask, os.path.join(save_folder, f"mask_{i}.png"))
            save_image(pred_mask, os.path.join(save_folder, f"pred_{i}.png"))
            save_image(masked_img, os.path.join(save_folder, f"masked_pred_{i}.png"))  # 추가 저장

    model.train()

