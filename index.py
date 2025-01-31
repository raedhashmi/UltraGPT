from flask import Flask, render_template, send_file, request, redirect
from templates.AI import AI
from templates.AI import setApiKey

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('mainPage.html')

@app.route('/<ChatUUID4>')
def conversation(ChatUUID4):
    return render_template('mainPage.html')

@app.route('/resources/<resource>')
def resource(resource):
    if resource:
        return send_file(f'./templates/{resource}')
    return redirect('/notfound')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt:
        return "Error: No prompt provided", 400
    response = AI(prompt)
    return response

@app.route('/setApiKey', methods=['POST'])
def setapikey():
    data = request.get_json()
    apiKey = data.get('apiKey')
    if not apiKey:
        return "Error: No apiKey provided", 400
    setApiKey(apiKey)
    return 'Successfully set API Key', 200

@app.route('/notfound')
def notfound(): 
    return render_template('notfound.html')

@app.route('/<path:path>')
def catch_all(path):
    return redirect('/notfound')

if __name__ == '__main__':
    app.run()