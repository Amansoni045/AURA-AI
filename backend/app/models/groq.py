"""
Groq Model Initializer preserved from chatModels/chat.py.
"""

from app.core.config import settings

_groq_model_cache = {}


def get_groq_model(
    model_name: str = "llama-3.3-70b-versatile",
    temperature: float = 0.7,
    streaming: bool = False,
):
    """
    Initializes and returns the ChatGroq model instance (cached singleton per configuration).
    """
    cache_key = (model_name, temperature, streaming)
    if cache_key not in _groq_model_cache:
        from langchain_groq import ChatGroq
        _groq_model_cache[cache_key] = ChatGroq(
            model_name=model_name,
            temperature=temperature,
            groq_api_key=settings.GROQ_API_KEY,
            streaming=streaming,
        )
    return _groq_model_cache[cache_key]


