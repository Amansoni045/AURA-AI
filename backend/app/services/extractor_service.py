"""
Extractor Service — Business logic for movie metadata extraction.
Routes call this service; routes stay small and focused.
"""

from app.chains.movie_chain import run_movie_extraction_chain
from app.schemas.movie import ExtractionRequest, Movie


class ExtractorService:

    @staticmethod
    def extract_movie(request: ExtractionRequest) -> Movie:
        """
        Extracts structured Movie Pydantic object from paragraph text.
        """
        return run_movie_extraction_chain(request.paragraph)
