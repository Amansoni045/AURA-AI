"""
HuggingFace Embeddings module preserved directly from embeddingModels/huggingFace_embedding.py learning script.
"""

from typing import List
from langchain_huggingface import HuggingFaceEmbeddings


def get_huggingface_embeddings(
    model_name: str = "BAAI/bge-small-en-v1.5",
) -> HuggingFaceEmbeddings:
    """
    Initializes and returns HuggingFaceEmbeddings instance.
    """
    return HuggingFaceEmbeddings(model_name=model_name)


def embed_texts_huggingface(texts: List[str]) -> List[List[float]]:
    """
    Embeds a list of text strings using HuggingFace BAAI/bge-small-en-v1.5 embeddings.
    """
    embedding_model = get_huggingface_embeddings()
    return embedding_model.embed_documents(texts)
