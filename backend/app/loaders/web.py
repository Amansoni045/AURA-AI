"""
Website Loader module.
Downloads webpage, extracts clean readable content, removes scripts, ads, footers, and returns structured document chunks.
"""

from typing import List
import urllib.request
import re
from bs4 import BeautifulSoup
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def extract_clean_text_from_html(html_content: str) -> str:
    """
    Strips scripts, styles, advertisements, headers, and footers from HTML,
    returning clean readable text content.
    """
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove non-content tags
    for tag in soup(["script", "style", "nav", "header", "footer", "aside", "form"]):
        tag.decompose()

    text = soup.get_text(separator="\n")
    
    # Clean whitespace and empty lines
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase for phrase in lines if phrase)
    return "\n".join(chunks)


def load_web_url(
    url: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 150,
) -> List[Document]:
    """
    Fetches URL content, cleans the HTML, and returns chunked documents.
    """
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(url, headers=headers)
    
    with urllib.request.urlopen(req) as response:
        html = response.read().decode("utf-8", errors="ignore")

    clean_text = extract_clean_text_from_html(html)
    
    doc = Document(
        page_content=clean_text,
        metadata={"source": url}
    )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
    )
    return splitter.split_documents([doc])
