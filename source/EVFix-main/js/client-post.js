// js/client-post.js
async function postJobToServer(payload){
  try {
    const r = await fetch('/api/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    if(r.ok) return r.json();
  } catch(e){}
  return null;
}

async function loadMyJobs(){
  // load jobs from server or localStorage
  try {
    const r = await fetch('/api/jobs'); if(r.ok){ const arr = await r.json(); renderJobs(arr); return; }
  } catch(e){}
  const local = JSON.parse(localStorage.getItem('jobs') || '[]'); renderJobs(local);
}

function renderJobs(arr){
  const el = document.getElementById('myJobs'); el.innerHTML = '';
  if(!arr.length) el.innerHTML = '<div class="muted">No jobs yet.</div>';
  arr.slice().reverse().forEach(j=>{
    const d = document.createElement('div'); d.className='card';
    d.innerHTML = `<div style="display:flex;justify-content:space-between"><div>
        <div style="font-weight:800">${j.title}</div>
        <div class="muted">${j.city} • ${j.pin} • Budget: ${j.budget || 'Open'}</div>
        <div style="margin-top:8px">${j.desc}</div>
      </div>
      <div style="text-align:right"><div class="muted">Posted ${new Date(j.created).toLocaleString()}</div>
      <div style="margin-top:8px"><b>Bids:</b> ${j.bids ? j.bids.length : 0}</div>
      </div></div>`;
    el.appendChild(d);
  });
}

document.getElementById('postJob').addEventListener('click', async ()=>{
  const title = document.getElementById('title').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const city = document.getElementById('city').value.trim();
  const pin = document.getElementById('pin').value.trim();
  const budget = document.getElementById('budget').value.trim();
  const contact = document.getElementById('contact').value.trim();
  if(!title || !city || !pin || !contact){ document.getElementById('postMsg').textContent='Please fill required fields.'; return; }
  const payload = { title, desc, city, pin, budget, contact, created: Date.now(), bids: [] };

  const srv = await postJobToServer(payload);
  if(srv){
    document.getElementById('postMsg').textContent = 'Job posted — technicians will see and bid.';
    setTimeout(()=>{ document.getElementById('postMsg').textContent=''; },1000);
    loadMyJobs();
    return;
  }
  // fallback local
  const local = JSON.parse(localStorage.getItem('jobs') || '[]'); local.push(payload); localStorage.setItem('jobs', JSON.stringify(local));
  document.getElementById('postMsg').textContent = 'Job saved locally (no server).';
  loadMyJobs();
});

loadMyJobs();
