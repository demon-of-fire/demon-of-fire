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
})();