from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from openai import OpenAI

class ChatHistory:
    def __init__(self):
        self.chat_history = []
    
    def add_message(self, role, content):
        self.chat_history.append({"role": role, "content": content})
    
    def clear(self):
        self.chat_history = []

openai_memory = ChatHistory()  # Separate memory for OpenAI

def setGoogleApiKey(apiKey: str):
    with open('templates/GOOGLE_API_KEY.txt', 'w') as f:
        f.write(apiKey)

def setOpenAiApiKey(apiKey: str):
    with open('templates/OPENAI_API_KEY.txt', 'w') as f:
        f.write(apiKey)

GOOGLE_API_KEY = open('templates/GOOGLE_API_KEY.txt').read().strip()

llm = ChatGoogleGenerativeAI(
    api_key=GOOGLE_API_KEY,
    model="gemini-1.5-flash",
    temperature=0.7,
)

memory = ConversationBufferMemory()  # Original Google memory unchanged

converstaion_chain = ConversationChain(
    llm=llm,
    memory=memory
)

OPENAI_API_KEY = open('templates/OPENAI_API_KEY.txt').read().strip()

client = OpenAI(
    api_key=OPENAI_API_KEY
)

def AI(prompt: str, loggedIn: str, ai_model: str = "gpt-4o-mini"):
    if prompt == 'delete chat':
        memory.clear()
        openai_memory.clear()
    elif loggedIn == 'true': 
        completion = client.chat.completions.create(
            model=ai_model,
            messages=[
                {"role": "user", "content": prompt},
                *openai_memory.chat_history,  # Use OpenAI-specific memory
            ]
        )
        response = completion.choices[0].message
        # Store in OpenAI history
        openai_memory.add_message("user", prompt)
        openai_memory.add_message("assistant", response.content)
        return response.content
    elif loggedIn == 'false':
        response = converstaion_chain.run({"input": prompt})
        return response