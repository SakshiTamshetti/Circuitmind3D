# PeekInside (CircuitMind 3D)

An interactive, educational 3D model explorer designed to explain complex anatomical, electronic, and biological structures dynamically. The application seamlessly combines Three.js rendering with a highly robust, fault-tolerant AI backend to ensure users receive instant, accurate educational insights whenever they interact with a model component.

## 🚀 Features

- **Interactive 3D Exploration**: Built on **Three.js** to render rich `.glb` models with smooth GSAP animations and camera framing.
- **Hierarchical Navigation**: Journey seamlessly from system-level views to microscopic components (e.g., Computer Hardware -> Motherboard -> USB Ports).
- **Raycast Interaction**: Click on specific regions/meshes of the 3D models to trigger real-time AI descriptions and visual highlighting.
- **Built-in AI Assistant**: Interactive chat environment context-aware of the model you are currently exploring.

---

## 🧠 Fault-Tolerant "3-Tier" AI Architecture

To ensure speed, extreme reliability, and absolutely zero downtime or rate limit blockages, the backend AI system utilizes a custom failover router connecting multiple providers.

### The 3 Layers:
1. **Tier 1: Static Knowledge Layer (Instant)**
   - Located in the frontend: `js/knowledge.js`
   - Handles the top 90% of predictable queries (e.g., "What is a CPU?", "Left Ventricle").
   - Result: 0ms latency, zero API calls, instantly satisfying the most common clicks.

2. **Tier 2: Fast AI (Primary Engine)**
   - Powered by **Groq** using `llama-3.3-70b-versatile`.
   - Executed via `backend/ai_engine.py` using standard fast OpenAI schema requests.
   - Triggers for any unknown 3D component or live user chat prompt.

3. **Tier 3: Backup AI (Safety Net)**
   - Powered by **Google Gemini** using `gemini-2.5-flash`.
   - Managed securely by `backend/router.py`.
   - If Groq experiences rate limits (HTTP 429), runs out of quota, or goes momentarily offline, the router intercepts the failure and flawlessly redirects the exact same prompt transparently to Gemini.
   - Result: The user never experiences a runtime `HTTP 500` server crash.

*(If even the safety net fails, the engine triggers a graceful degradation message, protecting the frontend UI from breaking.)*

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, CSS variables, Three.js, GSAP.
- **Backend Core**: Python 3.10+, FastAPI, Uvicorn, Requests.
- **AI Providers**: Groq API, Google Gemini API.

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have Python 3.10+ installed.
Install backend module dependencies:
```bash
cd backend
pip install fastapi uvicorn requests python-dotenv 
```

### 2. Configure Environment Variables
You must supply API keys connecting the routing infrastructure to the LLM networks.

Create or edit `backend/.env`:
```env
GROQ_API_KEY=gsk_...your_key_here...
GEMINI_API_KEY=AIzaSy...your_key_here...
```
*(Never commit this file publicly!)*

### 3. Run the Application
The project includes a convenient batch script that concurrently spin up both the FastAPI backend and a local Python HTTP viewer.

Run directly in the root directory:
```bash
.\run.bat
```
Navigate to `http://127.0.0.1:5500` in your web browser. 

---

## 📂 Project Structure

```
├── assets/          # 3D models (.glb files) and UI images
├── backend/         # FastAPI Engine
│   ├── main.py      # Core endpoints (chat, explanation, overview)
│   ├── router.py    # Failover Decision Mesh (Groq -> Gemini)
│   ├── ai_engine.py # Stateless isolated API execution pipelines
│   └── config.py    # Environment variables and standard setups
├── js/              # Frontend Logic
│   ├── main.js      # App bootstrapper, static fallback, API fetching
│   ├── viewer.js    # Three.js viewport and raycast event listeners
│   ├── model.js     # Top-Level Topic mapping and Breadcrumb UI
│   ├── nav.js       # Navigation animations 
│   ├── knowledge.js # High-speed static answer dictionary
│   └── chat.js      # AI chat DOM injection and formatting
├── index.html       # Primary UI frame
└── run.bat          # Concurrent Bootstrapper
```
