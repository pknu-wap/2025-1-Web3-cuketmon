from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .config import DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT

engine = None
SessionLocal = None

def connect_db():
    global engine, SessionLocal

    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    print("[INFO] DB has been connected...")
    
def disconnect_db():
    global engine
    if engine:
        engine.dispose()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()