"""
Ingestion Service — Handles document parsing, chunking, embedding, and vector database persistence.
"""

import os
import gc
import tempfile
from pathlib import Path
from typing import List
from langchain_core.documents import Document
from app.loaders.pdf import load_pdf_document
from app.loaders.text import load_text_document
from app.loaders.web import load_web_url
from app.vectorstores.chroma import get_chroma_store
from app.schemas.rag import UploadResponse

BATCH_SIZE = 40


def format_file_size(size_bytes: int) -> str:
    """
    Format byte size into human readable string e.g. 1.2 MB.
    """
    if size_bytes == 0:
        return "0 B"
    size_name = ("B", "KB", "MB", "GB")
    i = 0
    p = float(size_bytes)
    while p >= 1024 and i < len(size_name) - 1:
        p /= 1024.0
        i += 1
    return f"{p:.1f} {size_name[i]}"


class IngestionService:

    @staticmethod
    def ingest_document_bytes(
        file_bytes: bytes,
        filename: str,
        persist_dir: str = None,
    ) -> UploadResponse:
        """
        Ingests uploaded document bytes (PDF or Text), splits, and persists to Chroma in batches.
        """
        size_str = format_file_size(len(file_bytes))
        tmp_path = None
        try:
            suffix = Path(filename).suffix.lower()
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(file_bytes)
                tmp_path = tmp.name

            # Step 1: Document Parsing & Loading
            if suffix == ".pdf":
                chunks = load_pdf_document(tmp_path)
                total_pages = len(set(c.metadata.get("page", 0) for c in chunks))
            else:
                chunks = load_text_document(tmp_path)
                total_pages = 1

            total_chunks = len(chunks)

            # Step 2: Tag metadata source file
            for chunk in chunks:
                chunk.metadata["source_file"] = filename

            # Step 3: Embeddings & VectorStore Persistence (Batched to prevent RAM spikes)
            vectorstore = get_chroma_store(persist_dir)
            for i in range(0, total_chunks, BATCH_SIZE):
                batch = chunks[i : i + BATCH_SIZE]
                vectorstore.add_documents(batch)
                del batch

            del chunks
            gc.collect()

            return UploadResponse(
                success=True,
                status="ready",
                stage="ready",
                total_pages=total_pages,
                total_chunks=total_chunks,
                filename=filename,
                file_size=size_str,
                error=None,
            )

        except Exception as e:
            return UploadResponse(
                success=False,
                status="failed",
                stage="failed",
                filename=filename,
                file_size=size_str,
                error=f"Ingestion failed: {str(e)}",
            )
        finally:
            if tmp_path and os.path.exists(tmp_path):
                try:
                    os.unlink(tmp_path)
                except Exception:
                    pass
            gc.collect()

    @staticmethod
    def ingest_url(url: str, persist_dir: str = None) -> UploadResponse:
        """
        Ingests web URL page contents, splits, and persists to Chroma in batches.
        """
        try:
            chunks = load_web_url(url)
            total_chunks = len(chunks)

            for chunk in chunks:
                chunk.metadata["source_file"] = url

            vectorstore = get_chroma_store(persist_dir)
            for i in range(0, total_chunks, BATCH_SIZE):
                batch = chunks[i : i + BATCH_SIZE]
                vectorstore.add_documents(batch)
                del batch

            del chunks
            gc.collect()

            return UploadResponse(
                success=True,
                status="ready",
                stage="ready",
                total_pages=1,
                total_chunks=total_chunks,
                filename=url,
                file_size="Web Page",
                error=None,
            )
        except Exception as e:
            return UploadResponse(
                success=False,
                status="failed",
                stage="failed",
                filename=url,
                file_size="Web Page",
                error=f"Web URL ingestion failed: {str(e)}",
            )
        finally:
            gc.collect()

