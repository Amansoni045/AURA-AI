import sys
import os

# Ensure the root directory is in the path so we can import everything correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app

# Vercel needs the 'app' variable to be available at the module level
# We've imported it from backend.main, so it's ready.
