from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from openai import OpenAI
import time
import os

class ChatHistory:
    def __init__(self):
        self.chat_history = []
    
    def add_message(self, role, content):
        self.chat_history.append({"role": role, "content": content})
    
    def clear(self):
        self.chat_history = []

openai_memory = ChatHistory()

def set_google_api_key(api_key: str):
    with open(os.path.join(os.getcwd(), 'templates', 'GOOGLE_API_KEY.txt'), 'w') as f:
        f.write(api_key)

def set_openai_api_key(api_key: str):
    with open(os.path.join(os.getcwd(), 'templates', 'OPENAI_API_KEY.txt'), 'w') as f:
        f.write(api_key)

GOOGLE_API_KEY = open(os.path.join(os.getcwd(), 'templates', 'GOOGLE_API_KEY.txt')).read().strip()
OPENAI_API_KEY = open(os.path.join(os.getcwd(), 'templates', 'OPENAI_API_KEY.txt')).read().strip()

llm = ChatGoogleGenerativeAI(
    api_key=GOOGLE_API_KEY,
    model="gemini-1.5-flash",
    temperature=0.7,
)

memory = ConversationBufferMemory()  # Original Google memory unchanged

conversation_chain = ConversationChain(
    llm=llm,
    memory=memory
)

client = OpenAI(api_key=OPENAI_API_KEY)

def generate(prompt: str, logged_in: str, ai_model: str):
    if prompt == 'delete chat':
        memory.clear()
        openai_memory.clear()
        yield "Chat history cleared."
        return

    if logged_in == 'true':
        messages = [
            *openai_memory.chat_history,
            {"role": "user", "content": prompt}
        ]
        completion = client.chat.completions.create(
            model=ai_model,
            messages=messages,
            stream=True
        )
        for chunk in completion:
            delta = chunk.choices[0].delta.content or ''
            if delta:
                yield delta
                time.sleep(0.05)  # 50ms delay between words
    elif logged_in == 'false':
        response = conversation_chain.invoke(input=prompt)
        if isinstance(response, dict) and 'response' in response:
            # Split the response into words and yield with delay
            words = response['response'].split()
            for word in words:
                yield word + " "
                time.sleep(0.05)  # 100ms delay between words
        else:
            # Split string response into words
            words = str(response).split()
            for word in words:
                yield word + " "
                time.sleep(0.05)
    else:
        yield "Invalid login status."

if __name__ == "__main__":
    for chunk in generate("Hello", "true", 'gpt-4o'):
        print(chunk, end='', flush=True)