"""
Arxiv Academic Retriever module preserved from retrievers/arixv.py.
"""

import arxiv
from langchain_community.retrievers import ArxivRetriever

# Dynamic patch from original script logic
if not hasattr(arxiv.Search, "results"):
    arxiv.Search.results = lambda self: arxiv.Client().results(self)


def get_arxiv_retriever(load_max_docs: int = 3) -> ArxivRetriever:
    """
    Returns ArxivRetriever instance.
    """
    return ArxivRetriever(
        load_max_docs=load_max_docs,
        load_all_available_meta=True,
    )
