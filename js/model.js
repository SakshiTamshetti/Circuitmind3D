let currentTopicKey = 'computer';
window.currentTopicKey = currentTopicKey;

window.openModel = function (key) {
  if (key) key = key.toLowerCase();
  var d = window.topics[key];
  if (!d) return;

  // Reset description panel
  const compDesc = document.getElementById("compDesc");
  if (compDesc) compDesc.style.display = 'none';

  currentTopicKey = key;
  window.currentTopicKey = key;

  /* Breadcrumb & Panels */
  const vbc = document.getElementById('vbc');
  if (vbc) vbc.textContent = d.title;
  
  const ptitle = document.getElementById('ptitle');
  if (ptitle) ptitle.textContent = d.title;
  
  const pcat = document.getElementById('pcat');
  if (pcat) pcat.textContent = d.cat;


  /* Load Main Model */
  if (window.loadModel) window.loadModel(d.model);

  /* Component chips */
  renderChips(d.parts);
  

  window.G('viewer');
};

window.selModel = function (el, key) {
  el.closest('.aside').querySelectorAll('.aitem').forEach(function (i) {
    i.classList.remove('on');
  });
  el.classList.add('on');
  window.openModel(key);
};

function renderChips(parts) {
  var container = document.getElementById('chips');
  if (!container) return;
  
  container.innerHTML = parts.map(function (pNames) {
    var escaped = pNames.replace(/'/g, "\\'");
    return '<span class="cchip" onclick="selChip(this,\'' + escaped + '\')">' +
      '<span class="chipdot"></span>' + pNames + '</span>';
  }).join('');
}

window.selChip = function (el, name) {
  // Highlight UI selection
  el.closest('.cchips').querySelectorAll('.cchip').forEach(function (c) {
    c.classList.remove('on');
  });
  el.classList.add('on');

  var currentTopic = window.topics[currentTopicKey];
  
  // 1. Check if clicking this part should navigate down into a sub-topic
  var subTopicKey = name.toLowerCase().replace(" ", "_");
  if (window.topics[subTopicKey] && subTopicKey !== currentTopicKey) {
      console.log("Navigating to Sub-Topic:", subTopicKey);
      window.openModel(subTopicKey);
      return; 
  }
  
  // 2. Otherwise, load the detailed sub-model if available
  if (currentTopic.detailed && currentTopic.detailed[name]) {
      console.log("Loading detailed model for:", name);
      if (window.loadModel) window.loadModel(currentTopic.detailed[name]);
  }
    
  // 3. Request AI Explanation context
  if (window.showComponentDescription) window.showComponentDescription(name);
  
  // 4. Center and zoom to the part gracefully in 3D
  if (window.focusPartByName) window.focusPartByName(name);
};
