import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

# Automatically load .env file from project root or backend folder
env_path = Path(__file__).parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "AURA AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # API Keys from .env
    OPENAI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    MISTRAL_API_KEY: Optional[str] = None
    HUGGINGFACEHUB_ACCESS_TOKEN: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
