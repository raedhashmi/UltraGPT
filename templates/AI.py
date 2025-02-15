from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from openai import OpenAI

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

memory = ConversationBufferMemory()

converstaion_chain = ConversationChain(
    llm=llm,
    memory=memory
)

OPENAI_API_KEY = open('templates/OPENAI_API_KEY.txt').read().strip()

client = OpenAI(
  api_key=OPENAI_API_KEY
)

def AI(prompt: str, loggedIn: str) :
    if prompt == 'delete chat':
        memory.clear()
    elif loggedIn == 'true': 
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            store=True,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        response = completion.choices[0].message
        return response
    else:
        response = converstaion_chain.run({"input": prompt})
        return response