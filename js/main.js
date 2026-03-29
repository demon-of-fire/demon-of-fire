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
})();