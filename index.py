from flask import Flask, send_file, redirect, request
from templates.AI import AI
from templates.AI import setGoogleApiKey
from templates.AI import setOpenAiApiKey

app = Flask(__name__)

@app.route('/')
def index():
    return send_file('templates/index.html')

@app.route('/<ChatUUID4>')
def conversation(ChatUUID4):
    return send_file('templates/index.html')

@app.route('/resources/<resource>')
def resource(resource):
    if resource:
        return send_file(f'./templates/{resource}')
    return redirect('/notfound')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    prompt = data.get('prompt')
    loggedIn = data.get('loggedIn')
    if not prompt:
        return "Error: No prompt provided", 400
    response = AI(prompt, loggedIn)
    if loggedIn == 'true':
        return response.content
    else:
        return response

@app.route('/setGoogleApiKey', methods=['POST'])
def set_google_api_key():
    data = request.get_json()
    apiKey = data.get('apiKey') 
    if not apiKey:
        return "Error: No apiKey provided", 400
    setGoogleApiKey(apiKey)
    return 'Successfully set Google API Key', 200

@app.route('/setOpenAiApiKey', methods=['POST'])
def set_open_ai_api_key():
    data = request.get_json()
    apiKey = data.get('apiKey')
    if not apiKey:
        return "Error: No apiKey provided", 400
    setOpenAiApiKey(apiKey)
    return 'Successfully set OpenAI API Key', 200

@app.route('/signUp')
def signup():
    return send_file('templates/signUp.html')

@app.route('/login')
def login():    
    return send_file('templates/login.html')

@app.route('/notfound')
def notfound(): 
    return send_file('templates/notfound.html')

@app.route('/<path:path>')
def catch_all(path):
    return redirect('/notfound')

if __name__ == '__main__':
    app.run()