from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import get_explanation

app = FastAPI(title="CircuitMind 3D Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CircuitMind 3D Backend is running"}

@app.post("/explain-part")
def explain(data: dict):
    part = data.get("part", "")
    model = data.get("model", "")

    prompt = f"""
    Explain the {part} in a {model} in simple terms.
    Explain what it does and why it is important.
    Keep it short and beginner-friendly.
    """

    explanation = get_explanation(prompt)

    return {"explanation": explanation}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
