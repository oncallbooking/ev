/* app.js — FutriFix shared frontend logic (no backend) */

/*
 - localStorage keys:
    FUTR_TECHS  -> JSON array of technicians
    FUTR_JOBS   -> JSON array of jobs
    FUTR_USERS  -> JSON array of customers (for login/demo)
*/

const DB = {
  get(key){ try { return JSON.parse(localStorage.getItem(key)||'null'); } catch(e){ return null; } },
  set(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
};

/* ---- seed demo data once ---- */
function ensureSeed(){
  if(!DB.get('FUTR_TECHS')){
    DB.set('FUTR_TECHS', [
      {id:1,name:'Rohit Sharma', initials:'RS', skill:'EV Scooter Expert', exp:'5 yrs', rating:4.9, price:199, phone:'911234567890'},
      {id:2,name:'Imran Khan', initials:'IK', skill:'Solar / Battery', exp:'6 yrs', rating:4.8, price:249, phone:'919876543210'},
      {id:3,name:'Rahul Verma', initials:'RV', skill:'AC Specialist', exp:'8 yrs', rating:5.0, price:299, phone:'919998887776'}
    ]);
  }
  if(!DB.get('FUTR_JOBS')){
    DB.set('FUTR_JOBS', [
      {id:101,title:'EV Scooter not charging', customer:'Asha R.', location:'560076', range:'₹350–500', bidders:[{tech:'Rohit Sharma',price:430}]},
      {id:102,title:'AC not cooling', customer:'Vikram S.', location:'400001', range:'₹600–900', bidders:[]}
    ]);
  }
  if(!DB.get('FUTR_USERS')){
    DB.set('FUTR_USERS', [{id:201,name:'Asha R.',phone:'919900112233',role:'customer' }]);
  }
}
ensureSeed();

/* ---- Utilities ---- */
function el(id){ return document.getElementById(id); }
function q(sel){ return document.querySelector(sel); }
function renderTechs(containerId){
  const list = DB.get('FUTR_TECHS') || [];
  const container = el(containerId);
  if(!container) return;
  container.innerHTML = '';
  list.forEach(t=>{
    const div = document.createElement('div');
    div.className = 'tech-card';
    div.innerHTML = `
      <div class="avatar">${t.initials}</div>
      <div class="tech-main">
        <b>${t.name}</b>
        <div class="tech-sub">${t.skill} • <span class="small">${t.exp}</span></div>
        <div class="chips"><div class="chip">Base ₹${t.price}</div><div class="chip">${t.skill.split('/')[0].trim()}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
        <div class="rating">${t.rating}</div>
        <a href="https://wa.me/${t.phone}?text=${encodeURIComponent('Hi '+t.name+' I need your service')}" target="_blank" rel="noopener">
          <button class="whatsapp">WhatsApp</button>
        </a>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderJobs(containerId){
  const list = DB.get('FUTR_JOBS') || [];
  const container = el(containerId);
  if(!container) return;
  container.innerHTML = '';
  list.forEach(job=>{
    const j = document.createElement('div');
    j.className = 'job-card';
    j.innerHTML = `
      <div class="job-top">
        <div style="flex:1">
          <div class="job-title"><b>${job.title}</b></div>
          <div class="job-meta small">${job.customer} • PIN ${job.location}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="price-tag">${job.range}</div>
          <button class="bid-btn" data-job="${job.id}">${job.bidders.length} Bids</button>
        </div>
      </div>
      <div class="bidders-list" id="bidders-${job.id}">${job.bidders.map(b=>`<div class="bid-row"><div>${b.tech}</div><div class="small">₹${b.price}</div></div>`).join('')}</div>
    `;
    container.appendChild(j);
  });

  // attach toggle handlers
  document.querySelectorAll('.bid-btn').forEach(b=>{
    b.addEventListener('click', (ev)=>{
      const id = ev.currentTarget.getAttribute('data-job');
      const elB = document.getElementById('bidders-'+id);
      if(!elB) return;
      const shown = elB.style.display === 'block';
      document.querySelectorAll('.bidders-list').forEach(x=>x.style.display='none');
      elB.style.display = shown ? 'none' : 'block';
    });
  });
}

/* ---- Signup handlers ---- */
function techSignupHandler(formId){
  const f = el(formId);
  if(!f) return;
  f.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = {
      id: Date.now(),
      name: f.name.value.trim(),
      initials: (f.name.value.trim().split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()) || 'NA',
      skill: f.skill.value.trim(),
      exp: f.exp.value.trim(),
      rating: parseFloat(f.rating.value) || 4.5,
      price: parseInt(f.price.value) || 0,
      phone: f.phone.value.trim()
    };
    // basic validation
    if(!data.name || !data.skill || !data.phone){ alert('Please fill name, skill and phone'); return; }
    const arr = DB.get('FUTR_TECHS') || [];
    arr.unshift(data); DB.set('FUTR_TECHS', arr);
    alert('Technician profile created (mock). Redirecting to dashboard.');
    location.href = 'dashboard.html';
  });
}

function customerSignupHandler(formId){
  const f = el(formId);
  if(!f) return;
  f.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = {
      id: Date.now(),
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      role: 'customer'
    };
    if(!data.name || !data.phone){ alert('Please fill name and phone'); return; }
    const arr = DB.get('FUTR_USERS') || [];
    arr.unshift(data); DB.set('FUTR_USERS', arr);
    alert('Customer account created (mock). Redirecting to create job.');
    location.href = 'dashboard.html';
  });
}

/* ---- Job post handler (on dashboard create job section) ---- */
function postJobHandler(formId){
  const f = el(formId);
  if(!f) return;
  f.addEventListener('submit', (e)=>{
    e.preventDefault();
    const jobs = DB.get('FUTR_JOBS') || [];
    const job = {
      id: Date.now(),
      title: f.title.value.trim(),
      customer: f.customer.value.trim() || 'Anonymous',
      location: f.pin.value.trim(),
      range: f.range.value.trim() || '₹0–0',
      bidders: []
    };
    if(!job.title || !job.location){ alert('Title and PIN required'); return; }
    jobs.unshift(job); DB.set('FUTR_JOBS', jobs);
    alert('Job posted (mock).');
    renderJobs('jobList');
    f.reset();
  });
}

/* ---- Utilities for pages - call on page load ---- */
function initIndex(){
  renderTechs('techList');
  renderJobs('jobList');
  // simple search button
  const sbtn = el('searchBtn');
  if(sbtn) sbtn.addEventListener('click', ()=>{
    const q = el('searchInput').value.trim();
    const s = el('serviceSelect').value;
    el('searchResult').textContent = q || s ? `Showing results for "${q||s}" (mock)` : 'Please enter PIN or Service';
  });
}

function initSignupPages(){
  techSignupHandler('techForm');
  customerSignupHandler('custForm');
}

function initDashboard(){
  renderTechs('dashboardTechs');
  renderJobs('dashboardJobs');
  postJobHandler('postJobForm');
}

/* Expose functions to window */
window.FUTR = {
  initIndex, initSignupPages, initDashboard
};
