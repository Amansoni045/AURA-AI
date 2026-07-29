"""
Placeholder Pydantic schemas for future RAG document QA implementation.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any


class DocumentChunk(BaseModel):
    content: str = Field(..., description="Chunk text content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata key-value pairs")


class RAGQueryRequest(BaseModel):
    query: str = Field(..., description="Question or query string")
    top_k: int = Field(default=4, description="Top-K chunks to retrieve")


class RAGQueryResponse(BaseModel):
    answer: str = Field(..., description="Synthesized answer")
    sources: List[DocumentChunk] = Field(default_factory=list, description="Retrieved source chunks")
