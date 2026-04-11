import sys
import os
import traceback

# Add the root directory to the path so we can import from backend/
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(root_dir)

try:
    from backend.main import app
    print("FastAPI app loaded successfully.")
except Exception as e:
    print("CRITICAL: Failed to load FastAPI app from backend.main")
    print(traceback.format_exc())
    # Re-raise so Vercel knows the function failed to start
    raise e
