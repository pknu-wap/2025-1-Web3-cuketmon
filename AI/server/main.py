from fastapi import FastAPI, Depends, HTTPException
from . import database, models, crud, schemas
from sqlalchemy.orm import Session

app = FastAPI()

@app.on_event("startup")
def startup():
    database.connect_db()

@app.on_event("shutdown")
def shutdown():
    database.disconnect_db()

@app.get("/null_images")
def read_null_images(db: Session = Depends(database.get_db)):
    return crud.get_null_images(db)

@app.get("/get_all_data")
def read_all_data(db: Session = Depends(database.get_db)):
    return crud.get_all_data(db)

@app.post("/add_monster")
def create_monster(monster: schemas.MonsterCreate, db: Session = Depends(database.get_db)):
    db_monster = crud.add_monster(monster, db)
    return {"message": "✅ 몬스터 추가 완료", "monster_id": db_monster.id}

@app.delete("/delete_monster/{monster_id}")
def remove_monster(monster_id: int, db: Session = Depends(database.get_db)):
    crud.delete_monster(monster_id, db)
    return {"message": f"✅ id {monster_id} 포켓몬 삭제 완료"}

@app.post("/update_image_to_base64/{monster_id}")
def modify_monster_image(monster_id: int, db: Session = Depends(database.get_db)):
    crud.update_image_to_base64(monster_id, db)
    return {"message": f"✅ id {monster_id} 포켓몬의 이미지가 업데이트 완료"}
