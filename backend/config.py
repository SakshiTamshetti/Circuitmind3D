import os
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

MODELS = {
    "groq_fast": "llama-3.3-70b-versatile",
    "gemini_fallback": "gemini-2.5-flash"
}

TIMEOUT_SEC = 5
MAX_RETRIES = 2
