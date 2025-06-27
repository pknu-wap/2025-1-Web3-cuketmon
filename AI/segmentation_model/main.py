import os
import torch
from torch.utils.data import DataLoader, random_split
from data import SegmentationDataset  # 앞서 만든 Dataset 클래스
from train import train  # 아래 train 함수는 수정해서 따로 분리 가능
import torchvision.transforms as T


def main():
    # config 불러오기
    import json
    with open("../private/config.json", "r") as f:
        config = json.load(f)
    data_dir = config["image_path"]
    image_dir = os.path.join(data_dir, "image")
    mask_dir = os.path.join(data_dir, "mask")

    # 간단한 transform 예시 (tensor 변환 + 정규화)
    transform = T.Compose([
        T.ToTensor(),
        # T.Normalize(mean=[...], std=[...]) 필요시 추가
    ])

    dataset = SegmentationDataset(image_dir, mask_dir, transform=transform)
    
    total_len = len(dataset)
    train_len = int(total_len * 0.7)
    val_len = int(total_len * 0.15)
    test_len = total_len - train_len - val_len
    train_set, val_set, test_set = random_split(dataset, [train_len, val_len, test_len])

    train_loader = DataLoader(train_set, batch_size=32, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_set, batch_size=8, shuffle=False, num_workers=2)
    test_loader = DataLoader(test_set, batch_size=8, shuffle=False, num_workers=2)

    train(train_loader, val_loader, device='cuda:1', num_epochs=100, save_dir='result')
if __name__ == "__main__":
    main()
