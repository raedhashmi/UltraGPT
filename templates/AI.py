from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

def setApiKey(apiKey: str):
    with open('templates/GOOGLE_API_KEY.txt', 'w') as f:
        f.write(apiKey)

GOOGLE_API_KEY = open('templates/GOOGLE_API_KEY.txt').read().strip()

llm = ChatGoogleGenerativeAI(
    api_key=GOOGLE_API_KEY,
    model="gemini-1.5-flash",
    temperature=0.7,
)

memory = ConversationBufferMemory()

converstaion_chain = ConversationChain(
    llm=llm,
    memory=memory
)

def AI(prompt: str) :
    if prompt == 'delete chat':
        memory.clear()
    else:
        response = converstaion_chain.run({"input": prompt})
        return response