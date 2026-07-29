from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, PersonaChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(tags=["Chat"])


@router.post("/api/v1/chat")
async def chat_stream(request: ChatRequest):
    """
    Receive request -> Call service -> Return response.
    """
    try:
        return StreamingResponse(
            ChatService.stream_chat_response(request),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat streaming error: {str(e)}"
        )


@router.post("/api/persona-chat", response_model=ChatResponse)
@router.post("/api/v1/persona-chat", response_model=ChatResponse)
def persona_chat(request: PersonaChatRequest) -> ChatResponse:
    """
    Receive request -> Call service -> Return response.
    """
    try:
        return ChatService.handle_persona_chat(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Persona chat error: {str(e)}"
        )
