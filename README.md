# CircuitMind 3D

![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=for-the-badge&logo=fastapi)
![AI Powered](https://img.shields.io/badge/AI-Groq%20%7C%20Gemini-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> 🧠 An interactive 3D learning playground where curiosity meets cutting-edge tech.

---

## 📖 About

**CircuitMind3D** is an interactive 3D learning playground where curiosity meets cutting-edge tech. Whether you're exploring the human heart, a computer motherboard, or microscopic biology, this app lets you *click, explore, and instantly understand* complex structures like never before.

---

## 🚀 What Makes It Awesome?

### 🧊 Interactive 3D Exploration

Dive into beautifully rendered `.glb` models powered by **Three.js**, enhanced with smooth **GSAP animations** and intelligent camera movements. It’s not just viewing—it’s experiencing.

### 🧭 Smart Navigation

Start big, go small. Seamlessly zoom from entire systems down to tiny components:  
**Computer → Motherboard → USB Port → Internal Pins**

### 🎯 Click-to-Learn (Raycasting Magic)

Click any part of a model and *boom*—you get an instant, AI-powered explanation with visual highlighting. Learning has never been this direct.

### 🤖 Built-in AI Guide

Got questions? There’s a chat assistant that *knows exactly what you're looking at* and helps you understand it better in real time.

---



## 🧠 Fault-Tolerant "3-Tier" AI Architecture

To ensure speed, extreme reliability, and absolutely zero downtime or rate limit blockages, the backend AI system utilizes a custom failover router connecting multiple providers.

<img width="500" height="500" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/76f52d59-1011-439b-8b87-337741c5dcec" />

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
---
## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to add.
