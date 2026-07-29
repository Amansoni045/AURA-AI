"""
MultiQueryRetriever module preserved from retrievers/multiquery.py.
"""

from langchain.retrievers.multi_query import MultiQueryRetriever
from app.vectorstores.chroma import get_chroma_store
from app.models.mistral import get_mistral_model


def get_multiquery_retriever(persist_dir: str = None) -> MultiQueryRetriever:
    """
    Returns a MultiQueryRetriever instance using Mistral LLM to generate query variations.
    """
    vectorstore = get_chroma_store(persist_dir)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    llm = get_mistral_model(model_name="open-mistral-7b")
    return MultiQueryRetriever.from_llm(
        retriever=retriever,
        llm=llm,
    )
