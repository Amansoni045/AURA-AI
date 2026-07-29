"""
HuggingFace Model Initializer preserved from chatModels/huggingFace.py & localModel.py.
"""

import os
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from app.core.config import settings


def get_huggingface_model(
    repo_id: str = "Qwen/Qwen2.5-Coder-32B-Instruct",
    temperature: float = 0.7,
) -> ChatHuggingFace:
    """
    Initializes and returns ChatHuggingFace wrapper over HuggingFaceEndpoint.
    Model initialization only - no route logic here.
    """
    token = settings.HUGGINGFACEHUB_ACCESS_TOKEN or os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN")
    if token:
        os.environ["HUGGINGFACEHUB_API_TOKEN"] = token

    endpoint = HuggingFaceEndpoint(
        repo_id=repo_id,
        temperature=temperature,
        huggingfacehub_api_token=token,
    )
    return ChatHuggingFace(llm=endpoint)
