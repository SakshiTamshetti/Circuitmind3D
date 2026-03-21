import requests
import os
import time
import json
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Persistent cache to survive server restarts
CACHE_FILE = Path(__file__).parent / "response_cache.json"

def load_persistent_cache():
    """Load cache from disk if available"""
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_persistent_cache(cache):
    """Save cache to disk"""
    try:
        with open(CACHE_FILE, 'w') as f:
            json.dump(cache, f)
    except:
        pass

persistent_cache = load_persistent_cache()

def get_explanation(prompt, retries=5, base_backoff=1):
    """Get AI explanation with improved retry strategy
    
    Uses exponential backoff with increased retry attempts.
    Handles 429 (rate limit) and 503 (unavailable) errors.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    for attempt in range(retries):
        try:
            # Better backoff: 1s, 2s, 4s, 8s, 16s
            if attempt > 0:
                wait_time = base_backoff * (2 ** (attempt - 1))
                print(f"[Rate Limited] Retrying in {wait_time}s... (attempt {attempt}/{retries})")
                time.sleep(wait_time)

            response = requests.post(url, json=data, timeout=30)

            # Handle rate limiting
            if response.status_code == 429:
                if attempt == retries - 1:
                    return "The AI is temporarily rate limited. Please wait and try again in a moment."
                continue

            # Handle service unavailable
            if response.status_code == 503:
                if attempt == retries - 1:
                    return "The AI service is temporarily unavailable. Please try again shortly."
                continue

            response.raise_for_status()
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]

        except requests.exceptions.Timeout:
            if attempt == retries - 1:
                return "The AI is taking too long to respond. Please try again."
            continue
        except requests.exceptions.ConnectionError:
            if attempt == retries - 1:
                return "Connection error. Please check your internet and try again."
            continue
        except Exception as e:
            if attempt == retries - 1:
                return "Could not get a response right now. Please try again in a moment."
            continue

    return "The AI is temporarily rate limited. Please wait and try again."
