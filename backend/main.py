from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import get_component_explanation

app = FastAPI(title="CircuitMind 3D Backend")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PartRequest(BaseModel):
    part: str

@app.get("/")
async def root():
    return {"message": "CircuitMind 3D Backend is running"}

@app.post("/explain-part")
async def explain_part(request: PartRequest):
    """
    Endpoint to get an AI-generated explanation for a specific hardware part.
    """
    if not request.part:
        raise HTTPException(status_code=400, detail="Part name is required")
    
    explanation = get_component_explanation(request.part)
    
    if "Error generating explanation" in explanation:
        raise HTTPException(status_code=500, detail=explanation)
        
    return {
        "part": request.part,
        "explanation": explanation
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
