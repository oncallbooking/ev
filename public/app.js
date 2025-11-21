const api = (path, opts)=> fetch('/api'+path, opts).then(r=>r.json());

document.getElementById('searchBtn').addEventListener('click', async ()=>{
  const pin = document.getElementById('pinInput').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const q = new URLSearchParams();
  if(pin) q.set('pin', pin);
  if(service) q.set('service', service);
  const res = await api('/techs?'+q.toString());
  const results = document.getElementById('results');
  results.innerHTML = '';
  if(res.data && res.data.length){
    res.data.forEach(t=>{
      const el = document.createElement('div');
      el.className='card';
      el.innerHTML = `<h3>${t.name}</h3><p><small>${t.services.join(', ')} • ${t.pins.join(', ')}</small></p><p>Rating: ${t.rating || '—'}</p><p>From ₹${t.priceFrom || '-'}</p><button data-id="${t.id}" class="contact">Contact</button>`;
      results.appendChild(el);
    });
  } else {
    results.innerHTML = '<div class="card"><p>No techs found.</p></div>';
  }
});

document.getElementById('postJobBtn').addEventListener('click', async ()=>{
  const title = document.getElementById('jobTitle').value.trim();
  const pin = document.getElementById('jobPin').value.trim();
  const service = document.getElementById('jobService').value;
  const budget = document.getElementById('budget').value;
  if(!title||!pin){ alert('Please add title and pin'); return; }
  const job = { title, pin, service, budget, customerId: 'cust_demo' };
  const res = await api('/jobs', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(job) });
  if(res.job) alert('Job posted! id:'+res.job.id);
});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').then(()=>console.log('sw registered'));
}
