"""
HuggingFace Embeddings module preserved directly from embeddingModels/huggingFace_embedding.py.
"""

from typing import List

_embedding_instance = None


def get_huggingface_embeddings(
    model_name: str = "BAAI/bge-small-en-v1.5",
):
    """
    Initializes and returns HuggingFaceEmbeddings instance lazily.
    """
    global _embedding_instance
    if _embedding_instance is None:
        from langchain_huggingface import HuggingFaceEmbeddings
        _embedding_instance = HuggingFaceEmbeddings(model_name=model_name)
    return _embedding_instance


def embed_texts_huggingface(texts: List[str]) -> List[List[float]]:
    """
    Embeds a list of text strings using HuggingFace BAAI/bge-small-en-v1.5 embeddings.
    """
    embedding_model = get_huggingface_embeddings()
    return embedding_model.embed_documents(texts)
