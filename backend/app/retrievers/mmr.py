"""
MMR (Maximal Marginal Relevance) Retriever module preserved from retrievers/mmr.py.
"""

from langchain_core.vectorstores import VectorStoreRetriever
from app.vectorstores.chroma import get_chroma_store


def get_mmr_retriever(k: int = 3, persist_dir: str = None) -> VectorStoreRetriever:
    """
    Returns an MMR search retriever wrapper over Chroma.
    """
    vectorstore = get_chroma_store(persist_dir)
    return vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": k},
    )
