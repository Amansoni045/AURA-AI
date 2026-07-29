"""
RAG Service — Coordinates document retrieval and context synthesis using LangChain.
"""

from app.vectorstores.chroma import get_chroma_store
from app.models.mistral import get_mistral_model
from app.prompts.rag_prompt import get_rag_prompt
from app.schemas.rag import RAGQueryRequest, RAGQueryResponse, DocumentChunk


class RAGService:

    @staticmethod
    def query_rag(
        request: RAGQueryRequest,
        persist_dir: str = None,
    ) -> RAGQueryResponse:
        """
        Coordinates context retrieval from Chroma vectorstore and synthesis using Mistral.
        """
        vectorstore = get_chroma_store(persist_dir)
        
        # Use retriever matching k=6 for rich document QA
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": request.top_k},
        )
        
        retrieved_docs = retriever.invoke(request.query)

        if not retrieved_docs:
            return RAGQueryResponse(
                answer="No relevant context could be retrieved from the document.",
                sources=[],
            )

        context = "\n\n---\n\n".join([doc.page_content for doc in retrieved_docs])

        # LLM Synthesis using Mistral matching original logic
        llm = get_mistral_model(model_name="open-mistral-7b", temperature=0.2)
        prompt_template = get_rag_prompt()

        final_prompt = prompt_template.invoke({
            "context": context,
            "question": request.query,
        })
        response = llm.invoke(final_prompt)

        sources = [
            DocumentChunk(
                content=doc.page_content,
                metadata=doc.metadata,
            )
            for doc in retrieved_docs
        ]

        return RAGQueryResponse(
            answer=response.content,
            sources=sources,
        )
