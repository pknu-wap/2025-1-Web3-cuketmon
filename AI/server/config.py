import json

with open("private/config.json", "r") as f:
    config = json.load(f)

SSH_KEY_PATH = config["ssh_key_path"]
SSH_USER = config["ssh_user"]
SSH_HOST = config["ssh_host"]
DB_HOST = config["db_host"]
DB_USER = config["db_user"]
DB_PASS = config["db_pass"]
DB_NAME = config["db_name"]
DB_PORT = config["db_port"]
MODEL_PATH = config["model_path"]
CHECKPOINT = config["checkpoint"]
GCS_KEY_PATH = config["gcs_key_path"]
GCS_PATH = config["gcs_path"]
INFERENCE_API_URL = config["inference_api_url"]