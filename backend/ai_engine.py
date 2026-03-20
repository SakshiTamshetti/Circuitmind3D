import google.generativeai as genai
import os

# API Key provided by user
API_KEY = "AIzaSyBN6iGPOm9wlpAYniMsJE0LoyHfjHSF7xI"

genai.configure(api_key=API_KEY)

def get_component_explanation(part_name: str):
    """
    Fetches a student-friendly explanation for a computer hardware part using Gemini.
    """
    model = genai.GenerativeModel('gemini-flash-latest')
    
    prompt = f"""
    You are an expert computer architecture teacher. 
    Explain the function of the following computer part in a clear, concise, and student-friendly way: {part_name}.
    - Focus on what it does and why it's important.
    - Use simple analogies if possible.
    - Keep the explanation under 100 words.
    - Style: Calm and professional.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating explanation: {str(e)}"

if __name__ == "__main__":
    # Test the engine
    test_part = "ALU"
    print(f"Explaining {test_part}:")
    print(get_component_explanation(test_part))
