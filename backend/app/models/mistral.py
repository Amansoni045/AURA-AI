"""
Mistral AI Model Initializer preserved from chatBot.py & UIchatBot.py.
"""

from app.core.config import settings

_mistral_model_cache = {}


def get_mistral_model(
    model_name: str = "open-mistral-7b",
    temperature: float = 0.7,
    streaming: bool = False,
):
    """
    Initializes and returns the ChatMistralAI model instance (cached singleton per configuration).
    """
    cache_key = (model_name, temperature, streaming)
    if cache_key not in _mistral_model_cache:
        from langchain_mistralai import ChatMistralAI
        _mistral_model_cache[cache_key] = ChatMistralAI(
            model=model_name,
            temperature=temperature,
            api_key=settings.MISTRAL_API_KEY,
            streaming=streaming,
        )
    return _mistral_model_cache[cache_key]


