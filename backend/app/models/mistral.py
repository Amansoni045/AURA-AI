"""
Mistral AI Model Initializer preserved from chatBot.py & UIchatBot.py.
"""

from langchain_mistralai import ChatMistralAI
from app.core.config import settings


def get_mistral_model(
    model_name: str = "open-mistral-7b",
    temperature: float = 0.7,
    streaming: bool = False,
) -> ChatMistralAI:
    """
    Initializes and returns the ChatMistralAI model instance.
    Model initialization only - no route logic here.
    """
    return ChatMistralAI(
        model=model_name,
        temperature=temperature,
        api_key=settings.MISTRAL_API_KEY,
        streaming=streaming,
    )
