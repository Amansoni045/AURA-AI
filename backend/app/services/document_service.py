"""
Document Service — Business logic for document parsing and context retrieval.
"""

from typing import List
from langchain_core.documents import Document
from app.loaders.pdf import load_pdf_document
from app.loaders.text import load_text_document
from app.services.ingestion_service import IngestionService
from app.schemas.rag import UploadResponse


class DocumentService:

    @staticmethod
    def process_file_upload(file_bytes: bytes, filename: str) -> UploadResponse:
        """
        Processes and indexes uploaded document bytes.
        """
        return IngestionService.ingest_document_bytes(file_bytes=file_bytes, filename=filename)

    @staticmethod
    def parse_pdf(file_path: str) -> List[Document]:
        """
        Loads PDF document chunks.
        """
        return load_pdf_document(file_path)

    @staticmethod
    def parse_text(file_path: str) -> List[Document]:
        """
        Loads Text/Markdown document chunks.
        """
        return load_text_document(file_path)
