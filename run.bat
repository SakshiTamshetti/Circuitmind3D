@echo off
echo Starting CircuitMind 3D Backend...
start cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --env-file .env"
echo Starting Frontend Server...
start http://127.0.0.1:5500
python -m http.server 5500 --bind 127.0.0.1
pause
