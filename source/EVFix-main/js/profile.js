// js/profile.js
async function fetchTech(id){
  try {
    const r = await fetch('/api/techs/'+id);
    if(r.ok) return r.json();
  } catch(e){}
  // fallback to data file or localStorage
  try {
    const r2 = await fetch('data/techs.json'); const arr = await r2.json(); return arr.find(a=>a.id==id);
  } catch(e){}
  const local = JSON.parse(localStorage.getItem('techList') || '[]'); return local.find(a=>a.id==id);
}

async function fetchJobs(){ try { const r = await fetch('/api/jobs'); if(r.ok) return r.json(); } catch(e){} try { const r2 = await fetch('data/jobs.json'); return r2.json(); } catch(e){} return []; }

function renderProfile(t){
  const el = document.getElementById('profileCard');
  if(!t) { el.innerHTML = '<div class="card">Technician not found.</div>'; return; }
  el.innerHTML = `
    <div style="display:flex;gap:18px;align-items:flex-start">
      <img src="${t.photo || 'https://picsum.photos/seed/tech'+t.id+'/300/300'}" style="width:180px;height:180px;object-fit:cover;border-radius:12px"/>
      <div style="flex:1">
        <h1 style="margin:0">${t.name}</h1>
        <div class="muted">${t.city} • ${t.pin}</div>
        <div style="margin-top:8px"><b>Experience:</b> ${t.experience} years • <b>Rate:</b> ₹${t.price}</div>
        <div style="margin-top:8px"><b>Degree:</b> ${t.degree || '—'}</div>
        <div style="margin-top:10px">${t.bio || ''}</div>
        <div style="margin-top:16px"><button class="btn-primary" onclick="openBidForTech(${t.id})">Place Bid / Contact</button></div>
      </div>
    </div>
    <div id="mapSmall" style="height:220px;margin-top:14px"></div>
  `;
  // render map if coordinates are available
  if(t.lat && t.lon){
    const m = L.map('mapSmall', {zoomControl:false}).setView([t.lat,t.lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:''}).addTo(m);
    L.marker([t.lat,t.lon]).addTo(m).bindPopup(t.name).openPopup();
  } else {
    document.getElementById('mapSmall').innerHTML = '<div class="muted" style="padding:20px">Location not available</div>';
  }
}

function openBidForTech(id){
  const yourName = prompt('Your name (client)');
  if(!yourName) return;
  const msg = prompt('Message to technician (describe problem & offer):');
  if(!msg) return;
  const price = prompt('Your offered price (₹) — optional');
  // submit as a bid against an open job or as one-off inquiry
  alert('For prototype: bid recorded locally (or sent to server if available). Implement server messaging for production.');

  // try to post to server if exists
  fetch('/api/bid', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
    techId:id, clientName:yourName, message:msg, price: price || null, created: Date.now()
  }) }).catch(()=>console.log('bid not sent to server (no backend).'));
}

(async function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const tech = await fetchTech(id);
  renderProfile(tech);
})();
