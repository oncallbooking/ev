const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const cors = require('cors');
const { nanoid } = require('nanoid');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' }});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

async function initDB(){
  await db.read();
  db.data = db.data || { users: [], techs: [], jobs: [], bids: [], chats: [] };
  await db.write();
}
initDB();

// Simple auth mock: create/get user by phone or googleId
app.post('/api/auth/login', async (req, res) => {
  const { phone, role='customer', name } = req.body;
  if(!phone) return res.status(400).json({error:'phone required'});
  await db.read();
  let user = db.data.users.find(u=>u.phone===phone);
  if(!user){
    user = { id: nanoid(), phone, role, name: name||('User-'+phone.slice(-4)), createdAt: Date.now() };
    db.data.users.push(user);
    await db.write();
  }
  res.json({ status:'ok', user, token: 'mock-token-'+user.id });
});

// Search techs by pin
app.get('/api/techs', async (req, res) => {
  const { pin, service } = req.query;
  await db.read();
  let techs = db.data.techs || [];
  if(pin){
    techs = techs.filter(t => (t.pins||[]).includes(pin));
  }
  if(service){
    techs = techs.filter(t => (t.services||[]).includes(service));
  }
  res.json({ status:'ok', data: techs.slice(0,50) });
});

// Tech signup
app.post('/api/techs', async (req, res) => {
  const t = req.body;
  await db.read();
  const tech = { id: nanoid(), createdAt: Date.now(), ...t };
  db.data.techs.push(tech);
  await db.write();
  res.json({ status:'ok', tech });
});

// Post job
app.post('/api/jobs', async (req, res) => {
  const job = { id: nanoid(), createdAt: Date.now(), status:'open', bids:[], ...req.body };
  await db.read();
  db.data.jobs.push(job);
  await db.write();
  res.json({ status:'ok', job });
});

// Get jobs for a user
app.get('/api/jobs', async (req, res) => {
  const { userId } = req.query;
  await db.read();
  let jobs = db.data.jobs || [];
  if(userId) jobs = jobs.filter(j => j.customerId === userId);
  res.json({ status:'ok', jobs });
});

// Place a bid
app.post('/api/jobs/:jobId/bids', async (req, res) => {
  const { jobId } = req.params;
  const bid = { id: nanoid(), jobId, createdAt: Date.now(), ...req.body };
  await db.read();
  db.data.bids.push(bid);
  // attach to job
  const job = db.data.jobs.find(j => j.id===jobId);
  if(job) job.bids.push(bid.id);
  await db.write();
  // notify via socket
  io.to(jobId).emit('newBid', bid);
  res.json({ status:'ok', bid });
});

// Simple chat (socket.io)
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('joinJob', (jobId) => {
    socket.join(jobId);
  });
  socket.on('msg', async (payload) => {
    // payload: { jobId, from, text }
    await db.read();
    const m = { id: nanoid(), createdAt: Date.now(), ...payload };
    db.data.chats.push(m);
    await db.write();
    io.to(payload.jobId).emit('msg', m);
  });
});

// Static service worker
app.get('/sw.js', (req,res) => {
  res.type('application/javascript');
  res.sendFile(require('path').join(__dirname,'public','sw.js'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log('Server running on port', PORT));
