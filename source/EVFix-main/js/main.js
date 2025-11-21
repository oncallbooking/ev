// js/main.js
// Handles: load techs, initialize map, search/filter, show jobs & markers

const API = '/api'; // server root (if running server). If you're running frontend-only, it will fetch local data files.

let map, markers;
let techs = [];
let jobs = [];

async function fetchTechs(){
  try {
    const r = await fetch('/api/techs');
    if(r.ok) return r.json();
  } catch(e){ /* fallback to local file */ }
  const r2 = await fetch('data/techs.json');
  return r2.json();
}

async function fetchJobs(){
  try {
    const r = await fetch('/api/jobs');
    if(r.ok) return r.json();
  } catch(e){}
  const r2 = await fetch('data/jobs.json');
  return r2.json();
}

function initMap(){
  map = L.map('map', {zoomControl:true}).setView([22.0,78.0], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap' }).addTo(map);
  markers = L.layerGroup().addTo(map);
}

function addTechMarkers(list){
  markers.clearLayers();
  list.forEach(t=>{
    if(t.lat && t.lon){
      const popup = `<div style="font-weight:700">${t.name}</div><div class="muted">${t.city} • ${t.pin}</div>
        <div style="margin-top:6px"><b>Exp:</b> ${t.experience}y • <b>₹</b>${t.price}</div>
        <div style="margin-top:8px"><a href="technician.html?id=${t.id}" class="btn-primary" style="padding:6px 8px">Profile</a></div>`;
      L.marker([t.lat,t.lon]).bindPopup(popup).addTo(markers);
    }
  });
}

function renderTechList(list){
  const container = document.getElementById('techList');
  container.innerHTML = '';
  if(!list.length) {
    container.innerHTML = `<div class="card"><i class="muted">No technicians found for your search. Post a job to get bids from nearby techs.</i></div>`;
    return;
  }
  list.forEach(t=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${t.photo || 'https://picsum.photos/seed/tech'+t.id+'/200/180'}" style="width:110px;height:90px;border-radius:8px;object-fit:cover"/>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:800">${t.name}</div>
              <div class="muted">${t.city} • ${t.pin}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:800">₹ ${t.price}</div>
              <div class="muted">${t.experience} yrs</div>
              <a href="technician.html?id=${t.id}" class="btn-primary" style="padding:6px 8px;margin-top:8px;display:inline-block">Profile</a>
            </div>
          </div>
          <div style="margin-top:8px" class="muted"><b>Services:</b> ${t.services.join(', ')}</div>
          <div style="margin-top:8px">
            <button class="btn-alt" onclick="openBidDialog(${t.id})">Send message / Ask price</button>
          </div>
        </div>
      </div>`;
    container.appendChild(el);
  });
}

function renderJobs(list){
  const f = document.getElementById('jobFeed');
  f.innerHTML = '';
  list.slice().reverse().forEach(job=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-weight:800">${job.title}</div>
          <div class="muted">${job.city} • ${job.pin} • Budget: ${job.budget || 'Open'}</div>
          <div style="margin-top:8px">${job.desc}</div>
          <div style="margin-top:10px;color:var(--muted);font-size:13px">Posted: ${new Date(job.created).toLocaleString()}</div>
        </div>
        <div style="min-width:160px;text-align:right">
          <a href="technician.html?id=${job.assignedTech || ''}" class="muted">View</a>
          <div style="margin-top:8px"><b>Bids:</b> ${job.bids ? job.bids.length : 0}</div>
        </div>
      </div>`;
    f.appendChild(div);
  });
}

function openBidDialog(techId){
  const price = prompt('Enter your message or request an estimated price from technician:');
  if(!price) return;
  alert('For prototype: a message will be sent to the technician. In production, implement real messaging and bookings.');
}

async function init(){
  initMap();
  techs = await fetchTechs();
  jobs = await fetchJobs();

  renderTechList(techs.slice(0,12));
  addTechMarkers(techs.slice(0,100));
  renderJobs(jobs);

  // search
  document.getElementById('searchBtn').addEventListener('click', async () => {
    const service = document.getElementById('serviceInput').value.trim().toLowerCase();
    const location = document.getElementById('locationInput').value.trim().toLowerCase();
    document.getElementById('searchMsg').textContent = 'Searching...';

    let results = techs.filter(t => {
      const matchService = !service || t.services.join(',').toLowerCase().includes(service);
      const matchLoc = !location || t.city.toLowerCase().includes(location) || t.pin.includes(location);
      return matchService && matchLoc;
    });

    if(results.length === 0){
      document.getElementById('searchMsg').textContent = 'No exact results — showing nearest technicians.';
      results = techs.slice(0,8);
    } else {
      document.getElementById('searchMsg').textContent = `${results.length} technician(s) found.`;
    }

    renderTechList(results);
    addTechMarkers(results);
    if(results.length && results[0].lat && results[0].lon) map.setView([results[0].lat, results[0].lon], 10);
  });

  // category quick select
  document.querySelectorAll('.cat').forEach(b=>{
    b.addEventListener('click', ()=> {
      document.getElementById('serviceInput').value = b.dataset.service;
      document.getElementById('searchBtn').click();
    });
  });
}

init().catch(err=>console.error(err));
