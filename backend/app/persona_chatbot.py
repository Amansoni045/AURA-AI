from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage

load_dotenv()

SYSTEM_PROMPTS = {
    1: "you are a Sad AI agent and reply every message in sad way",
    2: "you are a Happy AI agent and reply every message in happy way",
    3: "you are a Angry AI agent and reply every message in angry way",
    4: "you are a Romantic AI agent and reply every message in romantic way"
}

def get_initial_messages(choice: int) -> list:
    system_prompt = SYSTEM_PROMPTS.get(choice, SYSTEM_PROMPTS[2])
    return [SystemMessage(content=system_prompt)]

def generate_response(model, messages: list, user_input: str) -> str:
    messages.append(HumanMessage(content=user_input))
    response = model.invoke(messages)
    messages.append(AIMessage(content=response.content))
    return response.content

if __name__ == "__main__":
    model = ChatMistralAI(model="open-mistral-7b")

    print("choose your ai mode")
    print("press 1 for Sad AI agent")
    print("press 2 for Happy AI agent")
    print("press 3 for Angry AI agent")
    print("press 4 for Romantic AI agent")

    choice = int(input("tell your response:- "))
    messages = get_initial_messages(choice)

    while True:
        print("----------------Welcome type 0 to exit the application------------")
        prompt = input("YOU : ")

        if prompt == "0":
            break

        reply = generate_response(model, messages, prompt)
        print("MISTRAL : ", reply)

    print(messages)
