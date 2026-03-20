/* ═══ chat.js — AI chat interface ═══════════════════════════
   Depends on: nav.js (G)
═══════════════════════════════════════════════════════════ */

var _msgCount = 1;

/* Quick prompts per context */
var QUICK_PROMPTS = {
  'GPU Architecture': ['Explain shader cores', 'How does VRAM bandwidth work?', 'How do RT cores work?', 'PCIe interface details', 'What is a tensor core?'],
  'Motherboard': ['What is a VRM?', 'How does PCIe routing work?', 'Explain chipset topology', 'What does the BIOS chip store?', 'What is DMI?'],
  'Human Heart': ['Explain the cardiac cycle', 'How do valves work?', 'What triggers a heartbeat?', 'Describe the coronary arteries', 'How is blood pressure generated?'],
  'Carbon Atom': ['Explain electron orbitals', 'What is electronegativity?', 'How does carbon bond?', 'Carbon vs silicon properties', 'Why is carbon tetravalent?'],
  'RAM Module': ['How does DDR5 differ from DDR4?', 'Explain latency timings', 'What is on-die ECC?', 'How is bandwidth calculated?', 'What is a DRAM refresh?']
};

/* ── swCtx ─────────────────────────────────────────────────
   Switches the active AI context (model topic).
─────────────────────────────────────────────────────────── */
window.swCtx = function (el, name, ico) {
  document.querySelectorAll('#pg-ai .aside .aitem').forEach(function (i) {
    i.classList.remove('on');
  });
  el.classList.add('on');

  var svg = '<svg width="15" height="15"><use href="#' + ico + '"/></svg>';
  document.getElementById('actxName').textContent = name;
  document.getElementById('actxIco').innerHTML = svg;
  document.getElementById('aibc').textContent = name;
  document.getElementById('ctxico').innerHTML = svg;
  document.getElementById('ctxname').textContent = name;
  document.getElementById('ctxtype').textContent = name;
  document.getElementById('cinCtx').textContent = name;

  var prompts = QUICK_PROMPTS[name] || [
    'Explain the main components',
    'How does this work?',
    'Key specifications overview',
    'Describe the architecture',
    'Compare to alternatives'
  ];
  document.querySelectorAll('.qprompt').forEach(function (btn, i) {
    if (prompts[i]) {
      btn.innerHTML = '<svg width="11" height="11" style="flex-shrink:0"><use href="#i-cr"/></svg>' + prompts[i];
    }
  });
};

/* ── sendMsg ────────────────────────────────────────────────
   Reads the textarea, adds user message, shows typing dots,
   then calls _getAIResponse() and adds the AI reply.
─────────────────────────────────────────────────────────── */
window.sendMsg = function () {
  var ta = document.getElementById('cita');
  var txt = ta.value.trim();
  if (!txt) return;
  ta.value = '';
  ta.style.height = '';

  _addMsg('usr', txt);
  setTimeout(_addTyping, 300);

  var ctx = document.getElementById('ctxname').textContent;
  _getAIResponse(txt, ctx)
    .then(function (answer) { _remTyping(); _addMsg('ai', answer); })
    .catch(function () { _remTyping(); _addMsg('ai', 'Error — check <code>_getAIResponse()</code> in <strong>chat.js</strong>.'); });
};

/* ── _getAIResponse ──────────────────────────────────────────
   REPLACE THIS STUB with your API call.

   OPTION A — Custom endpoint:
     const res = await fetch('https://your-api.com/predict', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ question: text, context: ctx })
     });
     return (await res.json()).answer;

   OPTION B — Anthropic claude-sonnet-4:
     const res = await fetch('https://api.anthropic.com/v1/messages', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-api-key': 'YOUR_API_KEY',
         'anthropic-version': '2023-06-01'
       },
       body: JSON.stringify({
         model: 'claude-sonnet-4-20250514',
         max_tokens: 1024,
         system: 'You are an expert on ' + ctx + '. Be concise and technical.',
         messages: [{ role: 'user', content: text }]
       })
     });
     return (await res.json()).content[0].text;
─────────────────────────────────────────────────────────── */
async function _getAIResponse(text, ctx) {
  /* STUB — replace above */
  return 'Connect your ML model in <strong>js/chat.js → _getAIResponse()</strong>. ' +
    'Question: "<em>' + text.substring(0, 80) + '</em>" | Context: <strong>' + ctx + '</strong>';
}

/* ── helpers ─────────────────────────────────────────────── */
function _addMsg(role, html) {
  var msgs = document.getElementById('cmsgs');
  var isU = role === 'usr';
  var d = document.createElement('div');
  d.className = 'mrow' + (isU ? ' usr' : '');

  var av = isU
    ? '<svg width="12" height="12" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 18c0-4 3.1-7 7-7s7 3 7 7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
    : '<svg width="13" height="13"><use href="#i-ai"/></svg>';

  d.innerHTML =
    '<div class="mav ' + role + '">' + av + '</div>' +
    '<div class="mbub">' +
    '<div class="mname">' + (isU ? 'You' : 'CircuitMind AI') + '</div>' +
    '<div class="mtxt">' + html + '</div>' +
    '<div class="mtime">Just now</div>' +
    '</div>';

  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  _msgCount++;
  document.getElementById('msgc').textContent = _msgCount;
}

function _addTyping() {
  var msgs = document.getElementById('cmsgs');
  var d = document.createElement('div');
  d.className = 'mrow';
  d.id = 'trow';
  d.innerHTML =
    '<div class="mav ai"><svg width="13" height="13"><use href="#i-ai"/></svg></div>' +
    '<div class="mbub"><div class="mtxt" style="padding:10px 13px">' +
    '<div class="tdots"><span></span><span></span><span></span></div>' +
    '</div></div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function _remTyping() {
  var t = document.getElementById('trow');
  if (t) t.remove();
}

window.injP = function (btn) {
  var ta = document.getElementById('cita');
  ta.value = btn.textContent.trim();
  ta.focus();
  window.autoR(ta);
};

window.clearChat = function () {
  var m = document.getElementById('cmsgs');
  while (m.children.length > 1) m.removeChild(m.lastChild);
  _msgCount = 1;
  document.getElementById('msgc').textContent = 1;
};

window.autoR = function (ta) {
  ta.style.height = '';
  ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
};
