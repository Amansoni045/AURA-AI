from dotenv import load_dotenv 
import os

load_dotenv()

from langchain.chat_models import init_chat_model 

def get_model():
    """Returns the initialized LangChain chat model."""
    # Using Groq (free tier) — switch back to "gpt-4.1" once OpenAI billing is set up
    return init_chat_model("llama-3.3-70b-versatile", model_provider="groq")

if __name__ == "__main__":
    # Test execution
    model = get_model()
    result = model.invoke("what is cricket?")
    print(result.content)
