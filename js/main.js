/* ============================================================
   Demon of Fire – Portfolio Website
   main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Hamburger / Nav Toggle ── */
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    /* Matches the CSS mobile breakpoint */
    const mq = window.matchMedia('(max-width: 640px)');

    /* Hide or reveal nav links from the accessibility tree on mobile */
    function setNavHidden(hidden) {
      if (hidden) {
        navLinks.setAttribute('inert', '');
        navLinks.setAttribute('aria-hidden', 'true');
      } else {
        navLinks.removeAttribute('inert');
        navLinks.removeAttribute('aria-hidden');
      }
    }

    /* Sync accessibility state with the current viewport */
    function syncNavAccessibility(isMobile) {
      if (isMobile) {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        setNavHidden(!isOpen);
      } else {
        /* Desktop: nav is always visible, never hide from AT */
        setNavHidden(false);
      }
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      navLinks.classList.remove('is-open');
      if (mq.matches) {
        setNavHidden(true);
      }
    }

    /* Initialise accessibility state on page load */
    syncNavAccessibility(mq.matches);

    /* Re-sync when viewport crosses the breakpoint */
    mq.addEventListener('change', function (e) {
      syncNavAccessibility(e.matches);
    });

    /* 1. Toggle menu open / closed */
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      const willOpen = !isOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
      toggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
      navLinks.classList.toggle('is-open', willOpen);
      setNavHidden(!willOpen);
    });

    /* 2. Close menu when a link is clicked (mobile) */
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* 3. Close menu on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    /* 4. Close menu when clicking outside the nav */
    document.addEventListener('click', function (e) {
      const nav = document.getElementById('site-nav');
      if (nav && !nav.contains(e.target) && navLinks.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ── Mark active nav link ── */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── Current year in footer ── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Inject GitHub + Contact links into every footer ── */
  function addFooterLinks() {
    document.querySelectorAll('.footer-discord').forEach(function (disc) {
      const parent = disc.parentNode;
      if (parent.querySelector('.footer-github')) return;
      const prefix = (location.pathname.indexOf('/apps/') !== -1 ||
        location.pathname.indexOf('/mods/') !== -1 ||
        location.pathname.indexOf('/tools/') !== -1) ? '../' : '';

      const gh = document.createElement('a');
      gh.className = 'footer-github';
      gh.href = 'https://github.com/demon-of-fire';
      gh.target = '_blank';
      gh.rel = 'noopener noreferrer';
      gh.setAttribute('aria-label', 'View Demon of Fire on GitHub');
      gh.innerHTML = '<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg> GitHub';
      disc.insertAdjacentElement('afterend', gh);

      const ct = document.createElement('a');
      ct.className = 'footer-contact';
      ct.href = prefix + 'contact.html';
      ct.setAttribute('aria-label', 'Contact Demon of Fire');
      ct.innerHTML = '<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg> Contact';
      gh.insertAdjacentElement('afterend', ct);
    });
  }
  addFooterLinks();

  /* ── Live Screen Reader Announcer ── */
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }

  function announce(msg) {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => { announcer.textContent = msg; }, 50);
    }
  }

  /* ── Accessibility State & Storage ── */
  const A11Y_STORAGE_KEY = 'dof_a11y_prefs';
  const prefs = {
    theme: 'default',
    fontSize: 100,
    font: 'default',
    motion: 'default'
  };

  try {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.fontSize === 'default') parsed.fontSize = 100;
      else if (parsed.fontSize === 'large') parsed.fontSize = 125;
      else if (parsed.fontSize === 'xlarge') parsed.fontSize = 150;
      Object.assign(prefs, parsed);
    }
  } catch (e) {
    /* localStorage disabled / private browsing */
  }

  function applyA11yPrefs() {
    const root = document.documentElement;
    if (prefs.theme === 'high-contrast') {
      root.setAttribute('data-theme', 'high-contrast');
    } else if (root.getAttribute('data-theme') !== 'light') {
      root.removeAttribute('data-theme');
    }

    const size = parseInt(prefs.fontSize, 10);
    root.style.fontSize = (isNaN(size) ? 100 : size) + '%';

    if (prefs.font === 'dyslexic') {
      root.setAttribute('data-font', 'dyslexic');
    } else {
      root.removeAttribute('data-font');
    }

    if (prefs.motion === 'reduced') {
      root.setAttribute('data-motion', 'reduced');
    } else {
      root.removeAttribute('data-motion');
    }

    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  applyA11yPrefs();

  /* ── Inject Accessibility Toolbar & Modal ── */
  function createA11yUI() {
    // Trigger Button (lives in the nav, next to the theme toggle)
    let trigger = document.getElementById('a11y-trigger');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.className = 'a11y-trigger';
      trigger.setAttribute('aria-label', 'Open Accessibility & Display Settings (Alt+A)');
      document.body.appendChild(trigger);
    }
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    // Modal Backdrop & Dialog
    const backdrop = document.createElement('div');
    backdrop.className = 'a11y-panel-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-labelledby', 'a11y-title');

    backdrop.innerHTML = `
      <div class="a11y-panel">
        <div class="a11y-panel-header">
          <h2 id="a11y-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26-.78.07-1.46.64-1.63 1.42l-.8 3.73c-.14.65.26 1.28.91 1.42.66.14 1.29-.27 1.43-.92L12 11.2V22h2v-6h2v6h2v-7.8c.84.4 1.76.6 2.7.6.15 0 .3 0 .3-.01V13zM8.5 14H7.13l-1.8 5.4c-.21.64.14 1.33.78 1.54.64.21 1.33-.14 1.54-.78L8.5 17.5v-3.5z"/></svg>
            Accessibility &amp; Display
          </h2>
          <button type="button" class="a11y-close-btn" aria-label="Close accessibility settings">&times;</button>
        </div>

        <div class="a11y-options">
          <div class="a11y-row">
            <div>
              <div class="a11y-label">High Contrast</div>
              <div class="a11y-desc">WCAG AAA maximum contrast mode</div>
            </div>
            <div class="a11y-btn-group" role="group" aria-label="High Contrast Mode">
              <button type="button" class="a11y-toggle-btn" id="btn-theme-default" aria-pressed="${prefs.theme === 'default'}">Normal</button>
              <button type="button" class="a11y-toggle-btn" id="btn-theme-hc" aria-pressed="${prefs.theme === 'high-contrast'}">High Contrast</button>
            </div>
          </div>

          <div class="a11y-row">
            <div>
              <div class="a11y-label">Text Size</div>
              <div class="a11y-desc">Scale page text size</div>
            </div>
            <div class="a11y-range-wrap">
              <input type="range" class="a11y-range" id="font-range" min="100" max="200" step="5" value="${prefs.fontSize}" aria-label="Text size percentage" />
              <span class="a11y-range-value" id="font-range-value" aria-hidden="true">${prefs.fontSize}%</span>
            </div>
          </div>

          <div class="a11y-row">
            <div>
              <div class="a11y-label">Readable Font</div>
              <div class="a11y-desc">Dyslexia-friendly letterforms</div>
            </div>
            <div class="a11y-btn-group" role="group" aria-label="Dyslexia Friendly Font">
              <button type="button" class="a11y-toggle-btn" id="btn-font-standard" aria-pressed="${prefs.font === 'default'}">Standard</button>
              <button type="button" class="a11y-toggle-btn" id="btn-font-dyslexic" aria-pressed="${prefs.font === 'dyslexic'}">Dyslexic</button>
            </div>
          </div>

          <div class="a11y-row">
            <div>
              <div class="a11y-label">Reduced Motion</div>
              <div class="a11y-desc">Disable transitions and animations</div>
            </div>
            <div class="a11y-btn-group" role="group" aria-label="Reduced Motion">
              <button type="button" class="a11y-toggle-btn" id="btn-motion-def" aria-pressed="${prefs.motion === 'default'}">Normal</button>
              <button type="button" class="a11y-toggle-btn" id="btn-motion-red" aria-pressed="${prefs.motion === 'reduced'}">Reduced</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(backdrop);

    function openDialog() {
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      const closeBtn = backdrop.querySelector('.a11y-close-btn');
      if (closeBtn) closeBtn.focus();
      announce('Accessibility settings opened');
    }

    function closeDialog() {
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
      announce('Accessibility settings closed');
    }

    function toggleDialog() {
      if (backdrop.classList.contains('is-open')) {
        closeDialog();
      } else {
        openDialog();
      }
    }

    trigger.addEventListener('click', toggleDialog);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.closest('.a11y-close-btn')) {
        closeDialog();
      }
    });

    /* Trap keyboard focus inside the modal while it is open */
    const focusableSel = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    backdrop.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const f = Array.prototype.slice.call(backdrop.querySelectorAll(focusableSel));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeDialog();
      }
      // Shortcut Alt+A
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        toggleDialog();
      }
    });

    // Theme Handlers
    document.getElementById('btn-theme-default').addEventListener('click', function() {
      prefs.theme = 'default';
      applyA11yPrefs();
      this.setAttribute('aria-pressed', 'true');
      document.getElementById('btn-theme-hc').setAttribute('aria-pressed', 'false');
      announce('High contrast mode disabled');
    });
    document.getElementById('btn-theme-hc').addEventListener('click', function() {
      prefs.theme = 'high-contrast';
      applyA11yPrefs();
      this.setAttribute('aria-pressed', 'true');
      document.getElementById('btn-theme-default').setAttribute('aria-pressed', 'false');
      announce('High contrast mode enabled');
    });

    // Text Size Slider
    const fontRange = document.getElementById('font-range');
    const fontRangeValue = document.getElementById('font-range-value');
    function setFontSize(size) {
      prefs.fontSize = size;
      applyA11yPrefs();
      fontRangeValue.textContent = size + '%';
      announce('Text size set to ' + size + ' percent');
    }
    fontRange.addEventListener('input', function () {
      setFontSize(parseInt(this.value, 10));
    });

    // Dyslexic Font
    document.getElementById('btn-font-standard').addEventListener('click', function() {
      prefs.font = 'default';
      applyA11yPrefs();
      this.setAttribute('aria-pressed', 'true');
      document.getElementById('btn-font-dyslexic').setAttribute('aria-pressed', 'false');
      announce('Standard font enabled');
    });
    document.getElementById('btn-font-dyslexic').addEventListener('click', function() {
      prefs.font = 'dyslexic';
      applyA11yPrefs();
      this.setAttribute('aria-pressed', 'true');
      document.getElementById('btn-font-standard').setAttribute('aria-pressed', 'false');
      announce('Dyslexia friendly font enabled');
    });

    // Motion Handlers
    document.getElementById('btn-motion-def').addEventListener('click', function() {
      prefs.motion = 'default';
      applyA11yPrefs();
      this.setAttribute('aria-pressed', 'true');
      document.getElementById('btn-motion-red').setAttribute('aria-pressed', 'false');
      announce('Standard motion enabled');
    });
    document.getElementById('btn-motion-red').addEventListener('click', function() {
      prefs.motion = 'reduced';
      applyA11yPrefs();
      this.setAttribute('aria-pressed', 'true');
      document.getElementById('btn-motion-def').setAttribute('aria-pressed', 'false');
      announce('Reduced motion enabled');
    });
  }

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createA11yUI);
  } else {
    createA11yUI();
  }

  /* ── Light / Dark theme toggle ── */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    function getStoredTheme() {
      try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }
    function storeTheme(theme) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }
    }
    function applyTheme(theme, persist) {
      document.documentElement.setAttribute('data-theme', theme);
      if (persist) {
        storeTheme(theme);
      }
      themeToggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
    const stored = getStoredTheme();
    const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(stored || (systemLight ? 'light' : 'dark'), false);

themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light', true);
    });
  }

  /* ── Clickable project cards → detail pages ── */
  document.querySelectorAll('.card[data-href]').forEach(function (card) {
    const url = card.getAttribute('data-href');
    if (!url) return;
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      window.location.href = url;
    });
  });

  /* ── GitHub releases: homepage "Latest Releases" + changelog page ── */
  const REPOS = [
    ['access-overlay', 'Access Overlay'],
    ['access-recorder', 'Access Recorder'],
    ['accessable-studio', 'Accessible Studio'],
    ['accessible-media-player', 'Accessible Media Player'],
    ['accessable-calculator', 'Accessible Calculator'],
    ['nova-voice-assistant', 'Nova Voice Assistant'],
    ['clipboard-history', 'Clipboard History'],
    ['among-us-accessibility-mod', 'Among Us Accessibility Mod'],
    ['fc26-accessibility-mod', 'FC 26 Accessibility Mod'],
    ['rocket-league-accessibility-mod', 'Rocket League Accessibility Mod'],
    ['past-paper-revision-hub', 'Past Paper Revision Hub']
  ];

  function cacheGet(key, ttlMs) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const o = JSON.parse(raw);
      if (!o || !o.at || Date.now() - o.at > ttlMs) return null;
      return o.data;
    } catch (e) {
      return null;
    }
  }
  function cacheSet(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ at: Date.now(), data: data }));
    } catch (e) {}
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function linkify(s) {
    return escapeHtml(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" rel="noopener noreferrer">$1</a>');
  }
  function fetchJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }
  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  /* Fetch release data from the prebuilt data/releases.json (generated by a
     GitHub Action). Falls back to the live GitHub API only if that file is
     missing or unreachable, so we never hammer api.github.com's rate limit. */
  function loadReleaseData() {
    return fetchJSON('data/releases.json')
      .then(function (data) { return data.repos; })
      .catch(function () {
        return Promise.all(REPOS.map(function (r) {
          return fetchJSON('https://api.github.com/repos/demon-of-fire/' + r[0] + '/releases?per_page=5').catch(function () { return []; });
        })).then(function (results) {
          return REPOS.map(function (r, i) {
            return { name: r[1], repo: r[0], releases: results[i] || [] };
          });
        });
      });
  }

  function renderReleaseCards(items) {
    if (!items || !items.length) return '<p>No releases found yet.</p>';
    return items.map(function (item) {
      const repoUrl = 'https://github.com/demon-of-fire/' + item.repo;
      const rel = item.release;
      const version = rel ? rel.tag_name : 'No releases yet';
      const date = rel ? fmtDate(rel.published_at) : '';
      return '<div class="release-card">' +
        '<div class="release-card-head">' +
        '<h3><a href="' + repoUrl + '" rel="noopener noreferrer">' + escapeHtml(item.name) + '</a></h3>' +
        '<span class="release-version">' + escapeHtml(version) + '</span>' +
        '</div>' +
        (date ? '<p class="release-date">' + date + '</p>' : '') +
        '<div class="release-actions">' +
        (rel ? '<a href="' + repoUrl + '/releases/latest" class="btn btn-primary btn-sm" rel="noopener noreferrer">Download</a>' +
        '<a href="' + rel.html_url + '" class="btn btn-ghost btn-sm" rel="noopener noreferrer">Release Notes</a>' : '') +
        '</div></div>';
    }).join('');
  }

  function initReleases() {
    const list = document.getElementById('release-list');
    if (!list) return;
    const key = 'dof_releases_v1';
    const render = function (items) { list.innerHTML = renderReleaseCards(items); };
    const cached = cacheGet(key, 30 * 60 * 1000);
    if (cached) { render(cached); return; }
    loadReleaseData().then(function (repos) {
      const items = repos.map(function (p) {
        return { name: p.name, repo: p.repo, release: (p.releases && p.releases[0]) ? p.releases[0] : null };
      });
      cacheSet(key, items);
      render(items);
    }).catch(function () {
      list.innerHTML = '<p>Could not load releases right now. See the <a href="changelog.html">changelog</a> instead.</p>';
    });
  }

  function renderChangelog(data) {
    let html = '';
    data.forEach(function (proj) {
      if (!proj.releases || !proj.releases.length) return;
      html += '<div class="changelog-project">' +
        '<h3><a href="' + proj.html + '" rel="noopener noreferrer">' + escapeHtml(proj.name) + '</a></h3>' +
        '<ul class="changelog-releases">';
      proj.releases.forEach(function (rel) {
        html += '<li>' +
          '<span class="changelog-version">' + escapeHtml(rel.tag_name) + '</span>' +
          (rel.published_at ? '<time class="changelog-date">' + fmtDate(rel.published_at) + '</time>' : '') +
          (rel.body ? '<div class="changelog-body">' + linkify(rel.body).replace(/\n/g, '<br>') + '</div>' : '') +
          '</li>';
      });
      html += '</ul></div>';
    });
    return html || '<p>No releases found yet.</p>';
  }

  function initChangelog() {
    const list = document.getElementById('changelog-list');
    if (!list) return;
    const key = 'dof_changelog_v1';
    const render = function (data) { list.innerHTML = renderChangelog(data); };
    const cached = cacheGet(key, 60 * 60 * 1000);
    if (cached) { render(cached); return; }
    loadReleaseData().then(function (repos) {
      const data = repos.map(function (p) {
        return { name: p.name, html: 'https://github.com/demon-of-fire/' + p.repo, releases: p.releases || [] };
      });
      cacheSet(key, data);
      render(data);
    }).catch(function () {
      list.innerHTML = '<p>Could not load the changelog right now. Full release history is on <a href="https://github.com/demon-of-fire" rel="noopener noreferrer">GitHub</a>.</p>';
    });
  }

  /* ── Project search / filter on list pages ── */
  function initCardFilters() {
    document.querySelectorAll('.card-filter').forEach(function (input) {
      const grid = document.getElementById(input.getAttribute('aria-controls'));
      if (!grid) return;
      const empty = document.getElementById(input.id + '-empty');
      input.addEventListener('input', function () {
        const q = input.value.trim().toLowerCase();
        let visible = 0;
        grid.querySelectorAll('.card').forEach(function (card) {
          const match = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
          card.hidden = !match;
          if (match) visible++;
        });
        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  /* ── Detail pages: screenshots + FAQ/Changelog sidebar links ── */
  function subdirPrefix() {
    const p = location.pathname;
    return (p.indexOf('/apps/') !== -1 || p.indexOf('/mods/') !== -1 || p.indexOf('/tools/') !== -1) ? '../' : '';
  }

  function initScreenshots() {
    const hero = document.querySelector('.project-hero');
    if (!hero) return;
    const page = location.pathname.split('/').pop().replace('.html', '');
    const prefix = subdirPrefix();
    const pretty = page.replace(/-/g, ' ');
    const section = document.createElement('section');
    section.setAttribute('aria-labelledby', 'screenshots-heading');
    section.className = 'screenshots-section';
    section.innerHTML = '<h2 class="section-title" id="screenshots-heading">Screenshots</h2>' +
      '<div class="screenshot-grid">' +
      '<figure class="screenshot-card"><img src="' + prefix + 'images/screenshots/' + page + '-1.png" alt="Screenshot 1 of ' + pretty + '" loading="lazy" /><figcaption>Screenshot 1</figcaption></figure>' +
      '<figure class="screenshot-card"><img src="' + prefix + 'images/screenshots/' + page + '-2.png" alt="Screenshot 2 of ' + pretty + '" loading="lazy" /><figcaption>Screenshot 2</figcaption></figure>' +
      '</div>';
    hero.insertAdjacentElement('afterend', section);
    section.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        const fig = img.closest('figure');
        if (fig) {
          fig.classList.add('missing');
          fig.innerHTML = '<span class="screenshot-placeholder">Screenshot coming soon</span>';
        }
      });
    });
  }

  function initSidebarLinks() {
    const cards = document.querySelectorAll('.project-sidebar .sidebar-card');
    if (!cards.length) return;
    const last = cards[cards.length - 1];
    const ul = last.querySelector('ul');
    if (!ul) return;
    const prefix = subdirPrefix();
    ul.insertAdjacentHTML('beforeend',
      '<li><a href="' + prefix + 'faq.html">FAQ</a></li>' +
      '<li><a href="' + prefix + 'changelog.html">Changelog</a></li>'
    );
  }

  /* ── FAQ: live search + category index ── */
  function initFaq() {
    const root = document.querySelector('.prose');
    const input = document.getElementById('faq-search');
    if (!root || !input) return;

    const details = Array.prototype.slice.call(root.querySelectorAll('details.faq-item'));
    const headings = Array.prototype.slice.call(root.querySelectorAll('h2'));
    const count = document.getElementById('faq-result-count');
    const noResults = document.getElementById('faq-no-results');
    const indexNav = document.getElementById('faq-index');

    /* Build a clickable category index from the section headings */
    if (indexNav) {
      headings.forEach(function (h, i) {
        if (!h.id) h.id = 'faq-cat-' + i;
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.className = 'faq-index-link';
        a.textContent = h.textContent;
        indexNav.appendChild(a);
      });
    }

    function applyFilter() {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      details.forEach(function (d) {
        const match = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.hidden = !match;
        if (match) visible++;
      });
      headings.forEach(function (h) {
        if (!q) { h.hidden = false; return; }
        let el = h.nextElementSibling;
        let any = false;
        while (el && el.tagName !== 'H2') {
          if (el.tagName === 'DETAILS' && !el.hidden) { any = true; break; }
          el = el.nextElementSibling;
        }
        h.hidden = !any;
      });
      if (count) {
        count.textContent = q
          ? visible + ' of ' + details.length + ' questions'
          : details.length + ' questions';
      }
      if (noResults) noResults.hidden = visible !== 0;
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
  }

  function initExtras() {
    initReleases();
    initChangelog();
    initCardFilters();
    initScreenshots();
    initSidebarLinks();
    initFaq();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtras);
  } else {
    initExtras();
  }
})();