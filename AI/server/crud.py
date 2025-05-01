from sqlalchemy.orm import Session
from .models import MonsterTable
from .schemas import MonsterCreate
from fastapi import HTTPException
from pathlib import Path
import base64

from PIL import Image
import base64
from io import BytesIO

def get_all_data(db: Session):
    return db.query(MonsterTable).all()

def add_monster(monster: MonsterCreate, db: Session):
    db_monster = MonsterTable(**monster.dict())
    db.add(db_monster)
    db.commit()
    db.refresh(db_monster)
    return db_monster

def delete_monster(monster_id: int, db: Session):
    monster = db.query(MonsterTable).filter(MonsterTable.id == monster_id).first()
    if not monster:
        raise HTTPException(status_code=404, detail=f"❌ id {monster_id}에 해당하는 포켓몬이 없습니다.")
    db.delete(monster)
    db.commit()

def get_null_images(db: Session):
    return db.query(MonsterTable).filter(MonsterTable.image == None).all()

def update_image_to_base64(monster_id: int, db: Session):
    monster = db.query(MonsterTable).filter(MonsterTable.id == monster_id).first()
    if not monster:
        raise HTTPException(status_code=404, detail=f"❌ id {monster_id}에 해당하는 포켓몬이 없습니다.")

    # ================================  for test ================================ 

    image_path = Path(f"results/14500.png")
    if image_path.exists():
        # 1. 이미지 열기
        with Image.open(image_path) as img:
            # 2. 81x81로 리사이즈
            img = img.resize((81, 81))

            # 3. 메모리에 저장 (바이트 스트림)
            buffered = BytesIO()
            img.save(buffered, format="PNG")  # 포맷을 지정해줘야 해
            buffered.seek(0)

            # 4. Base64 인코딩
            encoded_string = base64.b64encode(buffered.read()).decode('utf-8')  # <- 문자열로 decode

        monster.image = encoded_string
        db.commit()
    # ===========================================================================
    # if not monster.image:
    #     image_path = Path(f"results/14500.png")
    #     print(image_path)
    #     if image_path.exists():
    #         with open(image_path, "rb") as img_file:
    #             encoded_string = base64.b64encode(img_file.read())
    #         monster.image = encoded_string
    #         db.commit()
    #     else:
    #         raise HTTPException(status_code=404, detail=f"❌ 이미지 파일이 존재하지 않습니다: {image_path}")
    return monster
