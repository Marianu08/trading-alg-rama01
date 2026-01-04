import sys
import os
import shutil
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Add parent directory to path to import from src
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import run_analysis from src.orders
try:
    from src.orders import run_analysis
except ImportError as e:
    print(f"Error importing src.orders: {e}")
    run_analysis = None

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'keys')
os.makedirs(DATA_DIR, exist_ok=True)

class RunRequest(BaseModel):
    ia_agent: str = 'groq'
    show_smart_summary: bool = True

class KeyUpdate(BaseModel):
    key_name: str # e.g. "kraken", "groq", "gemini"
    content: str

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "backend_ready": run_analysis is not None}

@app.post("/api/run")
async def run_trading_analysis(request: RunRequest):
    if not run_analysis:
        raise HTTPException(status_code=500, detail="Trading Logic not available")
    
    try:
        # Check if keys exist
        if not os.path.exists(os.path.join(DATA_DIR, 'kraken.key')):
             raise HTTPException(status_code=400, detail="Kraken API Key missing. Please configure it in Settings.")

        results = run_analysis(
            ia_agent=request.ia_agent,
            show_smart_summary=request.show_smart_summary
        )
        return results
    except Exception as e:
        print(f"Error running analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/keys/status")
async def get_keys_status():
    keys = {
        "kraken": os.path.exists(os.path.join(DATA_DIR, 'kraken.key')),
        "groq": os.path.exists(os.path.join(DATA_DIR, 'groq_api.key')),
        "gemini": os.path.exists(os.path.join(DATA_DIR, 'gemini_api.key')),
        "openai": os.path.exists(os.path.join(DATA_DIR, 'openai_api.key')),
    }
    return keys

@app.post("/api/keys")
async def update_key(key_data: KeyUpdate):
    # Map friendly names to filenames
    filename_map = {
        "kraken": "kraken.key",
        "groq": "groq_api.key",
        "gemini": "gemini_api.key",
        "openai": "openai_api.key"
    }
    
    if key_data.key_name not in filename_map:
        raise HTTPException(status_code=400, detail="Invalid key name")
    
    file_path = os.path.join(DATA_DIR, filename_map[key_data.key_name])
    try:
        with open(file_path, "w") as f:
            f.write(key_data.content.strip())
        return {"status": "updated", "key": key_data.key_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save key: {e}")

# Serve static files
web_dist = os.path.join(os.path.dirname(__file__), '..', 'web', 'dist')
if os.path.exists(web_dist):
    app.mount("/", StaticFiles(directory=web_dist, html=True), name="static")
