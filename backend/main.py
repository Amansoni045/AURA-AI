from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add the project root to sys.path to import ChatModels
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ChatModels.chat import get_model

app = FastAPI(title="Generative AI API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    role: str
    content: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        model = get_model()
        # For now, we just pass the last user message
        # In a real app, we'd pass the whole history to the model
        user_message = request.messages[-1].content
        response = model.invoke(user_message)
        
        return ChatResponse(role="assistant", content=response.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
