import json

with open("private/config.json", "r") as f:
    config = json.load(f)

SSH_KEY_PATH = "private/cukemon.pem"
SSH_USER = "ubuntu"
SSH_HOST = config["ssh_host"]
DB_HOST = config["db_host"]
DB_USER = config["db_user"]
DB_PASS = config["db_pass"]
DB_NAME = config["db_name"]
DB_PORT = config["db_port"]
MODEL_PATH = config["model_path"]
CHECKPOINT = config["checkpoint"]
KEY_PATH = "private/adroit-goods-459105-u2-2be7b842c10f.json"
INFERENCE_API_URL = "http://localhost:3000/txt2img"