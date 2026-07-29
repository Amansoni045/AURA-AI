from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class DocumentChunk(BaseModel):
    content: str = Field(..., description="Chunk text content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Chunk metadata properties")


class RAGQueryRequest(BaseModel):
    query: str = Field(..., description="User question or search query")
    top_k: int = Field(default=6, description="Number of source chunks to retrieve")


class RAGQueryResponse(BaseModel):
    answer: str = Field(..., description="LLM generated answer based on retrieved documents")
    sources: List[DocumentChunk] = Field(default_factory=list, description="Source document references")


class UrlIngestRequest(BaseModel):
    url: str = Field(..., description="Webpage URL to ingest and index")


class UploadResponse(BaseModel):
    success: bool = Field(..., description="Whether processing was successful")
    status: str = Field(default="ready", description="Overall status: 'ready', 'failed', or 'processing'")
    stage: str = Field(default="ready", description="Pipeline stage: 'uploaded', 'chunked', 'embedded', 'ready', or 'failed'")
    total_pages: Optional[int] = Field(default=0, description="Total PDF pages read")
    total_chunks: Optional[int] = Field(default=0, description="Total vector chunks generated")
    filename: str = Field(..., description="Name of the processed file or URL source")
    file_size: Optional[str] = Field(default=None, description="Human readable file size e.g. '1.2 MB'")
    error: Optional[str] = Field(default=None, description="Error message if process failed")
