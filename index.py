from flask import Flask, render_template, send_file, request, redirect
from templates.AI import AI

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
    data = request.get_json()  # Retrieve JSON data from the request
    prompt = data.get('prompt')  # Get the prompt from the JSON data
    if not prompt:
        return "Error: No prompt provided", 400
    response = AI(prompt)  # Call the AI function with the prompt
    return response

@app.route('/notfound')
def notfound(): 
    return render_template('notfound.html')

@app.route('/<path:path>')
def catch_all(path):
    return redirect('/notfound')

if __name__ == '__main__':
    app.run()