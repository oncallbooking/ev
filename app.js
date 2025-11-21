// Dummy Services
const services = [
  {title:"EV Repair", img:"https://picsum.photos/seed/ev/400/300"},
  {title:"AC Service", img:"https://picsum.photos/seed/ac/400/300"},
  {title:"Solar Panel Care", img:"https://picsum.photos/seed/solar/400/300"},
];

const branches = [
  {city:"Delhi", pin:"110001", eta:"24-48h"},
  {city:"Bengaluru", pin:"560001", eta:"24h"},
  {city:"Lucknow", pin:"226001", eta:"48h"},
];

// Render service cards
const serviceCards = document.getElementById("serviceCards");
services.forEach(s=>{
  serviceCards.innerHTML += `
    <div class="card">
      <img src="${s.img}" alt="">
      <h3>${s.title}</h3>
    </div>`;
});

// Populate dropdown
const dropdown = document.getElementById("jobService");
services.forEach(s=>{
  dropdown.innerHTML += `<option>${s.title}</option>`;
});

// Search Branch
document.getElementById("searchBtn").addEventListener("click",()=>{
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const result = document.getElementById("searchResult");
  
  const found = branches.filter(b=> b.pin === query || b.city.toLowerCase().includes(query));
  if(found.length){
    result.textContent = `${found.length} branch found 🎉`;
    renderBranches(found);
  } else {
    result.textContent = `No service yet — we expand soon!`;
    renderBranches(branches);
  }
});

// Render branches
function renderBranches(list){
  const branchList = document.getElementById("branchList");
  branchList.innerHTML = "";
  list.forEach(b=>{
    branchList.innerHTML += `
      <div class="card">
        <h3>${b.city}</h3>
        <p>PIN: ${b.pin}</p>
        <p>ETA: ${b.eta}</p>
      </div>`;
  });
}

renderBranches(branches.slice(0,3));
