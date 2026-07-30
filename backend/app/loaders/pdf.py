"""
PDF Loader module preserved from documentLoaders/pdf.py and ui/ingest.py.
"""

from typing import List
from langchain_core.documents import Document


def load_pdf_document(
    file_path: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> List[Document]:
    """
    Loads a PDF file and splits it into chunked documents.
    """
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    loader = PyPDFLoader(file_path)
    pages = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
    )
    chunks = splitter.split_documents(pages)

    cleaned_chunks = []
    for chunk in chunks:
        chunk.page_content = (
            chunk.page_content.encode("utf-8", "ignore").decode("utf-8").strip()
        )
        if chunk.page_content:
            cleaned_chunks.append(chunk)

    return cleaned_chunks

