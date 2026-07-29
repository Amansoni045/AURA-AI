"""
Chat Service — Business logic for Chat & Persona Chatbot.
Routes call this service; routes stay small and focused.
"""

from typing import AsyncGenerator
import json
from app.agents.persona_agent import process_persona_chat
from app.schemas.chat import ChatRequest, PersonaChatRequest, ChatResponse
from app.models.groq import get_groq_model
from app.models.mistral import get_mistral_model
from app.models.openai_model import get_openai_model
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage


class ChatService:

    @staticmethod
    def handle_persona_chat(request: PersonaChatRequest) -> ChatResponse:
        """
        Executes persona chatbot interaction.
        """
        reply_text = process_persona_chat(choice=request.choice, user_input=request.user_input)
        return ChatResponse(response=reply_text)

    @staticmethod
    async def stream_chat_response(request: ChatRequest) -> AsyncGenerator[str, None]:
        """
        Streams chat completion tokens in Server-Sent Events (SSE) format for Next.js UI.
        """
        model_name = request.model.lower() if request.model else "aura-turbo"

        # Select model instance based on user selection in UI
        if "mistral" in model_name or "intellect" in model_name:
            llm = get_mistral_model(streaming=True)
        elif "gpt" in model_name or "openai" in model_name:
            llm = get_openai_model(streaming=True)
        else:
            llm = get_groq_model(streaming=True)

        langchain_messages: list[BaseMessage] = []
        for msg in request.messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content))
            elif msg.role == "system":
                langchain_messages.append(SystemMessage(content=msg.content))

        try:
            async for chunk in llm.astream(langchain_messages):
                content = str(chunk.content)
                if content:
                    yield f"data: {json.dumps({'content': content})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"
