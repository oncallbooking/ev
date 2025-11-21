// js/app.js
// Frontend logic: loads branches.json, renders list and map, implements search

let map, markersLayer;

// Helper: fetch branches JSON
async function fetchBranches(){
  const res = await fetch('data/branches.json');
  return res.ok ? res.json() : [];
}

function initMap(center = [22.0, 79.0], zoom = 5){
  map = L.map('map', {zoomControl:true}).setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function addMarkers(branches){
  markersLayer.clearLayers();
  branches.forEach(b => {
    if(!b.lat || !b.lon) return;
    const popupHtml = `
      <div style="font-weight:700">${b.name}</div>
      <div class="muted">${b.city} • PIN ${b.pin}</div>
      <div style="margin-top:6px"><span class="badge">ETA: ${b.eta}</span> <span class="badge">${b.contact}</span></div>
      <div style="margin-top:8px"><button class="btn-primary" onclick="bookFor(${b.id})">Book</button></div>
    `;
    const m = L.marker([b.lat,b.lon]).bindPopup(popupHtml);
    markersLayer.addLayer(m);
  });
}

function renderBranchesList(branches){
  const container = document.getElementById('branchList');
  container.innerHTML = '';
  branches.forEach(b => {
    const el = document.createElement('div');
    el.className = 'branch';
    el.innerHTML = `
      <img src="${b.img}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:10px" alt="${b.city}">
      <h4>${b.name}</h4>
      <div class="muted">${b.city} • PIN ${b.pin}</div>
      <div style="margin-top:8px"><span class="badge">ETA: ${b.eta}</span><span class="badge">${b.contact}</span></div>
    `;
    el.addEventListener('click', () => {
      if(map && b.lat && b.lon){
        map.setView([b.lat,b.lon], 12);
      }
    });
    container.appendChild(el);
  });
}

function bookFor(id){
  alert('Open booking flow for branch id: ' + id + ' (implement backend booking API)');
}

// Search logic (client-side)
function setupSearch(branches){
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const result = document.getElementById('searchResult');

  async function doSearch(){
    const q = searchInput.value.trim();
    if(!q){ result.textContent = 'Please enter a PIN code or city name.'; return; }
    const found = branches.filter(b => b.pin === q || b.city.toLowerCase().includes(q.toLowerCase()));
    if(found.length){
      result.innerHTML = `<strong>${found.length} branch(es) found near "${q}"</strong>. Showing nearest options below.`;
      renderBranchesList(found);
      addMarkers(found);
      if(found[0].lat && found[0].lon) map.setView([found[0].lat, found[0].lon], 10);
    } else {
      // fuzzy by prefix
      const prefix = q.slice(0,3);
      const fuzzy = branches.filter(b => b.pin.slice(0,3) === prefix);
      if(fuzzy.length){
        result.innerHTML = `No exact match for "${q}". Showing branches in the nearby PIN area.`;
        renderBranchesList(fuzzy);
        addMarkers(fuzzy);
        if(fuzzy[0].lat && fuzzy[0].lon) map.setView([fuzzy[0].lat, fuzzy[0].lon], 7);
      } else {
        result.innerHTML = `No branches found for "${q}". <a href="#contact" style="color:var(--warm);text-decoration:none">Request service</a> in your area and we'll expand.`;
        renderBranchesList(branches.slice(0,6));
        addMarkers(branches.slice(0,6));
        map.setView([22.0,79.0], 5);
      }
    }
  }

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keypress', e => { if(e.key === 'Enter') doSearch(); });
}


// callbacks for forms
document.addEventListener('DOMContentLoaded', async () => {
  initMap();
  const branches = await fetchBranches();
  renderBranchesList(branches.slice(0,6));
  addMarkers(branches.slice(0,6));
  setupSearch(branches);

  document.getElementById('requestCallback').addEventListener('click', () => {
    const name = document.getElementById('name').value || 'User';
    const phone = document.getElementById('phone').value || 'N/A';
    alert(`Thanks ${name}! Our support team will call ${phone} within 24 hours.`);
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
  });

  document.getElementById('applyPartner').addEventListener('click', () => {
    const city = document.getElementById('cityPartner').value || '';
    const pin = document.getElementById('pinPartner').value || '';
    if(!city || !pin){ alert('Please enter city and PIN to apply.'); return; }
    alert(`Thanks! We received your partnership request for ${city} (${pin}). We'll contact you soon.`);
    document.getElementById('cityPartner').value = '';
    document.getElementById('pinPartner').value = '';
  });

  // book button
  document.getElementById('bookBtn').addEventListener('click', () => {
    alert('Booking modal / new page — implement booking flow.');
  });

  document.getElementById('applyBtn')?.addEventListener('click', () => {
    alert('Partner application (UI) — implement form submission.');
  });
});
