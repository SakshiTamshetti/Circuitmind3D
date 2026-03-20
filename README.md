# PeekInside 3D AI Explorer

Interactive 3D scientific model explorer with real-time AI explanation powered by Gemini 1.5 Flash.

## How to Run

### 1. Start the Backend (API)
Open a terminal in the `backend/` directory and run:
```bash
pip install fastapi uvicorn requests
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
The backend will be available at `http://127.0.0.1:8000`.

### 2. Run the Frontend (Web)
You need to serve the project root via an HTTP server (due to ES module security).

**Option A: Python HTTP Server**
Open a terminal in the project root and run:
```bash
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

**Option B: VS Code Live Server**
Right-click `index.html` and select **"Open with Live Server"**.

## Features
- **3D Interaction**: Click on any part of the model to identify it.
- **AI Explanation**: Get instant, student-friendly explanations from Gemini.
- **Voice Feedback**: Integrated text-to-speech for all AI responses.
