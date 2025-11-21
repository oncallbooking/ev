// js/signup.js
// Attempts to geocode (Nominatim) and then POST to backend /api/techs
// If backend absent, will save to localStorage

async function geocodeCityPin(city, pin){
  const q = encodeURIComponent(`${pin} ${city} India`);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;
  try {
    const r = await fetch(url, { headers: { 'Accept-Language': 'en' }});
    const data = await r.json();
    if(data && data.length) return {lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon)};
  } catch(e){}
  return null;
}

async function registerTechServer(payload){
  try {
    const r = await fetch('/api/techs', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    return r.ok ? r.json() : null;
  } catch(e){ return null; }
}

document.getElementById('signupBtn').addEventListener('click', async ()=>{
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const pin = document.getElementById('pin').value.trim();
  const services = document.getElementById('services').value.split(',').map(s=>s.trim()).filter(Boolean);
  const degree = document.getElementById('degree').value.trim();
  const experience = +document.getElementById('experience').value || 0;
  const price = document.getElementById('price').value.trim() || '0';
  const photo = document.getElementById('photo').value.trim();
  const bio = document.getElementById('bio').value.trim();

  if(!name || !city || !pin || services.length===0){
    document.getElementById('signupMsg').textContent = 'Please fill name, city, pin and at least one service.';
    return;
  }
  document.getElementById('signupMsg').textContent = 'Geocoding your location...';

  const geo = await geocodeCityPin(city, pin);
  const payload = { name, phone, city, pin, services, degree, experience, price, photo, bio, lat: geo?.lat, lon: geo?.lon };

  const serverResp = await registerTechServer(payload);
  if(serverResp){
    document.getElementById('signupMsg').textContent = 'Registered successfully (server). Your profile is live.';
    setTimeout(()=>window.location='index.html',900);
    return;
  }

  // fallback: localStorage only
  const list = JSON.parse(localStorage.getItem('techList') || '[]');
  payload.id = Date.now();
  list.push(payload);
  localStorage.setItem('techList', JSON.stringify(list));
  document.getElementById('signupMsg').textContent = 'Registered locally (no server). Your profile is saved in this browser.';
  setTimeout(()=>window.location='index.html',900);
});

document.getElementById('signupLocal').addEventListener('click', ()=>{
  // same as local registration without geocode
  const name = document.getElementById('name').value.trim();
  if(!name){ document.getElementById('signupMsg').textContent='Enter a name.'; return; }
  const payload = {
    id: Date.now(),
    name, phone: document.getElementById('phone').value.trim(),
    city: document.getElementById('city').value.trim(),
    pin: document.getElementById('pin').value.trim(),
    services: document.getElementById('services').value.split(',').map(s=>s.trim()).filter(Boolean),
    degree: document.getElementById('degree').value.trim(),
    experience: +document.getElementById('experience').value || 0,
    price: document.getElementById('price').value.trim() || '0',
    photo: document.getElementById('photo').value.trim(),
    bio: document.getElementById('bio').value.trim()
  };
  const list = JSON.parse(localStorage.getItem('techList') || '[]'); list.push(payload); localStorage.setItem('techList', JSON.stringify(list));
  document.getElementById('signupMsg').textContent = 'Saved locally.';
  setTimeout(()=>window.location='index.html',700);
});
