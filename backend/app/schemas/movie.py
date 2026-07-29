"""
Movie Pydantic model preserved directly from CineSage learning script & movie_extractor.py.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


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


class ExtractionRequest(BaseModel):
    paragraph: str = Field(..., description="Paragraph text containing movie information")
