nohup bash -c 'WORKER_ID=0 uvicorn server.main:app --workers 1 --host 0.0.0.0 --port 8000 --reload' &
cd bentoML/
nohup bash -c 'bentoml serve > output.txt 2>&1' &