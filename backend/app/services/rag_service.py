"""
RAG Service — Business logic placeholder for RAG document query processing.
Routes call this service; routes stay small and focused.
"""

from app.agents.rag_agent import RAGAgent
from app.schemas.rag import RAGQueryRequest, RAGQueryResponse


class RAGService:

    @staticmethod
    def query_documents(request: RAGQueryRequest) -> RAGQueryResponse:
        """
        Executes document QA query against RAG Agent.
        """
        agent = RAGAgent()
        return agent.query(request)
