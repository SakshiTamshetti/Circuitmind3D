/* ═══ viewer.js — timeline, 3D renderer hooks, library ══════
   Depends on: data.js (LIB_MODELS), model.js (openModel)
═══════════════════════════════════════════════════════════ */

/* ── 3D RENDERER HOOKS ──────────────────────────────────────
   These are called by the toolbar Wireframe / Auto-rotate
   buttons. Replace the console.log with your renderer calls.
─────────────────────────────────────────────────────────── */
window.toggleWireframe = function () {
  /* WIRE TO: scene.traverse(function(m) {
       if (m.isMesh) m.material.wireframe = !m.material.wireframe;
     }); */
  console.log('[CircuitMind] toggleWireframe — wire this to your scene');
};

window.toggleAutoRotate = function () {
  /* WIRE TO: controls.autoRotate = !controls.autoRotate; */
  console.log('[CircuitMind] toggleAutoRotate — wire this to your OrbitControls');
};

/* ── TIMELINE ────────────────────────────────────────────────
   The play button and scrub bar animate a progress indicator.
   Wire to your Three.js AnimationMixer:
     togglePlay  → mixer.timeScale = playing ? 1 : 0
     seekTl      → mixer.setTime(animDuration * pct / 100)
─────────────────────────────────────────────────────────── */
var _playing = false;
var _tlPct = 0;
var _raf = null;

window.togglePlay = function (btn) {
  _playing = !_playing;
  document.getElementById('playIco').innerHTML =
    '<use href="' + (_playing ? '#i-pause' : '#i-play') + '"/>';
  /* WIRE TO: mixer.timeScale = _playing ? 1 : 0; */
  if (_playing) _animTl();
  else { cancelAnimationFrame(_raf); _raf = null; }
};

function _animTl() {
  _tlPct = (_tlPct + 0.04) % 100;
  document.getElementById('tlprog').style.width = _tlPct + '%';
  var tot = 150;
  var cur = Math.round(tot * _tlPct / 100);
  document.getElementById('tltime').textContent =
    Math.floor(cur / 60) + ':' + (cur % 60 < 10 ? '0' : '') + (cur % 60) + ' / 2:30';
  _raf = requestAnimationFrame(_animTl);
}

window.seekTl = function (e, track) {
  var r = track.getBoundingClientRect();
  _tlPct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
  document.getElementById('tlprog').style.width = _tlPct + '%';
  /* WIRE TO: mixer.setTime(animDuration * _tlPct / 100); */
};

/* ── MODEL LIBRARY ───────────────────────────────────────────
   LIB_MODELS is the flat list shown on the Library page.
   Add entries here as you add models.
─────────────────────────────────────────────────────────── */
var LIB_MODELS = [
  { name: 'Intel Core i9 i9-13900K', cat: 'Hardware', sub: 'CPU', ico: 'i-cpu', badge: 'badge-b', k: 'CPU' },
  { name: 'AMD Ryzen 9 7950X Die', cat: 'Hardware', sub: 'CPU', ico: 'i-cpu', badge: 'badge-b', k: 'CPU' },
  { name: 'NVIDIA RTX 4090 GA102', cat: 'Hardware', sub: 'GPU', ico: 'i-gpu', badge: 'badge-g', k: 'GPU' },
  { name: 'AMD Radeon RX 7900 XTX', cat: 'Hardware', sub: 'GPU', ico: 'i-gpu', badge: 'badge-g', k: 'GPU' },
  { name: 'Intel Z790 Motherboard', cat: 'Hardware', sub: 'Motherboard', ico: 'i-mb', badge: 'badge-o', k: 'Motherboard' },
  { name: 'Samsung DDR5-6000 DIMM', cat: 'Hardware', sub: 'RAM', ico: 'i-ram', badge: 'badge-b', k: 'RAM' },
  { name: 'Human Heart \u2014 Anatomy', cat: 'Biology', sub: 'Cardiology', ico: 'i-heart', badge: 'badge-r', k: 'Heart' },
  { name: 'Human Lung', cat: 'Biology', sub: 'Pulmonology', ico: 'i-heart', badge: 'badge-r', k: 'Heart' },
  { name: 'Carbon Atom C-12', cat: 'Chemistry', sub: 'Atomic', ico: 'i-atom', badge: 'badge-p', k: 'Atom' },
  { name: 'Water Molecule H\u2082O', cat: 'Chemistry', sub: 'Molecular', ico: 'i-atom', badge: 'badge-p', k: 'Atom' },
  { name: 'Intel 13th Gen Cache', cat: 'Hardware', sub: 'CPU', ico: 'i-cpu', badge: 'badge-b', k: 'CPU' },
  { name: 'PCIe 5.0 NVMe SSD', cat: 'Hardware', sub: 'Storage', ico: 'i-mb', badge: 'badge-o', k: 'Motherboard' }
];

function renderLib(filter) {
  var grid = document.getElementById('modelGrid');
  if (!grid) return;
  var items = filter === 'all'
    ? LIB_MODELS
    : LIB_MODELS.filter(function (m) { return m.cat === filter; });

  grid.innerHTML = items.map(function (m) {
    return '<div class="model-card" onclick="openModel(\'' + m.k + '\')">' +
      '<div class="mc-thumb"><svg width="36" height="36" class="mc-thumb-ico"><use href="#' + m.ico + '"/></svg></div>' +
      '<div class="mc-name">' + m.name + '</div>' +
      '<div class="mc-cat">' + m.cat + ' &middot; ' + m.sub + '</div>' +
      '<div class="mc-meta"><span class="badge ' + m.badge + '">' + m.sub + '</span></div>' +
      '</div>';
  }).join('');
}

window.filterLib = function (filter, btn) {
  document.querySelectorAll('#pg-library .badge[onclick]').forEach(function (b) {
    b.style.background = 'var(--bg2)';
    b.style.borderColor = 'var(--bdr)';
    b.style.color = 'var(--t2)';
  });
  btn.style.background = 'rgba(79,142,247,.12)';
  btn.style.borderColor = 'rgba(79,142,247,.22)';
  btn.style.color = 'var(--ac)';
  renderLib(filter);
};

/* Initial render — called from main.js after DOM is ready */
window._initLibrary = function () {
  renderLib('all');
};
