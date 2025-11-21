// FutriFix app.js - frontend-only demo with mocked auth, wallet, bidding and map
(() => {
  // Simple router-like page show/hide
  const pages = document.querySelectorAll('.page');
  function showPage(id){
    pages.forEach(p => p.id===id ? p.classList.remove('hidden') : p.classList.add('hidden'));
    document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => {
      a.classList.toggle('active', a.dataset.page===id);
    });
  }
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    showPage(a.dataset.page);
  }));
  // default
  showPage('home');

  // Theme toggle with persistence
  const themeBtn = document.getElementById('theme-toggle');
  function setTheme(t){ document.body.className = t; localStorage.setItem('theme', t); }
  const saved = localStorage.getItem('theme') || 'light'; setTheme(saved);
  themeBtn.addEventListener('click', () => setTheme(document.body.classList.contains('light') ? 'dark' : 'light'));

  // Mock auth modal
  const loginBtn = document.getElementById('login-btn');
  loginBtn.addEventListener('click', () => {
    const name = prompt('Enter display name for demo (this simulates auth):','Demo User');
    if(name){ localStorage.setItem('user', JSON.stringify({name})); loginBtn.textContent = 'Signed in'; loginBtn.disabled=true; renderUser(); }
  });
  function renderUser(){ const u = JSON.parse(localStorage.getItem('user')||'null'); if(u){ loginBtn.textContent = u.name; loginBtn.disabled=true; } }

  // Wallet simulated
  const walletAmountEl = document.getElementById('wallet-amount');
  const walletBadge = document.getElementById('wallet-badge');
  function renderWallet(){ const w=Number(localStorage.getItem('wallet')||0); walletAmountEl.textContent = '₹'+w; walletBadge.textContent = '₹'+w; }
  renderWallet();
  document.getElementById('topup-50').addEventListener('click', ()=> changeWallet(50));
  document.getElementById('topup-200').addEventListener('click', ()=> changeWallet(200));
  document.getElementById('withdraw').addEventListener('click', ()=> { alert('Withdraw simulated — will initiate payout in a real app'); });
  function changeWallet(amount){ const cur=Number(localStorage.getItem('wallet')||0); localStorage.setItem('wallet', cur+amount); renderWallet(); alert('Top-up simulated: ₹'+amount); }

  // Post job form -> create a request, then mock receiving quotes
  const postForm = document.getElementById('post-form');
  postForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const job = {
      id:Date.now().toString(),
      title:document.getElementById('job-title').value||'Untitled job',
      desc:document.getElementById('job-desc').value||'',
      date:document.getElementById('job-date').value||'Anytime',
      budget:document.getElementById('job-budget').value||0,
      created: new Date().toISOString()
    };
    let jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
    jobs.unshift(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    document.getElementById('post-feedback').classList.remove('hidden');
    document.getElementById('post-feedback').textContent = 'Job posted. Technicians will send quotes (simulated).';
    // Simulate quotes arriving after short delay
    setTimeout(()=> simulateQuotes(job.id), 1200);
    postForm.reset();
    showPage('home');
  });

  function simulateQuotes(jobId){
    const techs = sampleTechs();
    const quotes = techs.slice(0,3).map((t,i)=>({id: Date.now()+i, techId:t.id, techName:t.name, amount: Math.max(100, Math.round((Math.random()*1.2+0.5)*(t.rate || 350))), eta:Math.floor(Math.random()*60)+15}));
    let qStore = JSON.parse(localStorage.getItem('quotes')||'{}');
    qStore[jobId] = quotes;
    localStorage.setItem('quotes', JSON.stringify(qStore));
    // notify user (simple)
    alert('You received '+quotes.length+' quotes. Open the modal to view.');
    openModalForJob(jobId);
  }

  // Modal to show quotes
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  document.getElementById('modal-close').addEventListener('click', ()=> closeModal());
  function openModalForJob(jobId){
    const jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
    const job = jobs.find(j=>j.id===jobId);
    const quotes = (JSON.parse(localStorage.getItem('quotes')||'{}'))[jobId]||[];
    modalBody.innerHTML = `<h3>${job.title}</h3><p>${job.desc}</p><div><strong>Quotes</strong></div>`;
    quotes.forEach(q=>{
      const node = document.createElement('div');
      node.className='card';
      node.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${q.techName}</strong><div class="muted">ETA ${q.eta} min</div></div><div><div style="font-weight:800">₹${q.amount}</div><button class="btn accept" data-amount="${q.amount}" data-tech="${q.techName}" data-job="${jobId}">Accept</button></div></div>`;
      modalBody.appendChild(node);
    });
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    // attach accept handlers
    modal.querySelectorAll('.accept').forEach(b=> b.addEventListener('click', (e)=>{
      const amt = Number(b.dataset.amount); const tech = b.dataset.tech; const jobId = b.dataset.job;
      const cur = Number(localStorage.getItem('wallet')||0);
      if(cur < amt){ if(confirm('Insufficient credits — top-up now?')) { changeWallet(200); } return; }
      localStorage.setItem('wallet', cur-amt);
      renderWallet();
      alert('You accepted '+tech+' for ₹'+amt+'. Payment completed from wallet (simulated).');
      closeModal();
    }));
  }
  function closeModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); modalBody.innerHTML=''; }

  // Techs & Map (Leaflet)
  function sampleTechs(){
    const seed = [
      {id:'t1',name:'Arjun Repairs',lat:28.6139,lon:77.2090,rate:300,rating:4.8,category:'EV'},
      {id:'t2',name:'Nexus Techs',lat:28.6200,lon:77.2100,rate:350,rating:4.6,category:'Battery'},
      {id:'t3',name:'RapidFix',lat:28.6100,lon:77.2300,rate:420,rating:4.9,category:'General'}
    ];
    return seed;
  }
  function renderTechList(){ const list = document.getElementById('techs'); list.innerHTML=''; sampleTechs().forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${t.name}</strong><div class="muted">${t.category} • ${t.rating}★</div></div><div><button class="btn small" data-id="${t.id}">Quote</button></div>`;
    list.appendChild(li);
  }); document.querySelectorAll('#techs .btn.small').forEach(b=> b.addEventListener('click', ()=>{
    alert('Technician profile & quote flow simulated. Use Post Job to receive real quotes.');
  })); }
  renderTechList();

  // Map
  const mapEl = document.getElementById('map');
  const map = L.map(mapEl, {attributionControl:false}).setView([28.6139,77.2090],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  sampleTechs().forEach(t=>{
    const m = L.marker([t.lat,t.lon]).addTo(map);
    m.bindPopup(`<strong>${t.name}</strong><br/>${t.category} • ₹${t.rate}`);
  });

  // Quick actions
  document.getElementById('quick-post').addEventListener('click', ()=> showPage('post'));
  document.getElementById('browse-tech').addEventListener('click', ()=> showPage('technicians'));
  document.getElementById('preview-map').addEventListener('click', ()=> { showPage('technicians'); setTimeout(()=>map.invalidateSize(),250); });

  // Demo persistence for README seed
  if(!localStorage.getItem('wallet')) localStorage.setItem('wallet', 150);
  renderWallet();
  renderUser();
  // Expose function for debugging in console
  window.FutriFix = {openModalForJob, simulateQuotes};
})();