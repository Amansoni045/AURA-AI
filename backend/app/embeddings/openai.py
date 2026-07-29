"""
OpenAI Embeddings module preserved directly from embeddingModels/embeddings.py.
"""

from typing import List
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings


def get_openai_embeddings(
    model_name: str = "text-embedding-ada-002",
    dimensions: int = 64,
) -> OpenAIEmbeddings:
    """
    Initializes and returns OpenAIEmbeddings instance.
    """
    return OpenAIEmbeddings(
        model=model_name,
        dimensions=dimensions,
        api_key=settings.OPENAI_API_KEY,
    )


def embed_texts_openai(texts: List[str]) -> List[List[float]]:
    """
    Embeds a list of text strings using OpenAI text-embedding-ada-002 model.
    """
    embedding_model = get_openai_embeddings()
    return embedding_model.embed_documents(texts)
