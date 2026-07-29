"""
Persona chain combining SystemMessage persona prompts and ChatMistralAI model.
Preserved from chatBot.py & persona_chatbot.py.
"""

from typing import List
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from app.models.mistral import get_mistral_model
from app.prompts.personas import get_persona_prompt
from app.schemas.chat import ChatMessageItem


def run_persona_chain(
    choice: int | str,
    user_input: str,
    history: List[ChatMessageItem] = None,
) -> str:
    """
    Executes persona chat invocation on Mistral model.
    """
    model = get_mistral_model(model_name="open-mistral-7b")
    system_text = get_persona_prompt(choice)

    messages: List[BaseMessage] = [SystemMessage(content=system_text)]

    if history:
        for msg in history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))

    messages.append(HumanMessage(content=user_input))

    response = model.invoke(messages)
    return str(response.content)
