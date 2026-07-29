"""
Groq Model Initializer preserved from chatModels/chat.py.
"""

from langchain_groq import ChatGroq
from app.core.config import settings


def get_groq_model(
    model_name: str = "llama-3.3-70b-versatile",
    temperature: float = 0.7,
    streaming: bool = False,
) -> ChatGroq:
    """
    Initializes and returns the ChatGroq model instance.
    Model initialization only - no route logic here.
    """
    return ChatGroq(
        model_name=model_name,
        temperature=temperature,
        groq_api_key=settings.GROQ_API_KEY,
        streaming=streaming,
    )
