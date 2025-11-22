/* =========================
   Theme tokens & base
   ========================= */
:root{
  --bg: #07121a;
  --panel: #0f1724;
  --muted: #94a3b8;
  --accent1: #06b39a;
  --accent2: #03a4f3;
  --glass: rgba(255,255,255,0.03);
  --card: #0f1724;
  --radius: 14px;
  --maxwidth: 1180px;
  --gap: 18px;
  --text: #e6eef2;
  --card-shadow: 0 8px 30px rgba(2,6,23,0.55);
  --btn-radius: 10px;
  --transition: 220ms cubic-bezier(.2,.9,.2,1);
}

/* Theme presets (applied by body[data-theme="..."]) */
body[data-theme="dark"]{
  --bg: #07121a;
  --panel: #0f1724;
  --muted: #94a3b8;
  --text: #e6eef2;
  --accent1: #06b39a;
  --accent2: #03a4f3;
}
body[data-theme="green"]{
  --bg: linear-gradient(180deg,#05120f,#06191a);
  --panel: rgba(6,179,154,0.06);
  --muted: #cfeae4;
  --text: #04221b;
  --accent1: #06b39a;
  --accent2: #04c0b2;
}
body[data-theme="orange"]{
  --bg: linear-gradient(180deg,#2b1306,#120904);
  --panel: rgba(255,152,80,0.04);
  --muted: #ffdcbf;
  --text: #2b1202;
  --accent1: #ff8c42;
  --accent2: #ffd166;
}
body[data-theme="blue"]{
  --bg: linear-gradient(180deg,#031026,#071834);
  --panel: rgba(3,164,243,0.04);
  --muted: #cfe8f8;
  --text: #001427;
  --accent1: #03a4f3;
  --accent2: #06a0d9;
}
body[data-theme="light"]{
  --bg: linear-gradient(180deg,#ffffff,#f6f9fb);
  --panel: #ffffff;
  --muted: #52606d;
  --text: #07121a;
  --accent1: #06b39a;
  --accent2: #03a4f3;
  --card-shadow: 0 10px 30px rgba(12,20,30,0.06);
}

/* -------------------------
   Base layout
   ------------------------- */
*{box-sizing:border-box}
html,body{height:100%; margin:0; font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; color:var(--text); background:var(--bg); transition: background var(--transition), color var(--transition) }
.page{max-width:var(--maxwidth); margin:18px auto; padding:0 18px 40px}

/* Header */
header{
  display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-radius:12px;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), transparent);
  border:1px solid rgba(255,255,255,0.02);
  margin:8px 0 18px; position:sticky; top:10px; z-index:40; backdrop-filter: blur(6px);
}
.brand{display:flex; align-items:center; gap:12px}
.logo{width:46px;height:46px;border-radius:10px; display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--text); box-shadow: 0 8px 24px rgba(3,164,243,0.06); background: linear-gradient(135deg,var(--accent1),var(--accent2))}
.site-title{margin:0;font-size:16px}
nav.nav a{color:var(--muted); text-decoration:none; font-size:13px; margin-left:12px}
.actions{display:flex; gap:10px; align-items:center}

/* Theme "Play" buttons container */
.play-themes{display:flex; gap:8px; align-items:center; padding-right:6px}
.theme-btn{
  width:34px; height:34px; border-radius:50%; border:0; cursor:pointer; position:relative;
  box-shadow: 0 6px 18px rgba(2,6,23,0.25);
  transform:translateY(0); transition: transform var(--transition), box-shadow var(--transition), opacity 180ms;
  outline: none;
}
.theme-btn.pressed{ transform: translateY(2px) scale(.98); box-shadow: 0 3px 10px rgba(2,6,23,0.12); opacity:0.95; }

/* specific theme swatches */
.theme-green{ background: linear-gradient(135deg,#07c5a0,#04c0b2); border: 1px solid rgba(4,160,130,0.12) }
.theme-orange{ background: linear-gradient(135deg,#ff8c42,#ffd166); border: 1px solid rgba(255,140,66,0.08) }
.theme-blue{ background: linear-gradient(135deg,#03a4f3,#06a0d9); border: 1px solid rgba(3,164,243,0.08) }
.theme-light{ background: linear-gradient(135deg,#ffffff,#f3f7fa); border: 1px solid rgba(10,20,30,0.04) }
.theme-dark{ background: linear-gradient(135deg,#000000,#2b2f36); border: 1px solid rgba(255,255,255,0.02) }

/* Buttons */
.btn{ padding:8px 12px; border-radius:var(--btn-radius); border:1px solid rgba(255,255,255,0.04); background:transparent; color:var(--muted); cursor:pointer; transition: transform var(--transition), box-shadow var(--transition) }
.btn:active{ transform: translateY(2px); box-shadow:none }
.btn-primary{ background: linear-gradient(90deg,var(--accent1),var(--accent2)); color:var(--text); border:0; font-weight:700 }

/* HERO */
.hero{ display:flex; gap:22px; align-items:stretch; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding:22px; border-radius:var(--radius); border:1px solid rgba(255,255,255,0.03) }
.hero-left{flex:1; min-width:260px}
.hero-left h2{margin:0;font-size:20px}
.hero-left .sub{color:var(--muted); margin-top:8px}
.hero-right{width:360px;flex-shrink:0}
.hero-right img{width:100%;height:100%;object-fit:cover;border-radius:12px;display:block}

/* search */
.search-card{ margin-top:16px; background:var(--panel); padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.02) }
.search-row{ display:flex; gap:8px; align-items:center }
.search-row input, .search-row select{ flex:1; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.04); background:transparent; color:inherit; font-size:14px }
.search-go{ min-width:90px; padding:10px; border-radius:10px; border:0; background:linear-gradient(90deg,var(--accent1),var(--accent2)); color:var(--text); font-weight:700; cursor:pointer }

/* Quick stats */
.quick-stats{ display:flex; gap:12px; margin-top:16px }
.stat{ flex:1; padding:12px; border-radius:12px; background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent); border:1px solid rgba(255,255,255,0.02); text-align:center }
.num{ font-size:20px; font-weight:800 }
.muted{ color:var(--muted); font-size:13px }

/* layout two-box */
.two-box-wrap{ margin-top:18px; display:flex; gap:var(--gap); width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; scroll-snap-type:x mandatory; padding-bottom:8px }
.panel{ flex:0 0 48%; min-width:520px; background:var(--panel); border-radius:var(--radius); border:1px solid rgba(255,255,255,0.03); padding:16px; scroll-snap-align:center; box-shadow: var(--card-shadow) }

/* small screen adjustments */
@media(max-width:1100px){
  .panel{ min-width:480px; flex:0 0 85% }
  .hero-right{ display:none }
  .hero{ flex-direction:column }
}
@media(max-width:560px){
  .panel{ min-width:78vw }
}

/* technician card */
.tech-card{ display:flex; gap:12px; align-items:center; padding:12px; border-radius:12px; margin-bottom:12px; background: linear-gradient(180deg, rgba(255,255,255,0.006), transparent); border:1px solid rgba(255,255,255,0.02); transition: transform var(--transition), box-shadow var(--transition) }
.tech-card:hover{ transform: translateY(-6px); box-shadow: 0 18px 50px rgba(2,6,23,0.35) }
.avatar{ width:64px; height:64px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; color:var(--text); font-size:16px; flex-shrink:0; background: linear-gradient(135deg,var(--accent1),var(--accent2)) }
.tech-main b{ display:block; font-size:15px }
.tech-sub{ color:var(--muted); font-size:13px; margin-top:6px }
.tech-meta{ display:flex; gap:8px; margin-top:8px }
.chip{ background:rgba(255,255,255,0.02); padding:6px 8px; border-radius:10px; font-size:13px; color:var(--muted) }
.rating{ background: linear-gradient(90deg,#ffd166,#ff8c42); padding:6px 8px; border-radius:10px; font-weight:700; color:#04121a; font-size:13px }

/* job card */
.job-card{ padding:12px; border-radius:12px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.02); background: linear-gradient(180deg, rgba(255,255,255,0.005), transparent) }
.job-top{ display:flex; justify-content:space-between; align-items:flex-start; gap:10px }
.price-tag{ background:rgba(7,178,168,0.12); color:var(--accent1); padding:6px 10px; border-radius:10px; font-weight:700 }
.bid-btn{ background: linear-gradient(90deg,var(--accent2),#06a0d9); border:0; color:#00141e; padding:8px 12px; border-radius:10px; font-weight:800; cursor:pointer }

/* utility */
.services-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:14px; }
.hint{ margin-top:6px; margin-bottom:12px; }

/* links */
a.link{ color:var(--accent2); text-decoration:none }

/* subtle scrollbar for horizontal panels */
.two-box-wrap::-webkit-scrollbar{ height:10px }
.two-box-wrap::-webkit-scrollbar-thumb{ background: rgba(0,0,0,0.12); border-radius:8px }

/* small interactive details for theme button focus */
.theme-btn:focus{ box-shadow: 0 6px 20px rgba(0,0,0,0.16); transform:translateY(-2px) scale(1.02) }

/* Accessibility tweak: ensure contrast for light theme buttons/text */
body[data-theme="light"] .muted{ color:var(--muted) }
