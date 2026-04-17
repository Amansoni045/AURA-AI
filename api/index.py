import sys
import os
import traceback

# Vercel's environment can be finicky. 
# We ensure the root directory is at the front of sys.path.
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Initialize app as None
app = None

try:
    # Importing backend.main which now has an __init__.py in its folder
    from backend.main import app as fastapi_app
    app = fastapi_app
    print("Aura AI Backend: FastAPI loaded successfully")
except Exception:
    print("Aura AI Backend: CRITICAL IMPORT ERROR")
    print(traceback.format_exc())

# Fallback for Vercel to prevent a 500 if the import fails during startup analysis
if app is None:
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/api/health")
    def health():
        return {"status": "error", "message": "Backend import failed. Check Vercel logs."}
