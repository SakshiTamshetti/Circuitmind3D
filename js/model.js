/* ═══ model.js — model selection, chips, component panel ════
   Depends on: data.js (COMP_DATA, PD), nav.js (G)
═══════════════════════════════════════════════════════════ */

/* Maps sidebar label text → PD key */
var selModelMap = {
  'CPU Architecture': 'CPU',
  'GPU & Graphics': 'GPU',
  'Motherboard': 'Motherboard',
  'RAM Module': 'RAM',
  'Human Heart': 'Heart',
  'Carbon Atom': 'Atom'
};

/* ── openModel ────────────────────────────────────────────
   Loads a model's metadata into the right panel and
   navigates to the viewer page.

   Also call this from your 3D renderer when a model finishes
   loading to keep the UI in sync:
     window.openModel('CPU');

   Update geometry labels after this call:
     document.getElementById('model-name-label').textContent = 'My Model';
     document.getElementById('model-poly-info').textContent  = '1200 faces';
     document.getElementById('objInfo').textContent          = '1200 faces · 2400 verts';
─────────────────────────────────────────────────────────── */
window.openModel = function (key) {
  var d = PD[key];
  if (!d) return;

  /* Breadcrumb */
  document.getElementById('vbc').textContent = d.title.split('\u2014')[0].trim();
  document.getElementById('vbc-cat').textContent = d.catFull;

  /* Viewport placeholder labels
     Override these after your real model loads */
  document.getElementById('model-name-label').textContent = d.title;
  document.getElementById('model-poly-info').textContent = d.obj;
  document.getElementById('objInfo').textContent = d.obj;

  /* Right panel header */
  document.getElementById('ptitle').textContent = d.title;
  document.getElementById('pcat').textContent = d.cat;

  /* Spec rows */
  ['sp1', 'sp2', 'sp3', 'sp4', 'sp5'].forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el && d.s[i]) el.textContent = d.s[i];
  });

  /* Performance bars */
  var perfGrp = document.getElementById('perfGrp');
  if (d.perf) {
    perfGrp.style.display = '';
    document.getElementById('perf1').textContent = d.perf[0] + ' / 100';
    document.getElementById('pbar1').style.width = d.perf[0] + '%';
    document.getElementById('perf2').textContent = d.perf[1] + ' / 100';
    document.getElementById('pbar2').style.width = d.perf[1] + '%';
  } else {
    perfGrp.style.display = 'none';
  }

  /* Component chips */
  renderChips(d.chips);
  document.getElementById('compDesc').style.display = 'none';

  /* ── NOTIFY YOUR 3D RENDERER ──────────────────────────
     Uncomment once you have a renderer:
       window.loadModel && window.loadModel(key);
  ─────────────────────────────────────────────────────── */

  window.G('viewer');
};

/* ── selModel ─────────────────────────────────────────────
   Called by sidebar .aitem onclick handlers.
─────────────────────────────────────────────────────────── */
window.selModel = function (el, name, cat, key) {
  el.closest('.aside').querySelectorAll('.aitem').forEach(function (i) {
    i.classList.remove('on');
  });
  el.classList.add('on');
  window.openModel(key);
};

/* ── renderChips ──────────────────────────────────────────
   Renders component chip buttons and auto-selects the first.
─────────────────────────────────────────────────────────── */
function renderChips(chips) {
  var container = document.getElementById('chips');
  container.innerHTML = chips.map(function (ch, i) {
    var escaped = ch.name.replace(/'/g, "\\'");
    return '<span class="cchip' + (i === 0 ? ' on' : '') + '" ' +
      'onclick="selChip(this,\'' + escaped + '\')" data-idx="' + i + '">' +
      '<span class="chipdot"></span>' + ch.name + '</span>';
  }).join('');
  if (chips.length > 0) showCompDesc(chips[0]);
}

/* ── selChip ──────────────────────────────────────────────
   Called when user clicks a component chip.
   Highlights the chip, shows description, and fires the
   3D scene highlight hook.
─────────────────────────────────────────────────────────── */
window.selChip = function (el, name) {
  el.closest('.cchips').querySelectorAll('.cchip').forEach(function (c) {
    c.classList.remove('on');
  });
  el.classList.add('on');

  /* Determine active model */
  var activeItem = document.querySelector('#vAside .aitem.on');
  var modelKey = activeItem
    ? selModelMap[activeItem.textContent.trim()] || 'CPU'
    : 'CPU';

  var chip = (COMP_DATA[modelKey] || []).find(function (c) {
    return c.name === name;
  });
  if (chip) showCompDesc(chip);

  /* ── HIGHLIGHT MESH IN YOUR 3D SCENE ──────────────────
     Uncomment once you have a Three.js scene:
       window.onComponentSelect && window.onComponentSelect(name);
  ─────────────────────────────────────────────────────── */
};

/* ── showCompDesc ─────────────────────────────────────────
   Populates and reveals the component description panel.
   You can also call this directly to programmatically
   show info for any component:
     showCompDesc({ name:'P-Cores', desc:'...', specs:[...] });
─────────────────────────────────────────────────────────── */
function showCompDesc(chip) {
  document.getElementById('compDescTitle').textContent = chip.name;
  document.getElementById('compDescBody').textContent = chip.desc;
  document.getElementById('compDescSpecs').innerHTML = chip.specs.map(function (s) {
    return '<div class="comp-spec-row">' +
      '<span class="comp-spec-k">' + s.k + '</span>' +
      '<span class="comp-spec-v">' + s.v + '</span>' +
      '</div>';
  }).join('');
  document.getElementById('compDesc').style.display = 'block';
}
