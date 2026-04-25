import google.generativeai as genai
from openai import AsyncOpenAI
from app.core.config import settings
from app.models.chat import Message
from typing import AsyncGenerator
import json

class LLMService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
        
        self.groq_client = None
        if settings.GROQ_API_KEY:
            self.groq_client = AsyncOpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=settings.GROQ_API_KEY
            )
        
        self.openai_client = None
        if settings.OPENAI_API_KEY:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
        self.mistral_client = None
        if settings.MISTRAL_API_KEY:
            self.mistral_client = AsyncOpenAI(
                base_url="https://api.mistral.ai/v1",
                api_key=settings.MISTRAL_API_KEY
            )
        
    async def stream_chat(self, messages: list[Message], model_name: str = "gemini-2.0-flash", temperature: float = 0.7) -> AsyncGenerator[str, None]:
        try:
            # Route based on model name
            if "gemini" in model_name:
                async for chunk in self._stream_gemini(messages, model_name, temperature):
                    yield chunk
            elif "llama" in model_name or "mixtral" in model_name or "deepseek" in model_name:
                async for chunk in self._stream_openai_compatible(self.groq_client, messages, model_name, temperature):
                    yield chunk
            elif "mistral" in model_name or "pixtral" in model_name:
                async for chunk in self._stream_openai_compatible(self.mistral_client, messages, model_name, temperature):
                    yield chunk
            elif "gpt" in model_name:
                async for chunk in self._stream_openai_compatible(self.openai_client, messages, model_name, temperature):
                    yield chunk
            else:
                yield f"data: {json.dumps({'error': f'Model {model_name} not supported'})}\n\n"
                yield "data: [DONE]\n\n"
                
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    async def _stream_gemini(self, messages: list[Message], model_name: str, temperature: float):
        model = genai.GenerativeModel(model_name)
        history = []
        for msg in messages[:-1]:
            role = "user" if msg.role == "user" else "model"
            history.append({"role": role, "parts": [msg.content]})
        
        last_message = messages[-1].content
        chat = model.start_chat(history=history)
        response = chat.send_message(last_message, stream=True, generation_config=genai.types.GenerationConfig(
            temperature=temperature,
        ))
        
        for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'content': chunk.text})}\n\n"
        yield "data: [DONE]\n\n"

    async def _stream_openai_compatible(self, client, messages: list[Message], model_name: str, temperature: float):
        if not client:
            yield f"data: {json.dumps({'error': 'API key not configured for this provider'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        response = await client.chat.completions.create(
            model=model_name,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            temperature=temperature,
            stream=True
        )
        
        async for chunk in response:
            content = chunk.choices[0].delta.content
            if content:
                yield f"data: {json.dumps({'content': content})}\n\n"
        yield "data: [DONE]\n\n"

llm_service = LLMService()
