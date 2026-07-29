from pydantic import BaseModel, Field
from typing import List, Optional, Union


class ChatMessageItem(BaseModel):
    role: str = Field(..., description="Role of message author ('user' or 'assistant')")
    content: str = Field(..., description="Message text content")


class ChatRequest(BaseModel):
    messages: List[ChatMessageItem] = Field(default_factory=list, description="Conversation history messages")
    model: Optional[str] = Field(default="aura-turbo", description="Model selected in UI")
    stream: Optional[bool] = Field(default=True, description="Whether to stream response")


class PersonaChatRequest(BaseModel):
    choice: Union[int, str] = Field(default=2, description="Persona choice: 1 (Sad), 2 (Happy), 3 (Angry), 4 (Romantic)")
    user_input: str = Field(..., description="User prompt text")


class ChatResponse(BaseModel):
    response: str = Field(..., description="AI generated text response")
