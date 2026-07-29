"""
RAG Prompt Template placeholder for future document search & retrieval feature.
"""

from langchain_core.prompts import ChatPromptTemplate

RAG_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Use only the provided context to answer the user question.\n"
            "If the answer is not present in the context, say 'I could not find the answer in the provided documents.'\n\n"
            "Context:\n{context}"
        ),
        (
            "human",
            "{question}"
        )
    ]
)
