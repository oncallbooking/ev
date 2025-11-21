/* FutriFix — main.js
   Lightweight client-side implementation with mocked persistence
   - localStorage used to persist users, techs, jobs
   - simple bidding & chat-unlock credits
*/

// ---------- Utilities ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const now = ()=> new Date().toISOString();

function uid(prefix='id'){ return prefix + Math.random().toString(36).slice(2,9); }

// ---------- Data layer (localStorage mocks) ----------
const DB = {
  load(key, fallback) {
    try { const v = localStorage.getItem(key); return v? JSON.parse(v): fallback; } catch(e){ return fallback; }
  },
  save(key, obj) { localStorage.setItem(key, JSON.stringify(obj)); }
};

let services = DB.load('ff_services', null);
if(!services){
  services = [
    {id:'s1', title:'EV Repair', img:'https://picsum.photos/seed/ev/400/300'},
    {id:'s2', title:'Solar Panel Service', img:'https://picsum.photos/seed/solar/400/300'},
    {id:'s3', title:'AC Repair', img:'https://picsum.photos/seed/ac/400/300'},
    {id:'s4', title:'Washing Machine', img:'https://picsum.photos/seed/wash/400/300'},
    {id:'s5', title:'E-Bike Repair', img:'https://picsum.photos/seed/bike/400/300'},
    {id:'s6', title:'Charger Installation', img:'https://picsum.photos/seed/charger/400/300'}
  ];
  DB.save('ff_services', services);
}

let branches = DB.load('ff_branches', null);
if(!branches){
  branches = [
    {id:1, name:'FutriFix - Delhi Central', city:'New Delhi', pin:'110001', eta:'24-36 hrs'},
    {id:2, name:'FutriFix - Gurgaon', city:'Gurugram', pin:'122001', eta:'24 hrs'},
    {id:3, name:'FutriFix - Bengaluru', city:'Bengaluru', pin:'560001', eta:'24 hrs'},
    {id:4, name:'FutriFix - Lucknow', city:'Lucknow', pin:'226001', eta:'48 hrs'},
    {id:5, name:'FutriFix - Chennai', city:'Chennai', pin:'600001', eta:'24-48 hrs'}
  ];
  DB.save('ff_branches', branches);
}

let techs = DB.load('ff_techs', []);
let jobs = DB.load('ff_jobs', []);
let currentUser = DB.load('ff_user', null);

// ---------- Render helpers ----------
function renderServices(){
  const grid = $('#servicesGrid'); grid.innerHTML='';
  services.forEach(s=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<img src="${s.img}" style="width:100%;height:130px;object-fit:cover;border-radius:8px;margin-bottom:8px"><h4>${s.title}</h4>`;
    grid.appendChild(el);
  });
}

function renderBranches(list=branches){
  const cont = $('#branchList'); cont.innerHTML='';
  list.forEach(b=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<h4>${b.name}</h4><div class="muted">${b.city} • PIN ${b.pin}</div><div style="margin-top:8px"><span class="badge">ETA: ${b.eta}</span></div>`;
    cont.appendChild(el);
  });
}

function renderJobFeed(){
  const feed = $('#jobFeed'); feed.innerHTML='';
  if(!jobs.length) { feed.innerHTML='<div class="muted">No open jobs — post one above.</div>'; return; }
  jobs.slice().reverse().forEach(job=>{
    const el = document.createElement('div'); el.className='card job-card';
    el.innerHTML = `
      <div style="flex:1">
        <h4>${job.title || job.service}</h4>
        <div class="meta muted">${job.pin} • Posted: ${new Date(job.created).toLocaleString()}</div>
        <p class="muted" style="margin-top:8px">${job.desc}</p>
        <div class="muted" style="margin-top:8px">Budget: ₹${job.min || '-'} - ₹${job.max || '-'}</div>
        <div id="bids-${job.id}" style="margin-top:12px">${renderBidsPreview(job)}</div>
      </div>
      <div style="width:220px">
        <div class="muted">Actions</div>
        <button class="btn-primary" onclick="openJobDetail('${job.id}')">Open</button>
        <button class="btn-outline" onclick="mockAssign('${job.id}')">Assign (mock)</button>
      </div>
    `;
    feed.appendChild(el);
  });
}

function renderBidsPreview(job){
  if(!job.bids || !job.bids.length) return '<div class="muted">No bids yet</div>';
  const top = job.bids.slice(-3).reverse();
  return top.map(b => `<div style="padding:6px 0"><strong>₹${b.amount}</strong> • ${b.techName} <div class="muted">${b.message}</div></div>`).join('');
}

// ---------- Populate selects ----------
function populateSelects(){
  const ss = $('#serviceSelect'); ss.innerHTML='';
  const cs = $('#custService'); cs.innerHTML='';
  const ts = $('#jobService'); // some pages may not have this
  services.forEach(s=>{
    const opt = `<option value="${s.id}">${s.title}</option>`;
    ss.insertAdjacentHTML('beforeend', opt);
    cs.insertAdjacentHTML('beforeend', opt);
    if(ts) ts.insertAdjacentHTML('beforeend', opt);
  });
}

// ---------- Search ----------
$('#searchBtn').addEventListener('click', ()=>{
  const q = $('#searchInput').value.trim();
  const sid = $('#serviceSelect').value;
  if(!q){ $('#searchResult').textContent='Please enter a PIN or city.'; return; }
  // exact match by pin or partial city
  const found = branches.filter(b => b.pin === q || b.city.toLowerCase().includes(q.toLowerCase()));
  if(found.length){
    $('#searchResult').innerHTML = `<strong>${found.length} branch(es) found near "${q}"</strong>`;
    renderBranches(found);
  } else {
    $('#searchResult').innerHTML = `No branch found for "${q}". Showing nearest branches.`;
    renderBranches(branches);
  }
});

// ---------- Post job ----------
$('#postJobBtn').addEventListener('click', ()=>{
  const name = $('#custName').value.trim() || 'Anonymous';
  const pin = $('#custPin').value.trim() || '';
  const serviceId = $('#custService').value;
  const service = services.find(s=>s.id===serviceId)?.title || 'Service';
  const desc = $('#custDesc').value.trim() || '';
  const min = $('#custMin').value.trim();
  const max = $('#custMax').value.trim();
  const imgFile = $('#custImage').files[0];

  const job = {id: uid('job'), title: service, serviceId, desc, min, max, pin, created: now(), postedBy:name, bids:[]};
  if(imgFile){
    const reader = new FileReader();
    reader.onload = (e)=>{
      job.image = e.target.result;
      jobs.push(job); DB.save('ff_jobs', jobs); renderJobFeed(); alert('Job posted with image!'); clearJobForm();
    };
    reader.readAsDataURL(imgFile);
  } else {
    jobs.push(job); DB.save('ff_jobs', jobs); renderJobFeed(); alert('Job posted (open to bids).'); clearJobForm();
  }
});

function clearJobForm(){
  $('#custDesc').value=''; $('#custMin').value=''; $('#custMax').value=''; $('#custImage').value=''; $('#imgPreview').innerHTML='';
  $('#custName').value=''; $('#custPin').value='';
}

// image preview
$('#custImage').addEventListener('change', (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader(); r.onload=(ev)=> { $('#imgPreview').innerHTML = `<img src="${ev.target.result}" style="width:120px;border-radius:8px">`; }; r.readAsDataURL(f);
});

// ---------- Create tech ----------
$('#createTechBtn').addEventListener('click', ()=>{
  const name = $('#techName').value.trim(); if(!name){ alert('Enter tech name'); return; }
  const skills = $('#techSkills').value.trim().split(',').map(s=>s.trim()).filter(Boolean);
  const pins = ($('#techPin').value||'').split(',').map(p=>p.trim()).filter(Boolean);
  const price = $('#techPrice').value.trim() || '0';
  const sub = $('#techSub').value;

  const tech = {id: uid('tech'), name, skills, pins, price, sub, created: now(), credits: sub==='free'?10: sub==='pro'?100:300};
  techs.push(tech); DB.save('ff_techs', techs);
  alert('Technician profile created. Credits: ' + tech.credits);
  $('#techName').value=''; $('#techSkills').value=''; $('#techPin').value=''; $('#techPrice').value='';
  renderTechList();
});

// ---------- Render tech list (abstract) ----------
function renderTechList(){
  // Not visible in UI yet; but keep for debugging
  console.log('Techs', techs);
}

// ---------- Bidding simulation ----------
window.openJobDetail = function(jobId){
  const job = jobs.find(j=>j.id===jobId);
  if(!job){ alert('Job not found'); return; }
  // Prompt to simulate a technician bid
  const availableTechs = techs.filter(t => t.pins.includes(job.pin) || t.skills.some(sk => job.title.toLowerCase().includes(sk.toLowerCase())));
  const tech = availableTechs[0] || techs[0];
  if(!tech){ alert('No technicians registered yet. Please create a technician profile to bid.'); return; }
  const amount = prompt(`Simulate a bid by ${tech.name}. Enter bid amount (₹).`, Math.max(100, tech.price || 200));
  if(!amount) return;
  const msg = prompt('Optional message for customer (ETA, notes):','Can visit tomorrow morning');
  const bid = {id: uid('bid'), techId: tech.id, techName: tech.name, amount, message: msg||'', created: now()};
  job.bids.push(bid); DB.save('ff_jobs', jobs);
  renderJobFeed(); alert('Bid placed by ' + tech.name);
};

// Assign mock
window.mockAssign = function(jobId){
  const job = jobs.find(j=>j.id===jobId);
  if(!job || !job.bids.length){ alert('No bids to assign.'); return; }
  job.assigned = job.bids[job.bids.length-1]; job.status='assigned'; DB.save('ff_jobs', jobs);
  renderJobFeed(); alert('Assigned to ' + job.assigned.techName + ' (mock).');
};

// ---------- Chat unlock/pay-to-unlock simulation ----------
function unlockChat(jobId, techId){
  // deduct tech credits to unlock chat (mock)
  const tech = techs.find(t=>t.id===techId);
  if(!tech) return alert('Tech not found');
  if(tech.credits < 5) return alert('Not enough credits. Buy subscription or credits.');
  tech.credits -= 5; DB.save('ff_techs', techs);
  alert(`Chat unlocked for tech ${tech.name}. Credits left: ${tech.credits}`);
}

// ---------- Quick login modal (mock OTP & google) ----------
$('#btnLogin').addEventListener('click', ()=> $('#loginModal').classList.remove('hidden'));
$('#closeLogin').addEventListener('click', ()=> $('#loginModal').classList.add('hidden'));

$$('.tab').forEach(t => t.addEventListener('click', (e)=>{
  $$('.tab').forEach(x=>x.classList.remove('active'));
  e.target.classList.add('active');
  const which = e.target.dataset.tab;
  $$('#tab-phone, #tab-google').forEach(el=>el.classList.add('hidden'));
  $('#tab-'+which).classList.remove('hidden');
}));

$('#sendOtp').addEventListener('click', ()=>{
  const phone = $('#otpPhone').value.trim(); if(!phone){ alert('Enter phone'); return; }
  alert('OTP sent (mock). Use 1234 to verify.');
});
$('#verifyOtpBtn').addEventListener('click', ()=>{
  const pin = $('#verifyOtp').value.trim(); if(pin === '1234'){
    currentUser = {id: uid('u'), name: 'User-'+Math.random().toString(36).slice(2,6), phone: $('#otpPhone').value.trim(), type:'customer'};
    DB.save('ff_user', currentUser); $('#loginModal').classList.add('hidden'); alert('Logged in as ' + currentUser.name);
  } else { alert('Invalid OTP (mock). Use 1234.'); }
});
$('#googleMock').addEventListener('click', ()=>{
  currentUser = {id: uid('u'), name: 'GoogleUser', email:'user@gmail.com', type:'customer'};
  DB.save('ff_user', currentUser); $('#loginModal').classList.add('hidden'); alert('Signed in (mock) as ' + currentUser.name);
});

// ---------- Partner apply ----------
$('#applyPartner').addEventListener('click', ()=>{
  const c = $('#partnerCity').value.trim(), p = $('#partnerPin').value.trim();
  if(!c || !p) return alert('Enter city & PIN');
  alert(`Thanks! Partner application submitted for ${c} (${p}).`);
  $('#partnerCity').value=''; $('#partnerPin').value='';
});

// ---------- initial render ----------
populateSelects();
renderServices();
renderBranches();
renderJobFeed();
renderTechList();

// ---------- Persist on unload ----------
window.addEventListener('beforeunload', ()=> {
  DB.save('ff_services', services);
  DB.save('ff_branches', branches);
  DB.save('ff_techs', techs);
  DB.save('ff_jobs', jobs);
  DB.save('ff_user', currentUser);
});

/* Note:
   - This is a mocked client-side build. Replace storage layer & handlers
     with real API calls when backend APIs are available.
   - To connect to real auth, payments, chat & geo APIs, swap the mocked
     functions with API integrations and add secure server endpoints.
*/
