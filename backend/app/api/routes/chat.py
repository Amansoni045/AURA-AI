from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.llm_service import llm_service

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")
    
    if request.stream:
        return StreamingResponse(
            llm_service.stream_chat(request.messages, request.model, request.temperature),
            media_type="text/event-stream"
        )
    
    # Non-streaming implementation could go here
    raise HTTPException(status_code=501, detail="Non-streaming mode not implemented")
