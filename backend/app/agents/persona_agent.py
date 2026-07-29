"""
Persona Agent managing multi-turn emotional persona interactions.
Preserved from chatBot.py & persona_chatbot.py.
"""

from typing import List, Dict, Any
from app.chains.persona_chain import run_persona_chain
from app.schemas.chat import ChatMessageItem


class PersonaAgent:
    """
    Persona Agent class executing persona chat turns.
    """

    def __init__(self, choice: int | str = 2):
        self.choice = choice

    def respond(self, user_input: str, history: List[ChatMessageItem] = None) -> str:
        """
        Invokes persona chain response.
        """
        return run_persona_chain(
            choice=self.choice,
            user_input=user_input,
            history=history,
        )


def process_persona_chat(choice: int | str, user_input: str) -> str:
    """
    Function entrypoint for persona chat execution.
    """
    agent = PersonaAgent(choice=choice)
    return agent.respond(user_input=user_input)
