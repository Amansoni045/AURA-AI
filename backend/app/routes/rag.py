from fastapi import APIRouter, HTTPException, status
from app.schemas.rag import RAGQueryRequest, RAGQueryResponse
from app.services.rag_service import RAGService

router = APIRouter(prefix="/api/v1/rag", tags=["RAG Document Q&A"])


@router.post("/query", response_model=RAGQueryResponse)
def query_rag_endpoint(request: RAGQueryRequest) -> RAGQueryResponse:
    """
    Receive request -> Call service -> Return response.
    """
    try:
        return RAGService.query_documents(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG query error: {str(e)}"
        )
