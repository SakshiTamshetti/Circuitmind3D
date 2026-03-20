import { initViewer, loadModel } from "./viewer.js";

window.loadModel = loadModel;
window.initViewer = initViewer;

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

// GLOBAL function (used in viewer.js and model.js)
window.handlePartClick = async function(partName) {
    const topicKey = window.currentTopicKey || 'CPU';
    const topic = TOPICS[topicKey];
    
    console.log("Handling click for:", partName, "in topic:", topic.title);
    
    try {
        const res = await fetch("http://127.0.0.1:8000/explain-part", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                part: partName,
                model: topic.title
            })
        });

        const data = await res.json();

        showExplanation(data.explanation);
        speak(data.explanation);

    } catch (err) {
        console.error("Error fetching explanation:", err);
        showExplanation("Connection error. Is the AI server running?");
    }
};

function showExplanation(text) {
    const panel = document.getElementById("infoPanel");
    if (panel) {
        panel.innerHTML = `<strong>AI Insight:</strong> ${text}`;
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Stop current speaking
        const speech = new SpeechSynthesisUtterance(text);
        speech.pitch = 1.1;
        speech.rate = 1;
        speechSynthesis.speak(speech);
    }
}
