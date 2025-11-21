
// Common JS for multipage behaviors
document.addEventListener('DOMContentLoaded',()=>{

  // Mobile nav toggle
  const mBtn = document.getElementById('mToggle');
  const nav = document.getElementById('mNav');
  if(mBtn && nav){
    mBtn.addEventListener('click',()=> nav.classList.toggle('open'));
  }

  // Search (client-side demo)
  const sBtn = document.getElementById('searchBtn');
  if(sBtn){
    sBtn.addEventListener('click',()=>{
      const q = document.getElementById('searchInput').value.trim();
      if(!q){ alert('Enter PIN or city'); return; }
      alert('Demo search: showing results for ' + q);
    });
  }

});
