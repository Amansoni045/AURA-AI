from fastapi import APIRouter, HTTPException, status
from app.schemas.movie import ExtractionRequest, Movie
from app.services.extractor_service import ExtractorService

router = APIRouter(tags=["Movie Extractor"])


@router.post("/api/extract-movie", response_model=Movie)
@router.post("/api/v1/extractor/extract-movie", response_model=Movie)
def extract_movie(request: ExtractionRequest) -> Movie:
    """
    Receive request -> Call service -> Return response.
    """
    if not request.paragraph.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paragraph text is required for movie extraction"
        )
    try:
        return ExtractorService.extract_movie(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Movie extraction error: {str(e)}"
        )
