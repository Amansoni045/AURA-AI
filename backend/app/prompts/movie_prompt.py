"""
Movie information extraction ChatPromptTemplate preserved from CineSage learning code.
"""

from langchain_core.prompts import ChatPromptTemplate

MOVIE_EXTRACTION_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert movie information extractor.\n"
            "Extract movie details from the provided text accurately.\n\n"
            "{format_instructions}"
        ),
        (
            "human",
            "{paragraph}"
        )
    ]
)
