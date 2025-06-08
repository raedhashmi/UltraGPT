from flask import Flask, send_file, redirect, request, Response
from templates.generator import generate
from templates.generator import set_google_api_key
from templates.generator import set_openai_api_key
import webview
import time
import os

app = Flask(__name__)

def updater():
    os.startfile('updater.py')
    print('\033[32mUpdater started!\033[0m')

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
    logged_in = data.get('loggedIn')
    ai_model = data.get('ai_model')
    if not prompt:
        return "Error: No prompt provided", 400
    def generate_stream():
        for chunk in generate(prompt, logged_in, ai_model):
            yield chunk
    return Response(generate_stream(), mimetype='text/plain')

@app.route('/setGoogleApiKey', methods=['POST'])
def set_google_api_key():
    data = request.get_json()
    apiKey = data.get('apiKey') 
    if not apiKey:
        return "Error: No apiKey provided", 400
    set_google_api_key(apiKey)
    return 'Successfully set Google API Key', 200

@app.route('/setOpenAiApiKey', methods=['POST'])
def set_open_ai_api_key():
    data = request.get_json()
    apiKey = data.get('apiKey')
    if not apiKey:
        return "Error: No apiKey provided", 400
    set_openai_api_key(apiKey)
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

@app.route('/closeApp', methods=['POST'])
def close_app():
    window.destroy()
    print('\033[31mClosed application!\033[37m')
    return 'success', 200

if __name__ == '__main__':
    window = webview.create_window('UltraGPT', app, fullscreen=True, frameless=True, http_port=8000)
    print('\033[32mApplication Started. Press CTRL+Q in application to exit at any time!\033[0m')
    time.sleep(2)
    print('\033[2mApplication accessible at http://localhost:8000\033[0m')
    webview.start(http_port=8000) # This has been commmented to avoid problems with Mac Simmulation's in-built UltraGPT rendering logic. Don't know about Mac Simulation? Check out https://github.com/raedhashmi/MacSimulation
    # app.run() This will run it in the browser instead of the webview window