"""
Movie extraction LCEL chain (chain = prompt | model | parser) preserved from CineSage & movie_extractor.py.
"""

from langchain_core.output_parsers import PydanticOutputParser
from app.models.mistral import get_mistral_model
from app.prompts.movie_prompt import MOVIE_EXTRACTION_PROMPT
from app.schemas.movie import Movie


def get_movie_extraction_chain():
    """
    Constructs the LCEL chain: prompt | model | parser
    """
    parser = PydanticOutputParser(pydantic_object=Movie)
    model = get_mistral_model(model_name="open-mistral-7b")

    chain = MOVIE_EXTRACTION_PROMPT | model | parser
    return chain, parser


def run_movie_extraction_chain(paragraph: str) -> Movie:
    """
    Executes the movie extraction chain on input paragraph text.
    """
    chain, parser = get_movie_extraction_chain()
    extracted_movie: Movie = chain.invoke(
        {
            "paragraph": paragraph,
            "format_instructions": parser.get_format_instructions(),
        }
    )
    return extracted_movie
