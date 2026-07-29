from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from app.persona_chatbot import get_initial_messages, generate_response
from app.movie_extractor import extract_movie_info, Movie
from langchain_mistralai import ChatMistralAI

app = FastAPI(title="AURA-AI API")
model = ChatMistralAI(model="open-mistral-7b")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    choice: int
    user_input: str

class ExtractionRequest(BaseModel):
    paragraph: str

@app.post("/api/persona-chat")
def persona_chat(req: ChatRequest):
    messages = get_initial_messages(req.choice)
    reply = generate_response(model, messages, req.user_input)
    return {"response": reply}

@app.post("/api/extract-movie", response_model=Movie)
def extract_movie(req: ExtractionRequest):
    if not req.paragraph.strip():
        raise HTTPException(status_code=400, detail="Paragraph required")
    return extract_movie_info(req.paragraph)
