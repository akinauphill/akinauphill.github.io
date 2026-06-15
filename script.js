/* ============================================================================
   akinauphill — portfolio behaviour
   Vanilla port of the React design prototype: view switching (home/projects),
   theme toggle, skill chips, project cards, category filtering, contact form.
   Project data sourced from real repos: github.com/akinauphill + KyotoServices.
   ========================================================================== */

const D = {
  stack: {
    Languages: ['java', 'kotlin', 'python', 'typescript', 'html/css/js'],
    Frameworks: ['angular', 'react', 'ktor'],
    Tools: ['git', 'spigot', 'packetevents', 'gradle'],
  },
  projects: [
    { name: 'CheatBreaker', monogram: 'cb', status: 'Live', statusVariant: 'accent', category: 'Minecraft', isPrivate: true,
      description: 'By far my most ambitious build — a Kotlin / Java 21 Spigot 1.21 anticheat & security plugin. Packet capture via PacketEvents, protocol-aware with ViaVersion / ViaBackwards / ViaRewind.',
      tech: ['kotlin', 'java', 'packetevents'], stats: [{ icon: '🛡', value: 'anticheat' }, { value: 'Kotlin' }], featured: true },
    { name: 'KyotoPractice', monogram: 'kp', status: 'Live', statusVariant: 'accent', category: 'Minecraft', isPrivate: true,
      description: 'A comprehensive 1.21+ practice plugin — duels, kits, ELO and arenas — built on KyotoCore.',
      tech: ['kotlin', 'java', 'kyotocore'], stats: [{ icon: '⚔', value: 'practice' }, { value: 'Kotlin' }] },
    { name: 'KyotoCore', monogram: 'kc', status: 'WIP', statusVariant: 'amber', category: 'Minecraft', isPrivate: true,
      description: 'Essential services framework for Hytale & Minecraft servers — staff, version and knockback context for the whole stack.',
      tech: ['kotlin', 'java'], stats: [{ icon: '⚙', value: 'framework' }, { value: 'Kotlin' }] },
    { name: 'Web-CompanyHome', monogram: 'wc', status: 'Live', statusVariant: 'accent', category: 'Web', isPrivate: true,
      description: 'The KyotoServices company site — Angular, i18n in 6 languages, dark/light theming and a live leaderboard.',
      tech: ['angular', 'typescript'], stats: [{ icon: '🌐', value: '6 languages' }, { value: 'Angular' }] },
    { name: 'KyotoBot', monogram: 'kb', status: 'Live', statusVariant: 'accent', category: 'Web', isPrivate: true,
      description: 'Community Discord bot — coded with vibes, runs the server day to day.',
      tech: ['kotlin'], stats: [{ icon: '💬', value: 'discord' }, { value: 'Kotlin' }] },
    { name: 'Unscramble', monogram: 'un', status: 'Done', statusVariant: 'neutral', category: 'Android',
      description: 'Android Basics in Kotlin word game — completed to tutorial spec while learning the platform.',
      tech: ['kotlin', 'android'], stats: [{ icon: '📱', value: 'public' }, { value: 'Kotlin' }] },
    { name: 'Mars Photos', monogram: 'mp', status: 'Done', statusVariant: 'neutral', category: 'Android',
      description: 'Android app pulling real NASA Mars rover imagery over a REST API with Retrofit + Coil.',
      tech: ['kotlin', 'android'], stats: [{ icon: '🛰', value: 'public' }, { value: 'Kotlin' }] },
  ],
  filters: ['All', 'Minecraft', 'Web', 'Android'],
};

/* ── Tiny DOM helpers (escape user-facing text, build elements) ─────────── */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const techChip = (t) => `<span class="au-chip"><span class="au-chip__slash">~/</span>${esc(t)}</span>`;

/* ProjectCard — mirrors components/content/ProjectCard.jsx markup. */
function projectCard(p) {
  const badges = [
    p.isPrivate ? '<span class="au-badge au-badge--lock">private</span>' : '',
    p.status ? `<span class="au-badge au-badge--${p.statusVariant || 'accent'}">${esc(p.status)}</span>` : '',
  ].join('');
  const tech = (p.tech || []).map(techChip).join('');
  const stats = (p.stats || []).map((s) =>
    `<span class="au-project__stat">${s.icon ? `<span>${s.icon}</span>` : ''}${esc(s.value)}</span>`).join('');
  return `
    <a class="au-project" href="#" data-noop>
      <div class="au-project__top">
        <span class="au-project__icon">${esc(p.monogram || p.name.slice(0, 2).toLowerCase())}</span>
        <div class="au-project__top-r">${badges}</div>
      </div>
      <div class="au-project__body">
        <div class="au-project__name">${esc(p.name)}</div>
        <p class="au-project__desc">${esc(p.description)}</p>
        ${tech ? `<div class="au-project__tech">${tech}</div>` : ''}
        ${stats ? `<div class="au-project__foot">${stats}</div>` : ''}
      </div>
    </a>`;
}

/* TerminalBlock — mirrors components/content/TerminalBlock.jsx. */
function terminalBlock(title, lines) {
  const body = lines.map((l) => {
    let html = '';
    if (l.cmd != null) {
      html += `<span class="au-term__prompt">${esc(l.prompt || 'akina@uphill')}</span>` +
              `<span class="au-term__path">:${esc(l.path || '~')}$ </span>` +
              `<span class="au-term__cmd">${esc(l.cmd)}</span>`;
    }
    if (l.out != null) html += `<span class="au-term__out">${esc(l.out) || '&nbsp;'}</span>`;
    if (l.comment != null) {
      const pad = (l.cmd != null || l.out != null) ? '&nbsp;&nbsp;' : '';
      html += `<span class="au-term__comment">${pad}// ${esc(l.comment)}</span>`;
    }
    if (l.cursor) html += '<span class="au-term__cursor"></span>';
    return `<div>${html}</div>`;
  }).join('');
  return `
    <div class="au-term">
      <div class="au-term__bar">
        <span class="au-term__dot" style="background: var(--accent)"></span>
        <span class="au-term__dot" style="background: var(--cyan)"></span>
        <span class="au-term__dot" style="background: var(--amber)"></span>
        <span class="au-term__title">${esc(title)}</span>
      </div>
      <div class="au-term__body">${body}</div>
    </div>`;
}

/* ── Skills grid ─────────────────────────────────────────────────────────── */
function renderSkills() {
  const el = document.getElementById('skillsGrid');
  el.innerHTML = Object.entries(D.stack).map(([group, items]) => `
    <div class="pf-skillcol">
      <div class="pf-skillcol__h">${esc(group)}</div>
      <div class="pf-skillcol__chips">${items.map(techChip).join('')}</div>
    </div>`).join('');
}

/* ── Homepage project preview (first 6) ──────────────────────────────────── */
function renderPreview() {
  document.getElementById('previewGrid').innerHTML =
    D.projects.slice(0, 6).map(projectCard).join('');
}

/* ── Projects page (featured panel + filterable grid) ────────────────────── */
let activeFilter = 'All';

function renderFilters() {
  const el = document.getElementById('filters');
  el.innerHTML = D.filters.map((f) =>
    `<button class="pf-filter${f === activeFilter ? ' is-active' : ''}" data-filter="${esc(f)}">${esc(f)}</button>`).join('');
}

function renderProjectsPage() {
  const featured = D.projects.find((p) => p.featured) || D.projects[0];

  // Featured panel — shown only when its category is in view.
  const slot = document.getElementById('featuredSlot');
  if (activeFilter === 'All' || featured.category === activeFilter) {
    slot.innerHTML = `
      <div class="pf-featured">
        <div class="pf-featured__panel">
          <div style="display: flex; gap: 0.5rem;">
            <span class="au-badge au-badge--solid">★ Flagship</span>
            <span class="au-badge au-badge--${featured.statusVariant}">${esc(featured.status)}</span>
          </div>
          <h2 class="pf-featured__name">${esc(featured.name)}</h2>
          <p class="pf-featured__desc">${esc(featured.description)}</p>
          <div class="pf-featured__tech">${featured.tech.map(techChip).join('')}</div>
        </div>
        ${terminalBlock('bash — ' + featured.name.toLowerCase(), [
          { cmd: 'git clone kyoto/' + featured.name.toLowerCase() },
          { out: 'Cloning into ' + featured.name + '...' },
          { cmd: './gradlew build' },
          { out: 'BUILD SUCCESSFUL', comment: 'kotlin · java 21' },
          { cmd: 'java -jar ' + featured.name + '.jar' },
          { out: '✓ anticheat online — packets hooked' },
          { prompt: 'akina@uphill', path: '~/kyoto', cursor: true },
        ])}
      </div>`;
  } else {
    slot.innerHTML = '';
  }

  // Grid — everything except the featured project, filtered by category.
  const list = D.projects.filter((p) =>
    p !== featured && (activeFilter === 'All' || p.category === activeFilter));
  document.getElementById('projectsGrid').innerHTML = list.map(projectCard).join('');
  document.getElementById('projectsEmpty').style.display = list.length ? 'none' : 'block';
}

/* ── View switching (home / projects) + nav active state ─────────────────── */
function setActiveNav(view) {
  document.querySelectorAll('.pf-nav__links button').forEach((b) => {
    const nav = b.getAttribute('data-nav');
    b.classList.toggle('is-active', (view === 'home' && nav === 'home') || (view === 'projects' && nav === 'projects'));
  });
}

function showView(view) {
  document.getElementById('view-home').classList.toggle('is-active', view === 'home');
  document.getElementById('view-projects').classList.toggle('is-active', view === 'projects');
  setActiveNav(view);
}

function go(target) {
  if (target === 'projects') {
    showView('projects');
    window.scrollTo({ top: 0 });
    return;
  }
  // 'home' or 'home#anchor'
  showView('home');
  const hash = target.split('#')[1];
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 70, behavior: 'smooth' });
    }, 40);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ── Theme toggle ────────────────────────────────────────────────────────── */
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  document.getElementById('themeToggle').textContent = next === 'dark' ? '◐' : '◑';
}

/* ============================================================================
   Easter eggs — for anyone poking at the source. On-brand: terminal/hacker.
   1) A styled DevTools console greeting (with a hint).
   2) Konami code (↑↑↓↓←→←→ B A) → "ACCESS GRANTED" + neon matrix rain.
   ========================================================================== */
function consoleGreeting() {
  try {
    const big = 'font: 700 22px "Space Mono", monospace; color: #b026ff; text-shadow: 0 0 8px rgba(176,38,255,.6);';
    const mono = 'font: 12px "Space Mono", monospace; color: #99a39b; line-height: 1.6;';
    console.log('%cakinauphill_', big);
    console.log('%c// poking around the source? i like you already.\n// say hi  → github.com/akinauphill\n// psst   → try the Konami code:  ↑ ↑ ↓ ↓ ← → ← → B A', mono);
  } catch (e) { /* no console — no problem */ }
}

function initEasterEgg() {
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const prefersReduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pos = 0, active = false, raf = null, drops = [];
  const FONT = 16;
  const GLYPHS = 'アイウエオカキクケコサシスセソ01<>/$#_{}[]=*+akinauphill';

  // Build the overlay once, lazily, so index.html stays clean.
  const egg = document.createElement('div');
  egg.className = 'au-egg';
  egg.innerHTML =
    '<canvas class="au-egg__canvas"></canvas>' +
    '<div class="au-egg__panel">' +
      '<div class="au-egg__title">root@akinauphill:~# ACCESS GRANTED</div>' +
      '<div class="au-egg__sub">you found the easter egg. now go build something.</div>' +
      '<div class="au-egg__hint">press any key or click to exit</div>' +
    '</div>';
  document.body.appendChild(egg);
  const canvas = egg.querySelector('.au-egg__canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = new Array(Math.ceil(canvas.width / FONT)).fill(0).map(() => Math.random() * -50);
  }
  function frame() {
    ctx.fillStyle = 'rgba(8, 10, 9, 0.12)';      // translucent wash → fading trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#b026ff';
    ctx.font = FONT + 'px "Space Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * FONT, drops[i] * FONT);
      if (drops[i] * FONT > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    raf = requestAnimationFrame(frame);
  }
  function closeOnce(e) { e.preventDefault(); close(); }
  function open() {
    if (active) return;
    active = true;
    egg.classList.add('is-on');
    if (!prefersReduce()) { resize(); window.addEventListener('resize', resize); raf = requestAnimationFrame(frame); }
    window.addEventListener('keydown', closeOnce, true);
    egg.addEventListener('click', close);
  }
  function close() {
    if (!active) return;
    active = false;
    egg.classList.remove('is-on');
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', closeOnce, true);
    egg.removeEventListener('click', close);
  }

  document.addEventListener('keydown', (e) => {
    if (active) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = (k === KONAMI[pos]) ? pos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (pos === KONAMI.length) { pos = 0; open(); }
  });
}

/* ── Wire up ─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  consoleGreeting();
  initEasterEgg();

  renderSkills();
  renderPreview();
  renderFilters();
  renderProjectsPage();

  // Nav buttons / CTAs that switch views or scroll to anchors.
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); go(btn.getAttribute('data-nav')); });
  });

  // Project filter pills (delegated — list is re-rendered).
  document.getElementById('filters').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    activeFilter = btn.getAttribute('data-filter');
    renderFilters();
    renderProjectsPage();
  });

  // Project cards are placeholder links — don't jump the page.
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('[data-noop]');
    if (card) e.preventDefault();
  });

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
