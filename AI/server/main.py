from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import time
from threading import Thread
from . import database, models, crud, schemas
from .inference import model_inference
import time
from sqlalchemy.orm import Session
from .crud import get_null_images, update_image_to_base64  # 필요한 함수들 import
from .inference import model_inference, save_image
from pathlib import Path
app = FastAPI()

# DB 연결 설정
@app.on_event("startup")
def startup():
    database.connect_db()
    start_background_task()  # 백그라운드 작업 시작

@app.on_event("shutdown")
def shutdown():
    database.disconnect_db()

def process_images():
    while True:
        db = database.SessionLocal()  # 매번 새로 DB 연결
        try:
            null_images = get_null_images(db)
            if null_images:
                batch_size = 4
                for i in range(0, len(null_images), batch_size):
                    batch = null_images[i:i+batch_size]
                    for monster in batch:
                        monster_id = monster.id
                        monster_description = monster.description

                        image = model_inference(monster_id, monster_description)
                        save_image(image, monster_id, monster, db)

                        db.commit()
        except Exception as e:
            print(f"Error in process_images: {e}")
            db.rollback()
        finally:
            db.close()
        time.sleep(1)

def start_background_task():
    thread = Thread(target=process_images)  # <-- () 쓰지 말고, 인자도 넘기지 말기
    thread.daemon = True
    thread.start()


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
