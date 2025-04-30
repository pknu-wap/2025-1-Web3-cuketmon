from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sshtunnel import SSHTunnelForwarder
from .config import SSH_HOST, SSH_USER, SSH_KEY_PATH, DB_HOST, DB_USER, DB_PASS, DB_NAME

tunnel = None
engine = None
SessionLocal = None

def connect_db():
    global tunnel, engine, SessionLocal

    tunnel = SSHTunnelForwarder(
        (SSH_HOST, 22),
        ssh_username=SSH_USER,
        ssh_private_key=SSH_KEY_PATH,
        remote_bind_address=(DB_HOST, 3306),
        local_bind_address=('127.0.0.1', 3307)
    )
    tunnel.start()

    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@127.0.0.1:3307/{DB_NAME}"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def disconnect_db():
    global tunnel
    if tunnel:
        tunnel.stop()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
