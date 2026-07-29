"""
Website Service — Business logic for webpage scraping, cleaning, and indexing.
"""

from typing import List
from langchain_core.documents import Document
from app.loaders.web import load_web_url
from app.services.ingestion_service import IngestionService
from app.schemas.rag import UploadResponse


class WebsiteService:

    @staticmethod
    def process_url_ingestion(url: str) -> UploadResponse:
        """
        Crawls, cleans, and indexes web URL contents.
        """
        return IngestionService.ingest_url(url=url)

    @staticmethod
    def fetch_clean_webpage(url: str) -> List[Document]:
        """
        Fetches webpage text stripped of non-content HTML elements.
        """
        return load_web_url(url)
