"""
OpenAI Model Initializer preserved from chatModels/chat.py.
"""

from app.core.config import settings

_openai_model_cache = {}


def get_openai_model(
    model_name: str = "gpt-4o-mini",
    temperature: float = 0.7,
    streaming: bool = False,
):
    """
    Initializes and returns ChatOpenAI model instance (cached singleton per configuration).
    """
    cache_key = (model_name, temperature, streaming)
    if cache_key not in _openai_model_cache:
        from langchain_openai import ChatOpenAI
        _openai_model_cache[cache_key] = ChatOpenAI(
            model=model_name,
            temperature=temperature,
            api_key=settings.OPENAI_API_KEY,
            streaming=streaming,
        )
    return _openai_model_cache[cache_key]


