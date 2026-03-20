/* ═══ nav.js — navigation, theme, sidebar, search ═══════════
   All functions assigned to window.* so inline onclick
   attributes in the HTML can call them regardless of
   script load order.
═══════════════════════════════════════════════════════════ */

window.G = function (page) {
  document.documentElement.dataset.page = page;
  window.closeMob && window.closeMob();
};

window.toggleTheme = function () {
  var h = document.documentElement;
  h.dataset.theme = h.dataset.theme === 'dark' ? 'light' : 'dark';
};

window.toggleMob = function () {
  document.getElementById('mobMenu').classList.toggle('open');
};

window.closeMob = function () {
  var m = document.getElementById('mobMenu');
  if (m) m.classList.remove('open');
};

window.toggleSide = function (id) {
  document.getElementById(id).classList.toggle('closed');
};

window.doSearch = function () {
  var v = document.getElementById('searchInput').value.trim().toLowerCase();
  var map = {
    cpu: 'CPU', gpu: 'GPU', motherboard: 'Motherboard',
    ram: 'RAM', memory: 'RAM', heart: 'Heart', biology: 'Heart',
    atom: 'Atom', carbon: 'Atom', chemistry: 'Atom'
  };
  for (var k in map) {
    if (v.indexOf(k) !== -1) { window.openModel(map[k]); return; }
  }
  window.G('library');
};
