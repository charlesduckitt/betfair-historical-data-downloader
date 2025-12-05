# Betfair Data Downloader - London Bundle

This is the portable package for the Betfair Historic Data Downloader.
This folder contains the Frontend React application source.

## 🚀 Setup Instructions

### 1. Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Python 3.9+ (If running without Docker)

### 2. Backend Implementation (Required)
The React Frontend expects a backend running at `http://localhost:8000`.
Create a folder `backend/` and implement the following FastAPI endpoints:

**`main.py`**:
```python
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel

app = FastAPI()

# State
class WorkerState:
    is_running = False
    is_paused = False

@app.post("/api/login")
def login(creds: dict):
    # Verify ssoid against betfair keepalive endpoint
    return {"success": True}

@app.post("/api/control/start")
def start_job(background_tasks: BackgroundTasks):
    WorkerState.is_running = True
    WorkerState.is_paused = False
    # background_tasks.add_task(your_download_manager_function)
    return {"status": "started"}

@app.post("/api/control/pause")
def pause_job():
    WorkerState.is_paused = True
    return {"status": "paused"}

@app.get("/api/status")
def get_status():
    # Return current stats
    return {
        "status": "RUNNING" if WorkerState.is_running else "IDLE",
        "stats": { ... },
        "logs": [ ... ]
    }
```

### 3. Docker Compose (One-Click Run)
Create a `docker-compose.yml` in the root:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
      - ./history.db:/app/history.db

  frontend:
    build: .
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### 4. Running the Bundle
**Windows**:
Double click `run_windows.bat` (Create this file):
```bat
@echo off
docker-compose up -d
echo Open http://localhost:3000
pause
```

**Linux**:
Run `./run_linux.sh` (Create this file):
```bash
#!/bin/bash
docker-compose up -d
echo "Server running at http://localhost:3000"
```

## ⚠️ Important Note
This code artifact provides the **User Interface**. You must implement the Python logic to actually fetch files from `historicdata.betfair.com` using the `requests` library and the credentials passed from this UI.