import sys
from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_mistralai import ChatMistralAI

load_dotenv()

class Movie(BaseModel):
    title: str = Field(description="Title of the movie")
    release_year: Optional[int] = Field(default=None, description="Release year of the movie")
    genre: List[str] = Field(default_factory=list, description="List of genres")
    director: Optional[str] = Field(default=None, description="Director of the movie")
    cast: List[str] = Field(default_factory=list, description="Main cast members")
    main_characters: List[str] = Field(default_factory=list, description="Main characters")
    plot_overview: Optional[str] = Field(default=None, description="Overview of the movie plot")
    rating: Optional[float] = Field(default=None, description="Rating of the movie if mentioned")
    summary: str = Field(description="A brief summary of the movie plot")

parser = PydanticOutputParser(pydantic_object=Movie)

prompt = ChatPromptTemplate.from_messages(
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

model = ChatMistralAI(model="open-mistral-7b")

chain = prompt | model | parser

def extract_movie_info(paragraph: str) -> Movie:
    return chain.invoke(
        {
            "paragraph": paragraph,
            "format_instructions": parser.get_format_instructions()
        }
    )

if __name__ == "__main__":
    print("=== Movie Information Extractor ===")
    print("Paste your movie paragraph below. Press Ctrl+D (Mac/Linux) or Ctrl+Z (Windows) when done:\n")

    paragraph = sys.stdin.read().strip()

    if not paragraph:
        print("❌ Error: No paragraph provided.")
    else:
        print("\n⏳ Extracting movie information using Mistral AI...\n")
        try:
            movie_data = extract_movie_info(paragraph)
            print("=== Extracted Movie Data ===")
            print(movie_data.model_dump_json(indent=2))
        except Exception as e:
            print(f"❌ Extraction failed: {e}")
