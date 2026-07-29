"""
RAG System Prompts and Prompt Templates preserved from ui/rag_engine.py.
"""

from langchain_core.prompts import ChatPromptTemplate

RAG_SYSTEM_PROMPT = """You are a knowledgeable AI reading assistant. 
Answer the user's question accurately based on the provided document context.

Instructions:
1. Synthesize all relevant explanations, definitions, key points, or mentions found in the context.
2. If the context touches on the topic (even in summaries or section overviews), provide a helpful explanation based on what is available.
3. Be clear, direct, and well-structured.
4. Only state that the answer was not found if the context has absolutely zero relevance to the user's question."""


def get_rag_prompt() -> ChatPromptTemplate:
    """
    Returns ChatPromptTemplate for synthesized context document QA.
    """
    return ChatPromptTemplate.from_messages([
        ("system", RAG_SYSTEM_PROMPT),
        ("human", "Document Context:\n{context}\n\nQuestion: {question}"),
    ])
