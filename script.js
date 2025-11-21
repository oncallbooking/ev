// ---------------- Mock Data ----------------
const techs = [
  { id:"t1", name:"Arjun Rao", skills:["EV"], pin:"560001", rating:4.6, experience:4, online:true },
  { id:"t2", name:"Priya K", skills:["AC","Solar"], pin:"560002", rating:4.8, experience:6, online:false },
  { id:"t3", name:"Rakesh Menon", skills:["Battery","EV"], pin:"560003", rating:4.7, experience:5, online:true },
  { id:"t4", name:"Neha Pillai", skills:["Solar","AC"], pin:"560004", rating:4.9, experience:7, online:true },
];

const jobs = Array.from({ length: 6 }).map((_, i) => ({
  id: "j" + (i + 1),
  category: ["EV Repair", "AC Repair", "Solar Service"][i % 3],
  desc: "Sample job request description.",
  budget: 1000 + i * 200,
  expiresAt: Date.now() + 5 * 86400000,
}));

// -------------- Rendering Functions ---------------
function timeLeft(job) {
  const ms = job.expiresAt - Date.now();
  if (ms <= 0) return "Expired";
  const d = Math.floor(ms / 86400000);
  return `${d} days left`;
}

function renderTechs(service="", area="") {
  const box = document.getElementById("techList");
  box.innerHTML = "";

  const filtered = techs.filter(t =>
    (!service || t.skills.join(" ").toLowerCase().includes(service)) &&
    (!area || t.pin.startsWith(area))
  );

  if (filtered.length === 0) {
    box.innerHTML = `<p>No technicians found.</p>`;
    return;
  }

  filtered.forEach(t => {
    box.innerHTML += `
      <div class="tech-item">
        <div style="display:flex;justify-content:space-between">
          <strong>${t.name}</strong>
          <div class="status-dot" style="background:${t.online ? 'green':'red'}"></div>
        </div>
        <div>Skills: ${t.skills.join(", ")}</div>
        <div>Rating: ⭐ ${t.rating}</div>
        <div>Experience: ${t.experience} yrs</div>
        <div>Location: ${t.pin}</div>
      </div>
    `;
  });
}

function renderJobs(area="") {
  const box = document.getElementById("jobList");
  box.innerHTML = "";

  const filtered = jobs.filter(j => (!area || j.pin?.startsWith(area)));

  filtered.forEach(j => {
    box.innerHTML += `
      <div class="job-item">
        <strong>${j.category}</strong>
        <div>${j.desc}</div>
        <div>Budget: ₹${j.budget}</div>
        <div style="color:cyan">${timeLeft(j)}</div>
      </div>
    `;
  });
}

// ----------- Search Filtering (Live) -------------
document.getElementById("serviceInput").addEventListener("input", filterAll);
document.getElementById("areaInput").addEventListener("input", filterAll);

function filterAll() {
  const service = document.getElementById("serviceInput").value.toLowerCase();
  const area = document.getElementById("areaInput").value;
  renderTechs(service, area);
  renderJobs(area);
}

// Initial Load
renderTechs();
renderJobs();
