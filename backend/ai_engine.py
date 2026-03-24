import time
import requests
from config import GROQ_API_KEY, GEMINI_API_KEY, MODELS, TIMEOUT_SEC

def call_groq(prompt):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {"model": MODELS["groq_fast"], "messages": [{"role": "user", "content": prompt}]}
    
    start_time = time.time()
    response = requests.post(url, headers=headers, json=data, timeout=TIMEOUT_SEC)
    latency_ms = int((time.time() - start_time) * 1000)
    
    if response.status_code in (400, 401, 403, 429, 503):
        try:
            err_msg = response.json().get("error", {}).get("message", response.text)
        except:
            err_msg = response.text
        raise Exception(f"Groq API Error ({response.status_code}): {err_msg}")
        
    response.raise_for_status()
    result = response.json()
    
    if not result.get("choices") or not result["choices"][0].get("message", {}).get("content"):
        raise ValueError("Empty or malformed response from Groq")
        
    return {
        "status": "success",
        "provider": "groq",
        "response": result["choices"][0]["message"]["content"],
        "latency_ms": latency_ms
    }

def call_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODELS['gemini_fallback']}:generateContent?key={GEMINI_API_KEY}"
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    
    start_time = time.time()
    response = requests.post(url, json=data, timeout=TIMEOUT_SEC)
    latency_ms = int((time.time() - start_time) * 1000)
    
    if response.status_code in (400, 401, 403, 429, 503):
        try:
            err_msg = response.json().get("error", {}).get("message", response.text)
        except:
            err_msg = response.text
        raise Exception(f"Gemini API Error ({response.status_code}): {err_msg}")

    response.raise_for_status()
    result = response.json()
    
    if not result.get("candidates") or not result["candidates"][0].get("content", {}).get("parts"):
        raise ValueError("Empty or malformed response from Gemini")
        
    return {
        "status": "success",
        "provider": "gemini",
        "response": result["candidates"][0]["content"]["parts"][0]["text"],
        "latency_ms": latency_ms
    }
