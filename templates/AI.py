from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
import tqdm

llm = ChatGoogleGenerativeAI(
    api_key=open('GOOGLE_API_KEY'),
    model="gemini-1.5-flash",
    temperature=0.7
)

memory = ConversationBufferMemory()

converstaion_chain = ConversationChain(
    llm=llm,
    memory=memory
)

def AI(prompt) :
    if prompt == 'delete chat':
        memory.clear()
    else:
        response = converstaion_chain.invoke({"input": prompt})
        return response.text