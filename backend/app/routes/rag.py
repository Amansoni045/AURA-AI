from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.rag import RAGQueryRequest, RAGQueryResponse, UrlIngestRequest, UploadResponse
from app.services.ingestion_service import IngestionService
from app.services.rag_service import RAGService

router = APIRouter(prefix="/api/v1/rag", tags=["RAG Document Q&A"])


@router.post("/upload-file", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    """
    Uploads a PDF or Text file, splits it into chunks, generates embeddings, and indexes in Chroma.
    """
    file_bytes = await file.read()
    response = IngestionService.ingest_document_bytes(
        file_bytes=file_bytes,
        filename=file.filename,
    )
    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=response.error
        )
    return response


@router.post("/ingest-url", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
def ingest_url(request: UrlIngestRequest) -> UploadResponse:
    """
    Ingests, chunks, and indexes a webpage URL content.
    """
    response = IngestionService.ingest_url(url=request.url)
    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=response.error
        )
    return response


@router.post("/query", response_model=RAGQueryResponse, status_code=status.HTTP_200_OK)
def query_rag(request: RAGQueryRequest) -> RAGQueryResponse:
    """
    Performs context-aware question answering against the indexed document library.
    """
    try:
        return RAGService.query_rag(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG query failed: {str(e)}"
        )
