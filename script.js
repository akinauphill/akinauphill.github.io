/* ============================================================================
   akinauphill — portfolio behaviour
   Vanilla port of the React design prototype: view switching (home/projects),
   theme toggle, skill chips, project cards, source filtering, gists.

   Data model is HYBRID: a baked-in snapshot renders instantly and survives the
   GitHub API being offline / rate-limited, then a live fetch from api.github.com
   refreshes the public repos + gists. Curated KyotoServices work stays private
   (shown, labeled, never linked out).
   ========================================================================== */

const GH_USER = 'akinauphill';

const D = {
  stack: {
    Languages: ['java', 'kotlin', 'python', 'typescript', 'html/css/js'],
    Frameworks: ['angular', 'react', 'ktor'],
    Tools: ['git', 'spigot', 'packetevents', 'gradle'],
  },

  /* Private / curated — KyotoServices. Shown, labeled "private", never linked. */
  private: [
    { name: 'CheatBreaker', monogram: 'cb', status: 'Live', statusVariant: 'accent', group: 'KyotoServices', isPrivate: true, featured: true,
      language: 'Kotlin',
      description: 'By far my most ambitious build — a Kotlin / Java 21 Spigot 1.21 anticheat & security plugin. Packet capture via PacketEvents, protocol-aware with ViaVersion / ViaBackwards / ViaRewind.',
      tech: ['kotlin', 'java', 'packetevents'] },
    { name: 'KyotoPractice', monogram: 'kp', status: 'Live', statusVariant: 'accent', group: 'KyotoServices', isPrivate: true,
      language: 'Kotlin',
      description: 'A comprehensive 1.21+ practice plugin — duels, kits, ELO and arenas — built on KyotoCore.',
      tech: ['kotlin', 'java', 'kyotocore'] },
    { name: 'KyotoCore', monogram: 'kc', status: 'WIP', statusVariant: 'amber', group: 'KyotoServices', isPrivate: true,
      language: 'Kotlin',
      description: 'Essential services framework for Hytale & Minecraft servers — staff, version and knockback context for the whole stack.',
      tech: ['kotlin', 'java'] },
    { name: 'Web-CompanyHome', monogram: 'wc', status: 'Live', statusVariant: 'accent', group: 'KyotoServices', isPrivate: true,
      language: 'TypeScript',
      description: 'The KyotoServices company site — Angular, i18n in 6 languages, dark/light theming and a live leaderboard.',
      tech: ['angular', 'typescript'] },
    { name: 'KyotoBot', monogram: 'kb', status: 'Live', statusVariant: 'accent', group: 'KyotoServices', isPrivate: true,
      language: 'Kotlin',
      description: 'Community Discord bot — coded with vibes, runs the server day to day.',
      tech: ['kotlin'] },
  ],

  /* Public repos snapshot — instant paint; refreshed live from the GitHub API.
     Curated descriptions here fill in for repos that have none on GitHub. */
  publicSnapshot: [
    { name: 'akinauphill.github.io', language: 'CSS', isFork: false, stars: 0, updatedAt: '2026-06-15T04:24:44Z',
      url: 'https://github.com/akinauphill/akinauphill.github.io',
      description: 'This very portfolio — vanilla HTML/CSS/JS, no build step, neon-terminal design system.' },
    { name: 'Unscramble', language: 'Kotlin', isFork: false, stars: 0, updatedAt: '2022-08-02T23:18:39Z',
      url: 'https://github.com/akinauphill/Unscramble',
      description: 'Android Basics in Kotlin word game — completed to tutorial spec while learning the platform.' },
    { name: 'testScanner', language: 'Java', isFork: false, stars: 0, updatedAt: '2021-05-28T04:29:03Z',
      url: 'https://github.com/akinauphill/testScanner',
      description: 'Save Scanner(System.in) input to YAML using the Simple-YAML API.' },
    { name: 'dotfiles', language: 'Shell', isFork: false, stars: 0, updatedAt: '2021-05-23T07:11:30Z',
      url: 'https://github.com/akinauphill/dotfiles',
      description: 'My terminal & editor config. "Let\'s pray I don\'t upload any tokens to this."' },
    { name: 'fizzbuzz', language: 'Java', isFork: false, stars: 0, updatedAt: '2020-08-27T02:46:24Z',
      url: 'https://github.com/akinauphill/fizzbuzz',
      description: 'Classic FizzBuzz. "really easy, took 2.5 seconds."' },
    { name: 'android-basics-kotlin-mars-photos-app', language: 'Kotlin', isFork: true, stars: 0, updatedAt: '2023-05-02T23:32:39Z',
      url: 'https://github.com/akinauphill/android-basics-kotlin-mars-photos-app',
      description: 'Pulls real NASA Mars rover imagery over a REST API with Retrofit + Coil.' },
    { name: 'android-basics-kotlin-dogglers-app', language: 'Kotlin', isFork: true, stars: 0, updatedAt: '2021-12-01T00:20:05Z',
      url: 'https://github.com/akinauphill/android-basics-kotlin-dogglers-app',
      description: 'RecyclerView dog-cards app from the Android Basics in Kotlin course.' },
    { name: 'android-basics-kotlin-lemonade-app', language: 'Kotlin', isFork: true, stars: 0, updatedAt: '2021-08-04T23:18:26Z',
      url: 'https://github.com/akinauphill/android-basics-kotlin-lemonade-app',
      description: 'Tap-to-make-lemonade state-handling app from Android Basics in Kotlin.' },
    { name: 'samples', language: 'Java', isFork: true, stars: 0, updatedAt: '2020-08-06T14:54:13Z',
      url: 'https://github.com/akinauphill/samples',
      description: 'JavaFX samples to run with different options and build tools.' },
  ],

  /* Gists snapshot — refreshed live from the GitHub API. */
  gistsSnapshot: [
    { description: '(PowerShell Script) Git Pull-All for monorepos / folders', updatedAt: '2026-06-16T00:09:06Z',
      url: 'https://gist.github.com/akinauphill/352d4887706004ed248bc7a588d97654',
      files: [{ name: 'pull-all.ps1', lang: 'PowerShell' }] },
    { description: 'Kotlin List demonstration from the Google Codelab', updatedAt: '2021-10-20T00:40:41Z',
      url: 'https://gist.github.com/akinauphill/4f3c8ceadee1b401197254492a93fa9a',
      files: [
        { name: 'List.kt', lang: 'Kotlin' }, { name: 'ListComplete.kt', lang: 'Kotlin' },
        { name: 'Mutable.kt', lang: 'Kotlin' }, { name: 'Sort.kt', lang: 'Kotlin' },
        { name: 'While.kt', lang: 'Kotlin' },
      ] },
  ],

  filters: ['All', 'KyotoServices', 'Open source', 'Forks', 'Gists'],
  groupOrder: ['KyotoServices', 'Open source', 'Forks'],
};

/* ── Live runtime state (starts from the snapshot, replaced by live data) ──── */
let projects = [...D.private, ...D.publicSnapshot.map(snapshotToCard)];
let gists = D.gistsSnapshot.slice();
let activeFilter = 'All';

/* ── Tiny helpers ─────────────────────────────────────────────────────────── */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const techChip = (t) => `<span class="au-chip"><span class="au-chip__slash">~/</span>${esc(t)}</span>`;

/* GitHub-style language → dot colour. */
const LANG_COLORS = {
  kotlin: '#a97bff', java: '#b07219', css: '#563d7c', typescript: '#3178c6',
  javascript: '#f1e05a', python: '#3572a5', shell: '#89e051', html: '#e34c26',
  powershell: '#012456', 'c#': '#178600', 'c++': '#f34b7d', go: '#00add8',
};
const langColor = (lang) => LANG_COLORS[String(lang || '').toLowerCase()] || 'var(--text-tertiary)';

/* Relative time ("3mo ago") from an ISO string. */
const RTF = (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat)
  ? new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'narrow' }) : null;
function relTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const diff = then - Date.now();
  const units = [['year', 31536e6], ['month', 2592e6], ['week', 6048e5], ['day', 864e5], ['hour', 36e5], ['minute', 6e4]];
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms || unit === 'minute') {
      const v = Math.round(diff / ms);
      return RTF ? RTF.format(v, unit) : `${Math.abs(v)}${unit[0]} ago`;
    }
  }
  return 'just now';
}

/* Normalize a snapshot public entry into the unified card model. */
function snapshotToCard(r) {
  return {
    name: r.name, description: r.description || '', language: r.language || null,
    url: r.url, isFork: !!r.isFork, isPrivate: false, stars: r.stars || 0,
    updatedAt: r.updatedAt || null, group: r.isFork ? 'Forks' : 'Open source',
    monogram: r.name.replace(/[^a-z0-9]/gi, '').slice(0, 2).toLowerCase(),
  };
}

/* ── Card rendering (unified — clickable public, locked private) ──────────── */
function projectCard(p) {
  const clickable = !p.isPrivate && p.url;
  const tag = clickable ? 'a' : 'div';
  const attrs = clickable
    ? `href="${esc(p.url)}" target="_blank" rel="noreferrer" class="au-project au-project--link"`
    : `class="au-project au-project--locked"`;

  const badges = [
    p.isPrivate ? '<span class="au-badge au-badge--lock">private</span>' : '',
    p.isFork ? '<span class="au-badge au-badge--neutral">fork</span>' : '',
    p.status ? `<span class="au-badge au-badge--${p.statusVariant || 'accent'}">${esc(p.status)}</span>` : '',
  ].join('');

  const tech = (p.tech || []).map(techChip).join('');

  const meta = [
    p.language ? `<span class="au-project__stat"><span class="au-lang" style="background:${langColor(p.language)}"></span>${esc(p.language)}</span>` : '',
    p.stars ? `<span class="au-project__stat">★ ${esc(p.stars)}</span>` : '',
    p.updatedAt ? `<span class="au-project__stat">↻ ${esc(relTime(p.updatedAt))}</span>` : '',
    p.isPrivate ? '<span class="au-project__stat au-project__stat--muted">source private</span>' : '',
  ].filter(Boolean).join('');

  return `
    <${tag} ${attrs}>
      <div class="au-project__top">
        <span class="au-project__icon">${esc(p.monogram || p.name.slice(0, 2).toLowerCase())}</span>
        <div class="au-project__top-r">${badges}</div>
      </div>
      <div class="au-project__body">
        <div class="au-project__name">${esc(p.name)}${clickable ? '<span class="au-project__arrow">↗</span>' : ''}</div>
        <p class="au-project__desc">${esc(p.description) || '<span class="au-project__desc--empty">no description</span>'}</p>
        ${tech ? `<div class="au-project__tech">${tech}</div>` : ''}
        ${meta ? `<div class="au-project__foot">${meta}</div>` : ''}
      </div>
    </${tag}>`;
}

/* Gist card. */
function gistCard(g) {
  const files = (g.files || []).map((f) =>
    `<span class="au-chip"><span class="au-lang" style="background:${langColor(f.lang)}"></span>${esc(f.name)}</span>`).join('');
  const count = (g.files || []).length;
  return `
    <a class="au-project au-project--link" href="${esc(g.url)}" target="_blank" rel="noreferrer">
      <div class="au-project__top">
        <span class="au-project__icon">{ }</span>
        <div class="au-project__top-r">
          <span class="au-badge au-badge--cyan">gist</span>
          <span class="au-badge au-badge--neutral">${count} file${count === 1 ? '' : 's'}</span>
        </div>
      </div>
      <div class="au-project__body">
        <p class="au-project__desc au-project__desc--lead">${esc(g.description) || '<span class="au-project__desc--empty">untitled gist</span>'}<span class="au-project__arrow">↗</span></p>
        ${files ? `<div class="au-project__tech">${files}</div>` : ''}
        ${g.updatedAt ? `<div class="au-project__foot"><span class="au-project__stat">↻ ${esc(relTime(g.updatedAt))}</span></div>` : ''}
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

/* ── Homepage preview — flagships first, then freshest public repos ───────── */
function renderPreview() {
  const flagships = projects.filter((p) => p.isPrivate).slice(0, 3);
  const fresh = projects.filter((p) => !p.isPrivate)
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3);
  const highlights = [...flagships, ...fresh].slice(0, 6);
  document.getElementById('previewGrid').innerHTML = highlights.map(projectCard).join('');
}

/* Update the "repos shipped" stat to the real combined count. */
function renderStats() {
  const el = document.getElementById('statRepos');
  if (el) el.textContent = projects.length;
}

/* ── Projects page (featured panel + grouped, filterable grid + gists) ────── */
function renderFilters() {
  document.getElementById('filters').innerHTML = D.filters.map((f) =>
    `<button class="pf-filter${f === activeFilter ? ' is-active' : ''}" data-filter="${esc(f)}">${esc(f)}</button>`).join('');
}

function renderProjectsPage() {
  const featured = projects.find((p) => p.featured) || projects[0];
  const showFeatured = (activeFilter === 'All' || activeFilter === 'KyotoServices') && featured;

  document.getElementById('featuredSlot').innerHTML = !showFeatured ? '' : `
    <div class="pf-featured">
      <div class="pf-featured__panel">
        <div style="display: flex; gap: 0.5rem;">
          <span class="au-badge au-badge--solid">★ Flagship</span>
          <span class="au-badge au-badge--lock">private</span>
          <span class="au-badge au-badge--${featured.statusVariant}">${esc(featured.status)}</span>
        </div>
        <h2 class="pf-featured__name">${esc(featured.name)}</h2>
        <p class="pf-featured__desc">${esc(featured.description)}</p>
        <div class="pf-featured__tech">${(featured.tech || []).map(techChip).join('')}</div>
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

  // Grouped grids — everything except the featured card, filtered by source.
  const groupsEl = document.getElementById('projectsGroups');
  if (activeFilter === 'Gists') {
    groupsEl.innerHTML = '';
  } else {
    const blocks = D.groupOrder
      .filter((g) => activeFilter === 'All' || activeFilter === g)
      .map((g) => {
        const list = projects.filter((p) => p.group === g && p !== featured);
        if (!list.length) return '';
        return `
          <div class="pf-group">
            <div class="pf-group__h"><span class="pf-group__tag">// ${esc(g.toLowerCase())}</span><span class="pf-group__count">${list.length}</span></div>
            <div class="pf-projgrid pf-projgrid--flush">${list.map(projectCard).join('')}</div>
          </div>`;
      }).join('');
    groupsEl.innerHTML = blocks;
  }

  // Gists section — shown for All and the Gists filter.
  const gistsSection = document.getElementById('gistsSection');
  const showGists = activeFilter === 'All' || activeFilter === 'Gists';
  gistsSection.style.display = showGists ? '' : 'none';
  if (showGists) document.getElementById('gistsGrid').innerHTML = gists.map(gistCard).join('');

  const nothing = (activeFilter !== 'Gists' && !groupsEl.innerHTML.trim() && !showFeatured);
  document.getElementById('projectsEmpty').style.display = nothing ? 'block' : 'none';
}

function renderAll() {
  renderPreview();
  renderStats();
  renderFilters();
  renderProjectsPage();
}

/* ── Live data fetch (merges over the snapshot; silent on failure) ────────── */
function mergeRepos(apiRepos) {
  const bySnap = new Map(D.publicSnapshot.map((r) => [r.name.toLowerCase(), r]));
  const live = apiRepos
    .filter((r) => !r.private)
    .map((r) => {
      const snap = bySnap.get(r.name.toLowerCase());
      return {
        name: r.name,
        description: r.description || (snap && snap.description) || '',
        language: r.language || (snap && snap.language) || null,
        url: r.html_url, isFork: !!r.fork, isPrivate: false,
        stars: r.stargazers_count || 0, updatedAt: r.pushed_at || r.updated_at || null,
        group: r.fork ? 'Forks' : 'Open source',
        monogram: r.name.replace(/[^a-z0-9]/gi, '').slice(0, 2).toLowerCase(),
      };
    })
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  if (!live.length) return;                    // empty/odd response — keep snapshot
  projects = [...D.private, ...live];
}

function mergeGists(apiGists) {
  const live = apiGists.map((g) => ({
    description: g.description || '',
    url: g.html_url,
    updatedAt: g.updated_at || null,
    files: Object.values(g.files || {}).map((f) => ({ name: f.filename, lang: f.language })),
  }));
  if (live.length) gists = live;
}

async function loadLive() {
  const get = (path) => fetch(`https://api.github.com/${path}`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))));
  try {
    const [repos, gs] = await Promise.allSettled([
      get(`users/${GH_USER}/repos?sort=pushed&per_page=100`),
      get(`users/${GH_USER}/gists?per_page=100`),
    ]);
    if (repos.status === 'fulfilled' && Array.isArray(repos.value)) mergeRepos(repos.value);
    if (gs.status === 'fulfilled' && Array.isArray(gs.value)) mergeGists(gs.value);
    renderAll();
  } catch (e) {
    /* offline / rate-limited — the snapshot is already on screen, so do nothing */
  }
}

/* ── View switching (home / projects) + nav active state ─────────────────── */
function setActiveNav(view) {
  document.querySelectorAll('.pf-nav__links button').forEach((b) => {
    const nav = (b.getAttribute('data-nav') || '').split('#')[0];
    b.classList.toggle('is-active', nav === view);
  });
}

function showView(view) {
  document.getElementById('view-home').classList.toggle('is-active', view === 'home');
  document.getElementById('view-projects').classList.toggle('is-active', view === 'projects');
  setActiveNav(view);
}

function go(target) {
  const [view, hash] = target.split('#');
  showView(view === 'projects' ? 'projects' : 'home');
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

/* ── Background FX — ambient Matrix digital rain (canvas) ──────────────────
   Falling neon glyph columns with bright leading heads, fading trails, varied
   per-column speed, and subtle cursor reactivity. Disable with ?fx=off; honours
   prefers-reduced-motion (renders one static frame); pauses when the tab hides. */
function initBackgroundFX() {
  if (new URLSearchParams(location.search).get('fx') === 'off') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.createElement('canvas');
  canvas.className = 'au-matrix';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ' +
                 'БГДЖЗИЛПФЦЧШЩЪЫЭЮЯДЛФ' +                       // Cyrillic / Russian
                 '0123456789<>/\\|=+*#$%{}[]_-:;akinauphill';
  const FONT = 16;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let cols = [], w = 0, h = 0, mx = -1e4, raf = null, last = 0;

  // Accent colour, kept in sync with the theme toggle.
  const readAccent = () => (getComputedStyle(document.documentElement).getPropertyValue('--neon').trim() || '#b026ff');
  let accent = readAccent();
  new MutationObserver(() => { accent = readAccent(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const rand = (arr) => arr[(Math.random() * arr.length) | 0];

  // Time-based fall (px/second) with continuous sub-pixel positions, so motion
  // stays smooth at any refresh rate. Glyphs are FIXED per cell — a stable
  // streak with a moving head — and the whole field is pre-seeded on load so the
  // rain already looks in progress instead of filling in from empty.
  const PXPS_MIN = 26, PXPS_VAR = 66;                 // fall speed, px per second
  const RING = 32;                                     // per-column glyph ring buffer
  const idx = (cell) => ((cell % RING) + RING) % RING;

  function newCol(seeded) {
    const len = 10 + ((Math.random() * 16) | 0);
    const y = seeded ? Math.random() * (h + FONT * 4) - FONT * 4    // already on-screen
                     : -Math.random() * FONT * 28;                  // spawn above the fold
    const c = { y, speed: PXPS_MIN + Math.random() * PXPS_VAR, len, ring: new Array(RING), lastDrop: Math.floor(y / FONT) };
    for (let j = 0; j <= len; j++) c.ring[idx(c.lastDrop - j)] = rand(GLYPHS);  // pre-fill trail
    return c;
  }

  function setup() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.font = `${FONT}px "Space Mono", ui-monospace, monospace`;
    ctx.textBaseline = 'top';
    const n = Math.ceil(w / FONT);
    cols = Array.from({ length: n }, () => newCol(true));   // seed a full field → "resumes"
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      const x = i * FONT;
      const near = Math.abs(x - mx) < 90;            // subtle cursor reactivity
      c.y += c.speed * (near ? 1.35 : 1) * dt;
      const drop = Math.floor(c.y / FONT);
      for (let d = c.lastDrop + 1; d <= drop; d++) c.ring[idx(d)] = rand(GLYPHS);  // fresh head glyphs
      c.lastDrop = drop;
      if (Math.random() < 0.01) c.ring[idx(drop - ((Math.random() * c.len) | 0))] = rand(GLYPHS); // rare flicker
      for (let j = 0; j < c.len; j++) {
        const cell = drop - j;
        if (cell < 0) continue;
        const yy = c.y - j * FONT;
        if (yy < -FONT || yy > h) continue;
        const g = c.ring[idx(cell)];
        if (!g) continue;
        if (j === 0) {
          ctx.shadowBlur = near ? 9 : 5;
          ctx.shadowColor = accent;
          ctx.fillStyle = near ? '#ffffff' : '#e6d4ff';
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = accent;
          ctx.globalAlpha = (1 - j / c.len) * (near ? 0.85 : 0.55);
        }
        ctx.fillText(g, x, yy);
        ctx.globalAlpha = 1;
      }
      ctx.shadowBlur = 0;
      if (c.y - c.len * FONT > h) cols[i] = newCol(false);   // recycle once fully off-screen
    }
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (w !== window.innerWidth || h !== window.innerHeight) setup();   // self-heal on resize
    const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0.016;       // seconds; clamp big gaps
    last = ts;
    draw(dt);
  }

  setup();
  if (reduce) { draw(0); return; }                    // static, already-seeded frame
  window.addEventListener('resize', setup);
  window.addEventListener('pointermove', (e) => { mx = e.clientX; }, { passive: true });
  window.addEventListener('pointerleave', () => { mx = -1e4; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
  });
  raf = requestAnimationFrame(loop);
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
  initBackgroundFX();
  initEasterEgg();

  renderSkills();
  renderAll();
  loadLive();        // background refresh; snapshot is already on screen

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

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
