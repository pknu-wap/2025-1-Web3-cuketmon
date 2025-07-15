import numpy as np
from PIL import Image
from collections import Counter


def pad_and_resize_mode_padding(img, pad_ratio=0.25, size=(256, 256)):
    w, h = img.size
    pad_w = int(w * pad_ratio)
    pad_h = int(h * pad_ratio)
    left, top, right, bottom = pad_w, pad_h, pad_w, pad_h
    new_w, new_h = w + left + right, h + top + bottom

    img_np = np.array(img)  # (H, W, 3)

    # 방향별 최빈값 계산
    edge = 5
    top_mode    = get_mode_color(img_np[0:edge, :, :])
    bottom_mode = get_mode_color(img_np[h - edge:h, :, :])
    left_mode   = get_mode_color(img_np[:, 0:edge, :])
    right_mode  = get_mode_color(img_np[:, w - edge:w, :])

    corner = 5
    corner_lt = get_mode_color(img_np[0:corner, 0:corner])
    corner_rt = get_mode_color(img_np[0:corner, w - corner:w])
    corner_lb = get_mode_color(img_np[h - corner:h, 0:corner])
    corner_rb = get_mode_color(img_np[h - corner:h, w - corner:w])

    # 새 이미지 생성
    padded_img = Image.new(img.mode, (new_w, new_h))
    padded_img.paste(img, (left, top))

    # 상단
    for y in range(top):
        for x in range(left, left + w):
            padded_img.putpixel((x, y), top_mode)

    # 하단
    for y in range(top + h, new_h):
        for x in range(left, left + w):
            padded_img.putpixel((x, y), bottom_mode)

    # 좌측
    for x in range(left):
        for y in range(top, top + h):
            padded_img.putpixel((x, y), left_mode)

    # 우측
    for x in range(left + w, new_w):
        for y in range(top, top + h):
            padded_img.putpixel((x, y), right_mode)

    # 모서리
    for x in range(left):
        for y in range(top):
            padded_img.putpixel((x, y), corner_lt)
        for y in range(top + h, new_h):
            padded_img.putpixel((x, y), corner_lb)

    for x in range(left + w, new_w):
        for y in range(top):
            padded_img.putpixel((x, y), corner_rt)
        for y in range(top + h, new_h):
            padded_img.putpixel((x, y), corner_rb)

    # 리사이즈
    resized_img = padded_img.resize(size, resample=Image.BILINEAR)
    return resized_img

def get_mode_color(arr):
    """RGB 픽셀 배열에서 최빈값 반환"""
    pixels = [tuple(p) for p in arr.reshape(-1, 3)]
    return tuple(Counter(pixels).most_common(1)[0][0])
