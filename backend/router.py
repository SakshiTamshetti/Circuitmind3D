import time
import logging
from ai_engine import call_groq, call_gemini
from config import MAX_RETRIES, GROQ_API_KEY, GEMINI_API_KEY

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Simple in-memory cache
response_cache = {}

def route_request(prompt):
    # 1. Check cache
    if prompt in response_cache:
        logger.info("Serving from cache")
        cached = response_cache[prompt].copy()
        cached["status"] = "success (cached)"
        return cached

    # 2. Try Groq (Fast AI)
    if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
        for attempt in range(MAX_RETRIES):
            try:
                logger.info(f"Attempting Groq (Try {attempt + 1})")
                result = call_groq(prompt)
                response_cache[prompt] = result
                return result
            except Exception as e:
                logger.warning(f"Groq attempt {attempt + 1} failed: {e}")
                time.sleep(1) # Base backoff before retry

    # 3. Fallback to Gemini
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_new_gemini_api_key_here":
        logger.warning("Groq unavailable or failed, triggering Gemini fallback...")
        for attempt in range(MAX_RETRIES):
            try:
                logger.info(f"Attempting Gemini (Try {attempt + 1})")
                result = call_gemini(prompt)
                result["status"] = "fallback"
                response_cache[prompt] = result
                return result
            except Exception as e:
                logger.error(f"Gemini attempt {attempt + 1} failed: {e}")
                time.sleep(1)

    # 4. Graceful Degradation
    logger.error("ALL AI providers failed. Returning graceful fallback message.")
    return {
        "status": "error",
        "provider": "none",
        "response": "AI service is temporarily unavailable. Showing basic results.",
        "latency_ms": 0
    }
