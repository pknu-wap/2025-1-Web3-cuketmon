from sqlalchemy.orm import Session
from .models import MonsterTable, PromptTable
from .schemas import MonsterCreate
from fastapi import HTTPException
from pathlib import Path
import base64
from PIL import Image
from io import BytesIO

def get_all_data(db: Session):
    return db.query(PromptTable).all()

def delete_prompt_entries(monster_ids, db: Session):
    if isinstance(monster_ids, int):
        monster_ids = [monster_ids]
    db.query(PromptTable).filter(PromptTable.id.in_(monster_ids)).delete(synchronize_session=False)
    db.commit()

def update_image_to_GCS(monster_id: int, gcs_url: str, db: Session):
    monster = db.query(MonsterTable).filter(MonsterTable.id == monster_id).with_for_update().first()
    if monster:
        monster.image = gcs_url
        db.commit()
    else:
        raise Exception(f"Monster with id {monster_id} not found.")
    


# =============== FOR TEST ================
    
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
    return db.query(PromptTable).filter(PromptTable.image == None).all()
