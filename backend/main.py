from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import get_explanation, persistent_cache, save_persistent_cache
import asyncio
import threading

app = FastAPI(title="PeekInside 3D Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use persistent cache from ai_engine module
cache = persistent_cache
cache_lock = threading.Lock()

@app.get("/")
async def root():
    return {"message": "PeekInside 3D Backend is running"}

@app.post("/explain-part")
def explain(data: dict):
    part = data.get("part", "").strip().lower()
    model = data.get("model", "").strip().lower()

    cache_key = f"part:{model}:{part}"
    
    # Check cache first
    with cache_lock:
        if cache_key in cache:
            return {"explanation": cache[cache_key]}

    prompt = f"Explain the {part} in a {model} in simple terms. Keep it short (3-5 sentences)."
    explanation = get_explanation(prompt)

    # Save to both memory and persistent cache
    with cache_lock:
        cache[cache_key] = explanation
        save_persistent_cache(cache)
    
    return {"explanation": explanation}

@app.post("/model-overview")
def model_overview(data: dict):
    model = data.get("model", "").strip().lower()

    cache_key = f"overview:{model}"
    
    # Check cache first
    with cache_lock:
        if cache_key in cache:
            return {"overview": cache[cache_key]}

    prompt = f"Explain what a {model} is, how it works, and its role in simple terms. Keep it short (3-5 sentences)."
    overview = get_explanation(prompt)

    # Save to both memory and persistent cache
    with cache_lock:
        cache[cache_key] = overview
        save_persistent_cache(cache)
    
    return {"overview": overview}

@app.post("/chat")
def chat(data: dict):
    question = data.get("question", "").strip()
    context = data.get("context", "General").strip()

    cache_key = f"chat:{context.lower()}:{question.lower()}"
    
    # Check cache first
    with cache_lock:
        if cache_key in cache:
            return {"answer": cache[cache_key]}

    prompt = (
        f"You are PeekInside AI, an expert educational assistant for the topic: {context}. "
        f"Answer the following question clearly and concisely in 3-5 sentences. "
        f"Be friendly, informative, and beginner-friendly.\n\nQuestion: {question}"
    )
    answer = get_explanation(prompt)

    # Save to both memory and persistent cache
    with cache_lock:
        cache[cache_key] = answer
        save_persistent_cache(cache)
    
    return {"answer": answer}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
