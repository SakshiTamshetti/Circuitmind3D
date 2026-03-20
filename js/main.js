/* ═══ main.js — app initialisation ══════════════════════════
   Runs after all other scripts have loaded.
   Depends on: viewer.js (_initLibrary), model.js (openModel)
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  /* Render the model library grid */
  window._initLibrary && window._initLibrary();

  /* Load the default model into the viewer panel */
  window.openModel('CPU');
});
