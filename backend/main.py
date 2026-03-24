from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import router

app = FastAPI(title="PeekInside 3D Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PeekInside 3D Backend is running"}

@app.post("/explain-part")
def explain(data: dict):
    part = data.get("part", "").strip().lower()
    model = data.get("model", "").strip().lower()

    prompt = f"Explain the {part} in a {model} in simple terms. Keep it short (3-5 sentences)."
    result = router.route_request(prompt)

    return {"explanation": result["response"], "meta": result}

@app.post("/model-overview")
def model_overview(data: dict):
    model = data.get("model", "").strip().lower()

    prompt = f"Explain what a {model} is, how it works, and its role in simple terms. Keep it short (3-5 sentences)."
    result = router.route_request(prompt)

    return {"overview": result["response"], "meta": result}

@app.post("/chat")
def chat(data: dict):
    question = data.get("question", "").strip()
    context = data.get("context", "General").strip()

    prompt = (
        f"You are PeekInside AI, an expert educational assistant for the topic: {context}. "
        f"Answer the following question clearly and concisely in 3-5 sentences. "
        f"Be friendly, informative, and beginner-friendly.\n\nQuestion: {question}"
    )
    result = router.route_request(prompt)

    return {"answer": result["response"], "meta": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
