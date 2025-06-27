import segmentation_models_pytorch as smp
def get_model(encoder_name="resnet34", classes=1, in_channels = 3, pretrained=True):
    model = smp.UnetPlusPlus(
        encoder_name=encoder_name,
        encoder_weights="imagenet" if pretrained else None,
        in_channels=in_channels,  # 🔁 수정됨: 슬라이스 수 = 2e+1
        classes=classes,
        activation=None
    )
    return model