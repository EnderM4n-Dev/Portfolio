/* ===== EnderM4n-Dev Portfolio — shared interactions ===== */
(function () {
  'use strict';

  /* ---------- bilingual (persists across pages) ---------- */
  var STORE = 'enderm4n_lang';

  function setLang(lang) {
    var html = document.documentElement;
    html.lang = lang;
    html.dir  = lang === 'fa' ? 'rtl' : 'ltr';
    document.querySelectorAll('.t').forEach(function (el) {
      var v = el.dataset[lang];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    // re-position the FAB: CSS uses html[dir] so just force a reflow
    var fab = document.querySelector('.rail-fab');
    if (fab) { fab.style.display = 'none'; void fab.offsetWidth; fab.style.display = ''; }
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  }

  var saved = 'fa';
  try { saved = localStorage.getItem(STORE) || 'fa'; } catch (e) {}
  setLang(saved);

  document.querySelectorAll('.lang-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  /* ---------- mobile drawer ---------- */
  var rail  = document.querySelector('.rail');
  var fab   = document.querySelector('.rail-fab');
  var scrim = document.querySelector('.scrim');

  function closeRail() {
    if (!rail) return;
    rail.classList.remove('open');
    if (scrim) scrim.classList.remove('show');
    document.body.style.overflow = '';
  }
  function openRail() {
    if (!rail) return;
    rail.classList.add('open');
    if (scrim) scrim.classList.add('show');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  if (fab) {
    fab.addEventListener('click', function () {
      rail.classList.contains('open') ? closeRail() : openRail();
    });
  }
  if (scrim) scrim.addEventListener('click', closeRail);
  if (rail) {
    rail.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        // close drawer on nav, but let external links work
        if (!a.target || a.target !== '_blank') closeRail();
      });
    });
  }

  /* ---------- close drawer on Escape ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeRail();
  });

  /* ---------- swipe to close (touch) ---------- */
  var touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!rail || !rail.classList.contains('open')) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > Math.abs(dx)) return; // vertical swipe — ignore
    var isRtl = document.documentElement.dir === 'rtl';
    // RTL: swipe right closes (positive dx); LTR: swipe left closes (negative dx)
    if ((isRtl && dx > 50) || (!isRtl && dx < -50)) closeRail();
  }, { passive: true });

  /* ---------- reveal on scroll (frozen-timeline safe) ---------- */
  function revealAll() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      el.classList.add('in');
      el.style.transition = 'none';
      el.style.opacity    = '1';
      el.style.transform  = 'none';
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    /* sentinel: if observer never fires, snap all visible */
    var ioFired = false;
    var sentinel = new IntersectionObserver(function () { ioFired = true; sentinel.disconnect(); });
    sentinel.observe(document.body);
    setTimeout(function () { if (!ioFired) revealAll(); }, 500);
  } else {
    revealAll();
  }
})();
