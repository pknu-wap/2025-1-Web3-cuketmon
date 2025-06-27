import os
import argparse
import random
import json
from PIL import Image
import numpy as np
from glob import glob
import colorsys

# 고정된 텍스처 이미지 경로 목록
TEXTURE_PATHS = [
    "/mnt/nas-drive/pys/cuketmon/datasets/texture/image1.png",
    "/mnt/nas-drive/pys/cuketmon/datasets/texture/image2.png",
    "/mnt/nas-drive/pys/cuketmon/datasets/texture/image3.png",
    "/mnt/nas-drive/pys/cuketmon/datasets/texture/image4.png",
    "/mnt/nas-drive/pys/cuketmon/datasets/texture/image5.png",
]

def make_mask(image_dir):
    mask_dir = os.path.join(image_dir, "mask")
    os.makedirs(mask_dir, exist_ok=True)
    image_paths = glob(os.path.join(image_dir, "*.png"))

    for img_path in image_paths:
        img = Image.open(img_path).convert("RGBA")
        alpha = np.array(img)[..., 3]
        mask = (alpha > 0).astype(np.uint8) * 255
        mask_img = Image.fromarray(mask, mode="L")
        filename = os.path.basename(img_path)
        mask_img.save(os.path.join(mask_dir, filename))


def random_color_shift(np_img):
    """RGB numpy 배열 색상 랜덤 조정 (HSV 기반)"""
    img = np_img.astype(np.float32) / 255.0
    h, w, c = img.shape
    hsv_img = np.zeros_like(img)

    for i in range(h):
        for j in range(w):
            r, g, b = img[i, j]
            h_, s_, v_ = colorsys.rgb_to_hsv(r, g, b)
            h_ = (h_ + random.uniform(-0.1, 0.1)) % 1.0  # hue shift
            s_ = min(max(s_ * random.uniform(0.8, 1.2), 0), 1)
            v_ = min(max(v_ * random.uniform(0.8, 1.2), 0), 1)
            r_, g_, b_ = colorsys.hsv_to_rgb(h_, s_, v_)
            hsv_img[i, j] = [r_, g_, b_]

    return (hsv_img * 255).astype(np.uint8)


def generate_background(shape, pattern_type="solid"):
    h, w, c = shape
    color_palette = [
        [0, 0, 0], [128, 128, 128], [255, 255, 255],
        [255, 228, 225], [240, 248, 255], [230, 230, 250],
        [255, 239, 213], [250, 250, 210], [152, 251, 152],
        [175, 238, 238], [255, 182, 193], [221, 160, 221],
        [240, 255, 240], [255, 250, 205],
    ]

    if pattern_type == "solid":
        color = random.choice(color_palette)
        return np.ones(shape, dtype=np.uint8) * np.array(color, dtype=np.uint8)

    elif pattern_type == "checkerboard":
        color1, color2 = random.sample(color_palette, 2)
        tile_size = 8
        background = np.zeros(shape, dtype=np.uint8)
        for i in range(0, h, tile_size):
            for j in range(0, w, tile_size):
                color = color1 if (i // tile_size + j // tile_size) % 2 == 0 else color2
                background[i:i+tile_size, j:j+tile_size] = color
        return background

    elif pattern_type == "texture":
        texture_path = random.choice(TEXTURE_PATHS)
        tex_img = Image.open(texture_path).convert("RGB").resize((w, h))
        tex_np = np.array(tex_img)
        tex_np = random_color_shift(tex_np)
        return tex_np

    else:
        raise ValueError("Invalid pattern_type: choose from ['solid', 'checkerboard', 'texture']")


def make_composited_image(image_dir):
    output_dir = os.path.join(image_dir, "image")
    os.makedirs(output_dir, exist_ok=True)
    image_paths = glob(os.path.join(image_dir, "*.png"))

    for path in image_paths:
        rgba = Image.open(path).convert("RGBA")
        rgba_np = np.array(rgba)
        rgb = rgba_np[..., :3]
        alpha = rgba_np[..., 3]

        # 배경 패턴 무작위 선택
        pattern = random.choice(["solid", "checkerboard", "texture"])
        background = generate_background(rgb.shape, pattern_type=pattern)

        mask = (alpha == 0)[..., None]
        composited = np.where(mask, background, rgb)

        composited_img = Image.fromarray(composited.astype(np.uint8), mode="RGB")
        filename = os.path.basename(path)
        composited_img.save(os.path.join(output_dir, filename))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["mask", "image"], required=True, help="실행 모드: mask 또는 image")
    parser.add_argument("--config", default="../private/config.json", help="설정 파일 경로")
    args = parser.parse_args()

    with open(args.config, "r") as f:
        config = json.load(f)

    image_dir = config["image_path"]

    if args.mode == "mask":
        print("🔧 마스크 생성 중...")
        make_mask(image_dir)
        print("✅ 마스크 생성 완료.")
    elif args.mode == "image":
        print("🎨 배경 합성 이미지 생성 중...")
        make_composited_image(image_dir)
        print("✅ 이미지 생성 완료.")
