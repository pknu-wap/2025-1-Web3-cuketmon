import time
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from threading import Thread
from . import database, crud, schemas
from .inference import model_inference
from .crud import get_all_data, update_image_to_GCS, delete_prompt_entries
from .utils import save_image

app = FastAPI()

@app.on_event("startup")
def startup():
    database.connect_db()
    start_background_task()

@app.on_event("shutdown")
def shutdown():
    database.disconnect_db()

def process_images():
    batch_size = 8

    while True:
        db = database.SessionLocal()
        try:
            # DB에서 최대 8개 가져오기
            monsters = get_all_data(db)[:batch_size]
            if monsters:
                prompts = [m.description for m in monsters]
                inference_results = model_inference(prompts)

                for monster, (prompt, img_bytes) in zip(monsters, inference_results):
                    if img_bytes:
                        gcs_url = save_image(img_bytes, monster.id)
                        update_image_to_GCS(monster.id, gcs_url, db)
                        delete_prompt_entries(monster.id, db)
                        db.commit()
                    else:
                        print(f"[{monster.id}] Failed to generate image for prompt: {prompt}")
                        db.rollback()
        except Exception as e:
            print(f"Error in process_images: {e}")
            db.rollback()
        finally:
            db.close()

        time.sleep(1)


def start_background_task():
    thread = Thread(target=process_images)
    thread.daemon = True
    thread.start()


# ============== FOR TEST =============

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