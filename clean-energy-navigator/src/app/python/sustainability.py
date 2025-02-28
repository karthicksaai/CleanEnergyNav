from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as gen_ai
import re
from datetime import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS with specific origins in production

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

gen_ai.configure(api_key=GOOGLE_API_KEY)
model = gen_ai.GenerativeModel('gemini-pro')

def analyze_sustainability(product_link):
    try:
        initial_prompt = """Analyze the environmental and sustainability aspects of this product/brand. Consider:
        1. Materials and manufacturing
        2. Energy efficiency
        3. Waste reduction
        4. Ethical sourcing
        5. Company sustainability initiatives
        Provide a comprehensive but concise analysis."""
        
        user_prompt = f"{product_link}\n{initial_prompt}"
        
        # Create a chat session
        chat = model.start_chat(history=[])
        
        # Get analysis
        analysis_response = chat.send_message(user_prompt)
        
        # Get score
        score_prompt = "Based on the above analysis, provide a sustainability score from 0-100 as a JSON number only, like this: {\"score\": 75}"
        score_response = chat.send_message(score_prompt)
        
        try:
            # Try to parse the score as JSON first
            import json
            score_data = json.loads(score_response.text)
            score = float(score_data.get('score', 0))
        except:
            # Fallback to regex if JSON parsing fails
            match = re.search(r'(\d+)', score_response.text)
            score = float(match.group(1)) if match else 0
            
        return {
            "score": min(max(score, 0), 100),  # Ensure score is between 0-100
            "analysis": analysis_response.text,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error in analyze_sustainability: {str(e)}")
        raise

@app.route('/sustainability', methods=['POST'])
def sustainability_check():
    try:
        data = request.get_json()
        if not data or 'productLink' not in data:
            return jsonify({"error": "Missing productLink"}), 400
            
        product_link = data['productLink']
        if not product_link:
            return jsonify({"error": "Product link cannot be empty"}), 400
            
        result = analyze_sustainability(product_link)
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error in sustainability_check: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)