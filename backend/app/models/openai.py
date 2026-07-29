"""
OpenAI Model Initializer preserved from chatModels/chat.py.
"""

from langchain_openai import ChatOpenAI
from app.core.config import settings


def get_openai_model(
    model_name: str = "gpt-4o-mini",
    temperature: float = 0.7,
    streaming: bool = False,
) -> ChatOpenAI:
    """
    Initializes and returns ChatOpenAI model instance.
    Model initialization only - no route logic here.
    """
    return ChatOpenAI(
        model=model_name,
        temperature=temperature,
        api_key=settings.OPENAI_API_KEY,
        streaming=streaming,
    )
