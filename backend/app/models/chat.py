from pydantic import BaseModel
from typing import List, Optional, Literal

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "gemini-2.0-flash"
    temperature: Optional[float] = 0.7
    stream: Optional[bool] = True

class ChatResponse(BaseModel):
    message: Message
    finish_reason: Optional[str] = None
