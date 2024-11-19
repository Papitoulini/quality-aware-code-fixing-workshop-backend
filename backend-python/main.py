# backend-python/main.py
from flask import Flask, request, jsonify
from llm.LLM import LLMHandler
import os
from dotenv import load_dotenv
import requests
from llm.aws_login.login import login_to_aws_sso

load_dotenv()

app = Flask(__name__)

@app.route('/api/send_message', methods=['POST'])
def send_message():
    data = request.json
    messages = data.get('messages')
    model = data.get('model')
    
    if not messages:
        return jsonify({'error': 'No message provided'}), 400

    handler = LLMHandler(model)
    response = handler.send_message(messages)
    print(response)
    return jsonify({'response': response}), 200

if __name__ == '__main__':
    print(os.environ.get("AWS_SSO_USERNAME"))
    login_to_aws_sso(os.environ.get("AWS_SSO_USERNAME"), os.environ.get("AWS_SSO_PASSWORD"))
    app.run(host='0.0.0.0', port=5000, debug=True)