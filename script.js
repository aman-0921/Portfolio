// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  1.  STARFIELD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const starCanvas = document.getElementById('star-canvas');
const sctx = starCanvas.getContext('2d');
let sw, sh, stars;

function starResize() {
  sw = starCanvas.width = window.innerWidth;
  sh = starCanvas.height = window.innerHeight;
}

function initStars() {
  const count = window.innerWidth < 700 ? 140 : 260;
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * sw,
    y: Math.random() * sh,
    r: Math.random() * 1.4 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.02 + Math.random() * 0.05,
    drift: (Math.random() - 0.5) * 0.15
  }));
}

starResize();
initStars();
window.addEventListener('resize', () => { starResize();
  initStars(); });

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function drawStars(t) {
  sctx.clearRect(0, 0, sw, sh);
  for (const s of stars) {
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.phase));
    sctx.beginPath();
    sctx.fillStyle = `rgba(234,240,255,${tw})`;
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fill();
    if (!prefersReduced) {
      s.y += s.drift;
      if (s.y > sh) s.y = 0;
      if (s.y < 0) s.y = sh;
    }
  }
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  2.  NEURAL NET CANVAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const netCanvas = document.getElementById('net-canvas');
const ctx = netCanvas.getContext('2d');
let w, h, nodes;
const NODE_COUNT_BASE = 70;

function netResize() {
  w = netCanvas.width = window.innerWidth;
  h = netCanvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
}

function initNodes() {
  const count = window.innerWidth < 700 ? 30 : NODE_COUNT_BASE;
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * Math.min(h, window.innerHeight * 1.2),
    vx: (Math.random() - 0.5) * 0.9,
    vy: (Math.random() - 0.5) * 0.9,
    r: Math.random() * 1.6 + 0.8
  }));
}

netResize();
initNodes();
window.addEventListener('resize', () => { netResize();
  initNodes(); });

function drawNet() {
  ctx.clearRect(0, 0, w, h);
  const viewBottom = window.scrollY + window.innerHeight + 200;

  for (const n of nodes) {
    if (!prefersReduced) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > Math.min(h, window.innerHeight * 1.3)) n.vy *= -1;
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i],
        b = nodes[j];
      if (a.y > viewBottom && b.y > viewBottom) continue;
      const dx = a.x - b.x,
        dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(91,140,255,${(1 - dist / 150) * 0.22})`;
        ctx.lineWidth = 1;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const n of nodes) {
    if (n.y > viewBottom) continue;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(45,212,191,0.85)';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(45,212,191,0.8)';
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  requestAnimationFrame(drawNet);
}
drawNet();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  3.  FLOATING ELEMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const floatLayer = document.getElementById('float-layer');
const symbols = [
  { t: '&lt;/&gt;', cls: '' }, { t: '{ }', cls: 'teal' },
  { t: '01', cls: 'amber' }, { t: 'ƒ(x)', cls: '' },
  { t: 'λ', cls: 'teal' }, { t: '01001', cls: '' },
  { t: 'AI', cls: 'amber' }, { t: '( )=&gt;', cls: 'teal' },
  { t: '#!/', cls: '' }, { t: 'π', cls: 'amber' },
  { t: '[ ]', cls: '' }, { t: '++', cls: 'teal' },
  { t: 'JS', cls: 'amber' }, { t: 'PY', cls: 'teal' },
  { t: 'CSS3', cls: '' }, { t: 'TS', cls: 'amber' },
  { t: 'HTML5', cls: 'teal' }, { t: 'ML', cls: '' },
  { t: 'SQL', cls: 'amber' }, { t: 'git', cls: 'teal' },
];

const chipSVG =
  `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.4"/><rect x="11" y="11" width="8" height="8" rx="1" fill="currentColor" opacity=".5"/><path d="M11 3v4M15 3v4M19 3v4M11 23v4M15 23v4M19 23v4M3 11h4M3 15h4M3 19h4M23 11h4M23 15h4M23 19h4" stroke="currentColor" stroke-width="1.2"/></svg>`;

function getDocHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);
}

function spawnFloaters() {
  floatLayer.innerHTML = '';
  const pageH = getDocHeight();

  const glyphTotal = window.innerWidth < 700 ? 14 : 26;
  for (let i = 0; i < glyphTotal; i++) {
    const s = symbols[i % symbols.length];
    const el = document.createElement('div');
    el.className = 'float-item ' + s.cls;
    el.innerHTML = s.t;
    const size = 18 + Math.random() * 22;
    el.style.fontSize = size + 'px';
    el.style.top = (Math.random() * pageH * 0.96) + 'px';
    el.style.left = (Math.random() * 92) + 'vw';
    el.style.animationDuration = (4 + Math.random() * 4) + 's';
    el.style.animationDelay = (Math.random() * 3) + 's';
    floatLayer.appendChild(el);
  }

  const sphereTotal = window.innerWidth < 700 ? 6 : 12;
  for (let i = 0; i < sphereTotal; i++) {
    const el = document.createElement('div');
    el.className = 'node-sphere';
    const size = 8 + Math.random() * 16;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.top = (Math.random() * pageH * 0.96) + 'px';
    el.style.left = (Math.random() * 94) + 'vw';
    el.style.animationDuration = (3.5 + Math.random() * 3.5) + 's';
    el.style.animationDelay = (Math.random() * 3) + 's';
    floatLayer.appendChild(el);
  }

  const chipTotal = window.innerWidth < 700 ? 4 : 8;
  const chipColors = ['var(--primary)', 'var(--teal)', 'var(--amber)'];
  for (let i = 0; i < chipTotal; i++) {
    const el = document.createElement('div');
    el.className = 'chip-icon';
    el.innerHTML = chipSVG;
    el.style.color = chipColors[i % chipColors.length];
    const size = 24 + Math.random() * 16;
    el.style.width = size + 'px';
    el.style.top = (Math.random() * pageH * 0.96) + 'px';
    el.style.left = (Math.random() * 90) + 'vw';
    el.style.animationDuration = (4.5 + Math.random() * 4) + 's';
    el.style.animationDelay = (Math.random() * 3) + 's';
    floatLayer.appendChild(el);
  }

  const extraOrbSpecs = [
    { cls: 'orb-core', size: 300, top: pageH * 0.42, left: '72vw', dur: '12s' },
    { cls: 'orb-teal', size: 220, top: pageH * 0.68, left: '4vw', dur: '10s' },
    { cls: 'orb-amber', size: 160, top: pageH * 0.88, left: '80vw', dur: '9s' },
  ];
  extraOrbSpecs.forEach(spec => {
    const el = document.createElement('div');
    el.className = 'orb ' + spec.cls;
    el.style.width = spec.size + 'px';
    el.style.height = spec.size + 'px';
    el.style.top = spec.top + 'px';
    el.style.left = spec.left;
    el.style.animationDuration = spec.dur;
    floatLayer.appendChild(el);
  });
}

spawnFloaters();
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    spawnFloaters();
  }, 300);
});
window.addEventListener('load', () => setTimeout(spawnFloaters, 400));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  4.  SCROLL REVEAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

const skillEntries = document.querySelectorAll('.skill-entry');
const skillIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      skillIO.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
skillEntries.forEach(el => skillIO.observe(el));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  5.  MOBILE MENU
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  if (!open) {
    navLinks.style.cssText =
      'position:fixed;top:76px;left:0;right:0;flex-direction:column;background:rgba(6,11,20,.97);padding:26px;gap:22px;border-bottom:1px solid var(--line);z-index:60;display:flex;';
  } else {
    navLinks.style.cssText = '';
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  6.  FORMSPREE CONTACT FORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
window.formspree = window.formspree || function() { (formspree.q = formspree.q || []).push(arguments); };
formspree('initForm', {
  formElement: '#contact-form',
  formId: 'xdaqnklk'
});