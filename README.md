# PeekInside 3D AI Explorer

Interactive 3D scientific model explorer with real-time AI explanation powered by Gemini 1.5 Flash.

---

> [!WARNING]
> **API Note:** The Gemini AI backend is currently facing some issues (rate limits / connectivity). AI explanations and chat responses may fail or load slowly. We are working on a fix. In the meantime, the app will still load 3D models and let you explore them — only the AI response features may not work as expected.

---

## How to Run

### Quick Start (Windows)
The easiest way to run the project is using the automated script:
1. Double-click `run.bat` in the project root directory, or run `.\run.bat` from your terminal.
2. The script will automatically start both the backend API and the frontend server, and open your default browser to `http://127.0.0.1:5500`.

*Note: You still need to configure the AI Key before using the AI features.*

---

> [!TIP]
> **Quickest way to run:** Just execute `.\run.bat` (Windows) from the project root — it starts both the backend and frontend automatically and opens the browser for you.

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

#### 2. Install Dependencies
```bash
pip install fastapi uvicorn requests python-dotenv
```

#### 3. Start the Backend (API)
Open a terminal in the `backend/` directory and run:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --env-file .env
```
The backend will be available at `http://127.0.0.1:8000`.

#### 4. Run the Frontend (Web)
You need to serve the project root via an HTTP server (due to ES module security).

**Option A: Python HTTP Server (Recommended)**
Open a **new** terminal in the project root:
```bash
python -m http.server 5500 --bind 127.0.0.1
```
Then open `http://127.0.0.1:5500` in your browser.

**Option B: VS Code Live Server**
Right-click `index.html` and select **"Open with Live Server"**.

---

## Features
- **3D Interaction**: Click on any part of the model to identify it.
- **AI Explanation**: Get instant, student-friendly explanations from Gemini.
- **Voice Feedback**: Integrated text-to-speech for all AI responses.
- **Hierarchical Exploration**: Navigate from system → component → sub-component level.
