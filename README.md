# PeekInside 3D AI Explorer

Interactive 3D scientific model explorer with real-time AI explanation powered by Gemini 1.5 Flash.

## How to Run

### Quick Start (Windows)
The easiest way to run the project is using the automated script:
1. Double-click `run.bat` in the project root directory, or run `.\run.bat` from your terminal.
2. The script will automatically start both the backend API and the frontend server, and open your default browser to `http://127.0.0.1:5500`.

*Note: You still need to configure the AI Key before using the AI features.*

### Manual Setup
If you prefer to run things manually or are not on Windows:

#### 1. Configure the AI Key
The backend requires a Gemini API key. Go to the `backend/` folder and copy `.env.example` to a new file named `.env`:
```bash
# Windows
copy .env.example .env
# Mac/Linux
cp .env.example .env
```
Open the `.env` file and replace the placeholder with your actual Gemini API key.

#### 2. Start the Backend (API)
Open a terminal in the `backend/` directory, install requirements if needed, and run `uvicorn`. Make sure to use the `--env-file` flag!
```bash
pip install fastapi uvicorn requests python-dotenv
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --env-file .env
```
The backend will be available at `http://127.0.0.1:8000`.

#### 3. Run the Frontend (Web)
You need to serve the project root via an HTTP server (due to ES module security).

**Option A: Python HTTP Server (Recommended)**
Open a **new** terminal in the project root and bind precisely to `127.0.0.1` to prevent issues:
```bash
python -m http.server 5500 --bind 127.0.0.1
```
Then open `http://127.0.0.1:5500` in your browser.

**Option B: VS Code Live Server**
Right-click `index.html` and select **"Open with Live Server"**.

## Features
- **3D Interaction**: Click on any part of the model to identify it.
- **AI Explanation**: Get instant, student-friendly explanations from Gemini.
- **Voice Feedback**: Integrated text-to-speech for all AI responses.
