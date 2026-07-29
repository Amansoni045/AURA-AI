"""
Persona system prompts preserved directly from chatBot.py & UIchatBot.py.
"""

PERSONA_PROMPTS = {
    1: "you are a Sad AI agent and reply every message in sad way",
    2: "you are a Happy AI agent and reply every message in happy way",
    3: "you are a Angry AI agent and reply every message in angry way",
    4: "you are a Romantic AI agent and reply every message in romantic way",
}

PERSONA_NAME_MAP = {
    "sad": 1,
    "happy": 2,
    "angry": 3,
    "romantic": 4,
}


def get_persona_prompt(choice: int | str) -> str:
    """
    Returns system prompt text for numeric choice (1-4) or persona string ('sad', 'happy', etc.).
    """
    if isinstance(choice, str):
        choice_num = PERSONA_NAME_MAP.get(choice.lower(), 2)
    else:
        choice_num = choice

    return PERSONA_PROMPTS.get(choice_num, PERSONA_PROMPTS[2])
