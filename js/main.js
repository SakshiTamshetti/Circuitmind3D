import { initViewer, loadModel } from "./viewer.js";

window.loadModel = loadModel;
window.initViewer = initViewer;

let currentAiFetchId = 0;
window.currentModel = null;
window.currentComponent = null;

// Rate limiting helpers
const requestInProgress = new Map();
const lastRequestTime = new Map();
const DEBOUNCE_MS = 500; // Prevent duplicate clicks within 500ms

/**
 * Retry helper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms (doubles each retry: 1000, 2000, 4000, etc.)
 * @returns {Promise}
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Retry attempt ${attempt + 1}/${maxRetries} in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}

function showExplanation(text) {
    const panel = document.getElementById("infoPanel");
    if (panel) {
        panel.innerHTML = `<strong>AI Insight:</strong> ${text}`;
    }

    const compDesc = document.getElementById("compDesc");
    const compDescTitle = document.getElementById("compDescTitle");
    const compDescBody = document.getElementById("compDescBody");
    
    if (compDesc && compDescTitle && compDescBody) {
        compDesc.style.display = 'block';
        compDescTitle.textContent = "Description";
        compDescBody.innerHTML = text;
    }
}
window.showExplanation = showExplanation;

function speak(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.pitch = 1.1;
        speech.rate = 1;
        speechSynthesis.speak(speech);
    }
}

window.showComponentDescription = async function(partName) {
    const topicKey = window.currentTopicKey || 'computer';
    const topic = window.topics[topicKey];
    if (!topic) return;
    
    // Debounce: prevent rapid repeated requests for the same part
    const requestKey = `part:${topicKey}:${partName}`;
    const now = Date.now();
    const lastTime = lastRequestTime.get(requestKey) || 0;
    
    if (now - lastTime < DEBOUNCE_MS) {
        console.log("Request debounced - too soon");
        return;
    }
    
    // Prevent simultaneous identical requests
    if (requestInProgress.get(requestKey)) {
        console.log("Request already in progress");
        return;
    }
    
    lastRequestTime.set(requestKey, now);
    requestInProgress.set(requestKey, true);
    
    window.currentModel = topicKey;
    window.currentComponent = partName;
    
    currentAiFetchId++;
    const fetchId = currentAiFetchId;

    console.log("Component clicked:", partName, "in topic:", topic.title);
    showExplanation("Loading description...");
    
    try {
        const explanation = await retryWithBackoff(
            async () => {
                const res = await fetch("http://127.0.0.1:8000/explain-part", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ part: partName, model: topic.title })
                });
                
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            },
            3,
            500
        );
        
        if (fetchId !== currentAiFetchId) return;

        showExplanation(explanation.explanation);
        speak(explanation.explanation);

    } catch (err) {
        if (fetchId !== currentAiFetchId) return;
        console.error("Error fetching explanation:", err);
        showExplanation("Could not fetch description. Please try again.");
    } finally {
        requestInProgress.delete(requestKey);
    }
};

window.showModelDescription = async function(modelKey) {
    window.currentModel = modelKey;
    window.currentComponent = null;

    // Debounce prevention
    const requestKey = `overview:${modelKey}`;
    const now = Date.now();
    const lastTime = lastRequestTime.get(requestKey) || 0;
    
    if (now - lastTime < DEBOUNCE_MS) {
        console.log("Request debounced - too soon");
        return;
    }
    
    if (requestInProgress.get(requestKey)) {
        console.log("Request already in progress");
        return;
    }
    
    lastRequestTime.set(requestKey, now);
    requestInProgress.set(requestKey, true);

    currentAiFetchId++;
    const fetchId = currentAiFetchId;

    const topic = window.topics ? window.topics[modelKey] : null;
    const modelName = topic ? topic.title : modelKey;

    console.log("Loading model overview for:", modelName);
    showExplanation("Loading overview...");
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    
    try {
        const data = await retryWithBackoff(
            async () => {
                const res = await fetch("http://127.0.0.1:8000/model-overview", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ model: modelName })
                });
                
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            },
            3,
            500
        );
        
        if (fetchId !== currentAiFetchId) return;

        showExplanation(data.overview);
        speak(data.overview);
    } catch (err) {
        if (fetchId !== currentAiFetchId) return;
        console.error("Error fetching overview:", err);
        showExplanation("Could not fetch overview. Please try again.");
    } finally {
        requestInProgress.delete(requestKey);
    }
};

function initApp() {
    initViewer();
    if (window.openModel) {
        window.openModel('computer');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
