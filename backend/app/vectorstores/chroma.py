"""
Chroma Vector Database integration preserved from vectorStore/db.py and ui/rag_engine.py.
"""

import os
from pathlib import Path

# Define root database path
BACKEND_ROOT = Path(__file__).parent.parent.parent
CHROMA_DB_DIR = str(BACKEND_ROOT / "chroma_db")

_chroma_instance = None


def get_existing_chroma_path() -> str:
    """
    Checks for candidate directory names and returns the first existing path.
    """
    candidates = ["chroma_db", "chroma-db", "Chroma-db"]
    for c in candidates:
        p = BACKEND_ROOT / c
        if p.exists() and any(p.iterdir()):
            return str(p)
    return CHROMA_DB_DIR


def has_chroma_documents() -> bool:
    """
    Fast non-blocking check to see if Chroma database exists and contains indexed documents.
    """
    path = get_existing_chroma_path()
    if os.path.exists(path) and os.path.isdir(path):
        sqlite_file = os.path.join(path, "chroma.sqlite3")
        return os.path.exists(sqlite_file) and os.path.getsize(sqlite_file) > 0
    return False


def get_chroma_store(persist_dir: str = None):
    """
    Initializes and returns the Chroma VectorStore wrapper instance lazily & cached as a singleton.
    """
    global _chroma_instance
    if _chroma_instance is None or persist_dir is not None:
        from langchain_chroma import Chroma
        from app.embeddings.huggingface import get_huggingface_embeddings

        target_dir = persist_dir or get_existing_chroma_path()
        embedding_model = get_huggingface_embeddings()
        instance = Chroma(
            persist_directory=target_dir,
            embedding_function=embedding_model,
        )
        if persist_dir is None:
            _chroma_instance = instance
        return instance
    return _chroma_instance
