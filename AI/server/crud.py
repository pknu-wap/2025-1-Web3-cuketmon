from sqlalchemy.orm import Session
from .models import MonsterTable
from .schemas import MonsterCreate
from fastapi import HTTPException
from pathlib import Path
import base64


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

    if not monster.image:
        image_path = Path(f"results/14500.png")
        print(image_path)
        if image_path.exists():
            with open(image_path, "rb") as img_file:
                encoded_string = base64.b64encode(img_file.read())
            monster.image = encoded_string
            db.commit()
        else:
            raise HTTPException(status_code=404, detail=f"❌ 이미지 파일이 존재하지 않습니다: {image_path}")
    return monster
