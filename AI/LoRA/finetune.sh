export MODEL_NAME="stable-diffusion-v1-5/stable-diffusion-v1-5"
export CHECKPOINT="/mnt/nas-drive/pys/cuketmon/second/weight/checkpoint-13500"
export OUTPUT_DIR="/mnt/nas-drive/pys/cuketmon/second/weight"
export DATASET_NAME="/mnt/nas-drive/pys/cuketmon/datasets/pokemon_images"

accelerate launch train_text_to_image_lora.py \
  --pretrained_model_name_or_path=$MODEL_NAME \
  --dataset_name=$DATASET_NAME \
  --dataloader_num_workers=0 \
  --resolution=512 \
  --center_crop \
  --random_flip \
  --train_batch_size=8 \
  --gradient_accumulation_steps=1 \
  --max_train_steps=15000 \
  --learning_rate=1e-04 \
  --max_grad_norm=1 \
  --lr_scheduler="cosine" \
  --lr_warmup_steps=0 \
  --output_dir=${OUTPUT_DIR} \
  --checkpointing_steps=500 \
  --resume_from_checkpoint=$CHECKPOINT \
  --validation_prompt="a poketmon, black body, with fire, red eyed dragon" \
  --seed=1337