# app.py (Flask app)
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv
import os
import google.generativeai as gen_ai
import re

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (for development)

# Read your Google API key from environment variables (secure!)
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

# Configure Google Gemini-Pro AI model
gen_ai.configure(api_key=GOOGLE_API_KEY)
model = gen_ai.GenerativeModel('gemini-pro')

# ***System Prompt***
SYSTEM_PROMPT = """You are a helpful and informative chatbot assistant specialized in sustainability and clean energy. 
You are talking with user to assist them in their journey to sustainability and clean energy.
Only answer with the most accurate and helpful information, and you must not answer anything unrelated to sustainability and clean energy.
Base all your responses on these criteria only. If you are asked with anything unrelated, refuse to answer.
Please, take the role and keep talking.
"""

def generate_response(user_message):
    chat_session = model.start_chat(history=[{
        "role": "user",
        "parts": [SYSTEM_PROMPT]
    }])
    gemini_response = chat_session.send_message(user_message)
    return gemini_response.text

@app.route('/chatbot', methods=['POST'])
def chatbot_endpoint():
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Missing message"}), 400

    try:
        gemini_response = generate_response(user_message)
        return jsonify({"response": gemini_response}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)