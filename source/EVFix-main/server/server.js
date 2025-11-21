// server/server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const repoRoot = path.join(__dirname, '..');
const dataDir = path.join(__dirname, 'data');
const techFile = path.join(dataDir, 'techs.json');
const jobFile = path.join(dataDir, 'jobs.json');

app.use(cors());
app.use(bodyParser.json({limit:'1mb'}));
app.use(express.static(repoRoot)); // serve frontend

async function readJSON(file, fallback=[]){
  try {
    const txt = await fs.readFile(file, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return fallback;
  }
}

async function writeJSON(file, obj){
  await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf8');
}

// GET all techs
app.get('/api/techs', async (req,res)=>{
  const arr = await readJSON(techFile, []);
  res.json(arr);
});

// GET single tech
app.get('/api/techs/:id', async (req,res)=>{
  const id = Number(req.params.id);
  const arr = await readJSON(techFile, []);
  const found = arr.find(x => x.id === id);
  if(!found) return res.status(404).json({error:'Not found'});
  res.json(found);
});

// POST tech (signup)
app.post('/api/techs', async (req,res)=>{
  const payload = req.body;
  let arr = await readJSON(techFile, []);
  payload.id = payload.id || Date.now();
  arr.push(payload);
  await writeJSON(techFile, arr);
  res.json({ok:true, id: payload.id});
});

// GET jobs
app.get('/api/jobs', async (req,res)=>{
  const arr = await readJSON(jobFile, []);
  res.json(arr);
});

// POST job
app.post('/api/jobs', async (req,res)=>{
  const payload = req.body;
  let arr = await readJSON(jobFile, []);
  payload.id = payload.id || Date.now();
  payload.created = payload.created || Date.now();
  payload.bids = payload.bids || [];
  arr.push(payload);
  await writeJSON(jobFile, arr);
  res.json({ok:true, id: payload.id});
});

// POST a bid (simple model: either add bid to a job or record inquiry)
app.post('/api/bid', async (req,res)=>{
  const { jobId, techId, clientName, message, price } = req.body;
  // if jobId provided, add to that job
  let jobs = await readJSON(jobFile, []);
  if(jobId){
    const job = jobs.find(j=>j.id==jobId);
    if(!job) return res.status(404).json({error:'Job not found'});
    job.bids = job.bids || [];
    job.bids.push({ id: Date.now(), techId, clientName, message, price, created: Date.now() });
    await writeJSON(jobFile, jobs);
    return res.json({ok:true});
  }
  // else, create a small record under a "inquiries" list (or return ok)
  return res.json({ok:true, note:'Bid received (prototype).'});
});

app.listen(PORT, ()=> console.log(`Server running: http://localhost:${PORT}`));
