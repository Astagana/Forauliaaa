/* ===== EDIT DI SINI ===== */
const CONFIG = {
  birthday: "2026-10-29T00:00:00", // tanggal ulang tahun Aulia (yang akan datang)
  from: "Dias",
  music: "Lagu.mp3", // taruh file mp3 di folder music/, lalu samakan namanya di sini. Kosongkan ("") untuk musik bawaan.
  letter: [
    "Aulia, hari ini milik kamu sepenuhnya. Semoga semua hal baik yang kamu tunggu pelan-pelan datang, dan semua yang berat jadi lebih ringan.",
    "Terima kasih sudah jadi orang yang bikin hari-hari terasa lebih hangat. Kamu mungkin nggak sadar, tapi kehadiranmu berarti banget.",
    "Tahun ini, semoga kamu lebih sering tertawa, lebih jarang mikirin hal yang nggak perlu, dan selalu dikelilingi orang-orang yang tulus."
  ],
  // taruh foto di folder img/, lalu isi src (contoh "img/foto1.jpg"). Kosong = inisial.
  photos: [
    {src:"foto1.jpg", cap:"1"},
    {src:"foto2.jpg", cap:"2"},
    {src:"foto3.jpg", cap:"3"},
    {src:"foto4.jpg", cap:"4"}
  ],
  cards: [
    {f:"Senyum", b:"Senyummu bikin suasana apa pun jadi lebih tenang."},
    {f:"Hangat", b:"Kamu punya cara membuat orang merasa diterima apa adanya."},
    {f:"Kuat", b:"Kamu lebih kuat dari yang kamu kira, dan itu keren banget."}
  ],
  wishes: [
    "Semoga setiap langkahmu dimudahkan, dan setiap mimpimu pelan-pelan jadi nyata.",
    "Semoga kamu selalu sehat, bahagia, dan dicintai dengan cara yang paling tulus.",
    "Semoga umur barumu penuh kejutan manis dan alasan untuk tersenyum."
  ],
  finale: "Semoga permintaanmu dikabulkan, Aulia.",
  closing: "Terima kasih sudah jadi kamu. Semoga tahun ini jadi yang terbaik."
};
/* ========================= */

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const pages = $$(".page"), stage = $("#stage"), fine = matchMedia("(pointer:fine)").matches;
let cur = 0, busy = false;

/* isi konten */
$("#frames").innerHTML = CONFIG.photos.map((p,i) =>
  `<figure class="frame" style="--i:${i};--r:${[-3,2,-1.5,3][i%4]}deg"><div class="ph">${p.src?`<img src="${p.src}" alt="${p.cap}">`:"A"}</div><p>${p.cap}</p></figure>`).join("");
$("#cards").innerHTML = CONFIG.cards.map((c,i) =>
  `<div class="flip" style="--i:${i}" tabindex="0" role="button" aria-label="${c.f}"><div class="fi"><div class="fc ff">${c.f}</div><div class="fc fb">${c.b}</div></div></div>`).join("");
$("#wishList").innerHTML = CONFIG.wishes.map((w,i) => `<div class="wish" style="--i:${i}"><q>${w}</q><span>${CONFIG.from}</span></div>`).join("");
$("#closing").textContent = CONFIG.closing;
$("#sign").textContent = "— " + CONFIG.from;
$$(".flip").forEach(f => { f.onclick = () => { f.classList.toggle("on"); chime(); };
  f.onkeydown = e => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); f.click(); } }; });
$("#dots").innerHTML = pages.map((p,i) => `<button aria-label="${p.dataset.t}" title="${p.dataset.t}"></button>`).join("");
$$("#dots button").forEach((b,i) => b.onclick = () => go(i));

/* countdown */
function tick(){
  const el = $("#count"), d = new Date(CONFIG.birthday) - new Date();
  el.textContent = d <= 0 ? "Hari ini adalah harimu." :
    `${Math.floor(d/864e5)} hari ${Math.floor(d/36e5)%24} jam ${Math.floor(d/6e4)%60} menit menuju harimu`;
}
tick(); setInterval(tick, 30000);

/* ===== partikel: debu emas, confetti, kembang api ===== */
const cv = $("#fx"), cx = cv.getContext("2d"), R = Math.min(devicePixelRatio||1, 2);
let W, H, P = [], dust = [];
const size = () => { W = cv.width = innerWidth*R; H = cv.height = innerHeight*R; };
size(); addEventListener("resize", size);
for (let i = 0; i < 50; i++) dust.push({x:Math.random(),y:Math.random(),s:(.6+Math.random()*1.8),v:.00006+Math.random()*.00014,p:Math.random()*6});
const GOLD = ["#f3dfb4","#e3c58f","#c98f7b","#fbf5ec","#e8b4a6"];
function burst(x, y, n=140){ for (let i=0;i<n;i++){ const a=Math.random()*6.28,s=(4+Math.random()*9)*R;
  P.push({k:"c",x:x*R,y:y*R,vx:Math.cos(a)*s,vy:Math.sin(a)*s-5*R,w:(4+Math.random()*5)*R,h:(8+Math.random()*9)*R,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:GOLD[i%5],l:1,d:.004}); } }
function spark(x, y){ P.push({k:"s",x:x*R,y:y*R,vx:(Math.random()-.5)*1.2*R,vy:(Math.random()*.8)*R,w:(1+Math.random()*2.2)*R,c:GOLD[(Math.random()*5)|0],l:1,d:.025}); }
function rocket(){ const tx=(.15+Math.random()*.7)*W, ty=(.12+Math.random()*.35)*H;
  P.push({k:"r",x:tx+(Math.random()-.5)*80*R,y:H,tx,ty,vy:-(13+Math.random()*4)*R,c:GOLD[(Math.random()*5)|0],l:1}); }
function explode(x,y,c){ const n=80; for(let i=0;i<n;i++){ const a=i/n*6.28,s=(2+Math.random()*4.5)*R;
  P.push({k:"f",x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,w:(1.6+Math.random()*1.6)*R,c:Math.random()<.5?c:"#fbf5ec",l:1,d:.011}); } }
let last = 0;
function loop(t){
  cx.clearRect(0,0,W,H);
  dust.forEach(d => { d.y -= d.v*16; d.x += Math.sin(t/3000+d.p)*.0002; if (d.y<-.02){d.y=1.02;d.x=Math.random();}
    cx.globalAlpha = .15+.35*Math.abs(Math.sin(t/1400+d.p)); cx.fillStyle="#e3c58f"; cx.beginPath(); cx.arc(d.x*W,d.y*H,d.s*R,0,6.28); cx.fill(); });
  P = P.filter(p => p.l > 0);
  P.forEach(p => {
    if (p.k==="r"){ p.y+=p.vy; p.vy*=.985; p.x+=(p.tx-p.x)*.03; spark(p.x/R,p.y/R); if (p.y<=p.ty||p.vy>-2){ explode(p.x,p.y,p.c); p.l=0; } return; }
    p.x+=p.vx; p.y+=p.vy; p.l-=p.d;
    if (p.k==="c"){ p.vy+=.22*R; p.vx*=.99; p.r+=p.vr; cx.save(); cx.globalAlpha=Math.max(p.l,0); cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle=p.c; cx.fillRect(-p.w/2,-p.h/2,p.w,p.h); cx.restore(); }
    else { if (p.k==="f"){ p.vy+=.045*R; p.vx*=.985; } cx.globalAlpha=Math.max(p.l,0); cx.fillStyle=p.c; cx.beginPath(); cx.arc(p.x,p.y,p.w,0,6.28); cx.fill(); }
  });
  cx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ===== musik kotak musik (dibuat langsung di browser) ===== */
let ac, master, loopT, song, musicOn = true, synthOn = false;
const synth = () => { if (synthOn) return; synthOn = true; play(); };
const F = {G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99};
const MEL = [["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
  ["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",3]];
function tone(f, t, d, v=.22){ const o=ac.createOscillator(), g=ac.createGain(); o.type="triangle"; o.frequency.value=f;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+d+.05); }
function play(){ let t = ac.currentTime+.1; const b = .72;
  MEL.forEach(([n,l]) => { tone(F[n],t,l*b*1.6); tone(F[n]*2,t,l*b,.06); t += l*b; });
  loopT = setTimeout(play, (t-ac.currentTime+3)*1000); }
function startMusic(){ if (ac) return;
  try { ac = new (window.AudioContext||window.webkitAudioContext)(); master = ac.createGain(); master.gain.value=.5;
    const dl = ac.createDelay(); dl.delayTime.value=.32; const fb = ac.createGain(); fb.gain.value=.38;
    master.connect(ac.destination); master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ac.destination); } catch(e){}
  if (CONFIG.music){ song = new Audio(CONFIG.music); song.loop = true; song.volume = .7; song.onerror = synth; song.play().catch(synth); } else synth(); }
function chime(){ if (!ac||!musicOn) return; [F.C5,F.E5,F.G5].forEach((f,i)=>tone(f,ac.currentTime+i*.07,1.2,.1)); }
$("#snd").onclick = e => { musicOn = !musicOn; e.target.classList.toggle("off",!musicOn); if (musicOn){ ac&&ac.resume(); song&&!synthOn&&song.play().catch(()=>{}); } else { ac&&ac.suspend(); song&&song.pause(); } };

/* ===== surat diketik ===== */
let typeTok = 0;
async function typeLetter(){
  const tok = ++typeTok, box = $("#typed"), sign = $("#sign"); box.innerHTML = ""; sign.classList.remove("on");
  const fast = matchMedia("(prefers-reduced-motion:reduce)").matches;
  await new Promise(r => setTimeout(r, 900));
  for (const para of CONFIG.letter){ const p = document.createElement("p"); p.className="cur"; box.appendChild(p);
    for (const ch of para){ if (tok!==typeTok) return; p.textContent += ch; if (!fast) await new Promise(r => setTimeout(r, 24)); }
    p.classList.remove("cur"); }
  if (tok===typeTok) sign.classList.add("on");
}

/* ===== kue ===== */
let blown = false, micStream;
function blow(){ if (blown) return; blown = true; $("#cakeSvg").classList.add("out"); $("#blow").disabled = $("#mic").disabled = true;
  if (micStream) micStream.getTracks().forEach(t => t.stop());
  const r = $("#cakeSvg").getBoundingClientRect();
  setTimeout(() => { burst(r.left+r.width/2, r.top+r.height*.3, 200); setTimeout(()=>burst(innerWidth*.2,innerHeight*.6,80),250); setTimeout(()=>burst(innerWidth*.8,innerHeight*.6,80),450);
    const a = $("#after"); a.textContent = CONFIG.finale; a.hidden = false; }, 550); }
$("#blow").onclick = blow;
$("#mic").onclick = async e => { try { micStream = await navigator.mediaDevices.getUserMedia({audio:true});
    const c = new AudioContext(), an = c.createAnalyser(); c.createMediaStreamSource(micStream).connect(an); const d = new Uint8Array(an.fftSize); let n = 0;
    e.target.textContent = "Tiup sekarang...";
    (function chk(){ if (blown) return; an.getByteTimeDomainData(d); let s=0; for (const v of d) s+=(v-128)**2; n = Math.sqrt(s/d.length)>28 ? n+1 : Math.max(0,n-1); n>6 ? blow() : requestAnimationFrame(chk); })();
  } catch(err){ e.target.textContent = "Mic tidak aktif, pakai tombol"; e.target.disabled = true; } };

/* ===== kembang api ===== */
let fwT;
const fwStart = () => { rocket(); fwT = setInterval(() => { rocket(); if (Math.random()<.5) setTimeout(rocket,300); }, 1300); };
const fwStop = () => clearInterval(fwT);
$("#again").onclick = () => go(0);

/* ===== navigasi halaman ===== */
function go(n){
  if (n<0 || n>=pages.length || n===cur || busy) return;
  busy = true; const old = pages[cur], dir = n>cur ? 1 : -1;
  stage.classList.add("nt"); document.documentElement.style.setProperty("--dir", dir); void stage.offsetWidth; stage.classList.remove("nt");
  old.classList.add("out"); old.classList.remove("active"); pages[n].scrollTop = 0; pages[n].classList.add("active");
  if (cur===6 || n===6) {} if (cur===7) fwStop(); if (cur===2) typeTok++;
  cur = n;
  $$("#dots button").forEach((b,i) => b.classList.toggle("on", i===n));
  if (n===2) typeLetter(); if (n===7){ setTimeout(()=>{ burst(innerWidth/2,innerHeight/2,180); fwStart(); }, 700); }
  if (n>0){ $("#snd").hidden = $("#dots").hidden = false; }
  if (n===1) $("#tip").hidden = false;
  setTimeout(() => { old.classList.remove("out"); busy = false; }, 900);
}
const next = () => go(cur+1), prev = () => go(cur-1);
const interactive = el => el.closest("button,.flip,a");
function begin(){ startMusic(); burst(innerWidth/2, innerHeight/2.2, 170); next(); }

let swiped = 0, tx = 0, ty = 0;
addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, {passive:true});
addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5){ swiped = Date.now(); if (cur===0) begin(); else dx<0 ? next() : prev(); } }, {passive:true});
addEventListener("click", e => {
  if (Date.now()-swiped < 500 || interactive(e.target)) return;
  if (cur===0) return begin();
  e.clientX < innerWidth/2 ? prev() : next();
});
addEventListener("contextmenu", e => { e.preventDefault(); cur===0 ? begin() : next(); });
addEventListener("keydown", e => {
  if (["ArrowRight","PageDown"].includes(e.key) || (e.key===" " && !interactive(document.activeElement||document.body))) { e.preventDefault(); cur===0 ? begin() : next(); }
  else if (["ArrowLeft","PageUp"].includes(e.key)) prev();
  else if (e.key==="Home") go(0); else if (e.key==="End") go(pages.length-1);
});
let wl = 0;
addEventListener("wheel", e => { const p = pages[cur]; if (Math.abs(e.deltaY)<30 || Date.now()-wl<1100 || p.scrollHeight>p.clientHeight+2) return;
  wl = Date.now(); e.deltaY>0 ? (cur===0 ? begin() : next()) : prev(); }, {passive:true});

/* kursor emas + jejak kilau */
if (fine){ document.body.classList.add("fine"); const c = $("#cur");
  addEventListener("mousemove", e => { c.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    c.textContent = cur===0 ? "✦" : (e.clientX < innerWidth/2 ? "‹" : "›");
    c.classList.toggle("hide", !!interactive(e.target)); if (Math.random()<.6) spark(e.clientX, e.clientY); }); }

/* mulai */
pages[0].classList.add("active");
