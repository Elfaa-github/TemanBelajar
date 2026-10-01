/* TemanBelajar — Layout & navigasi: transisi halaman halus + sidebar yang dapat ditutup.
   Dependency-free. Dimuat di <head> agar state tersimpan diterapkan sebelum halaman tampil. */
(function () {
  'use strict';

  var root = document.documentElement;
  var SIDEBAR_KEY = 'temanbelajar.sidebar.collapsed';
  var ANIM_KEY = 'temanbelajar.anim.t0';
  var LEAVE_MS = 170;

  var reduceMotion = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- Penyimpanan (aman jika localStorage tidak tersedia) ---------- */
  function readCollapsed() {
    try { return window.localStorage.getItem(SIDEBAR_KEY) === '1'; } catch (e) { return false; }
  }
  function writeCollapsed(value) {
    try { window.localStorage.setItem(SIDEBAR_KEY, value ? '1' : '0'); } catch (e) { /* abaikan */ }
  }

  /* ---------- Diterapkan segera (sebelum paint pertama) ---------- */
  if (readCollapsed()) root.classList.add('tb-sidebar-collapsed');

  if (!reduceMotion) {
    root.classList.add('tb-enter');
    window.setTimeout(function () { root.classList.remove('tb-enter'); }, 700);
  }

  /* ---------- Transisi keluar halaman ---------- */
  // Menu yang memakai anchor "#..." dan sebelumnya diarahkan oleh skrip nav masing-masing
  var HASH_MAP = {
    '#home': 'home.html',
    'index.html#home': 'home.html',
    '#my-learning': 'my-learning.html',
    'index.html#my-learning': 'my-learning.html',
    '#reflection': 'reflection.html',
    'index.html#reflection': 'reflection.html',
    '#discussion': 'discussion.html'
  };

  var leaving = false;

  function isHomeLabelLink(a) {
    if (!a.classList.contains('nav-link')) return false;
    var label = a.querySelector('span:last-child');
    return !!label && label.textContent.trim() === 'Home';
  }

  // Mengembalikan URL tujuan jika link membawa pengguna ke halaman lain, selain itu null
  function resolveDest(a) {
    var raw = a.getAttribute('href');
    if (!raw) return null;
    if (a.target && a.target !== '_self') return null;
    if (a.hasAttribute('download')) return null;

    var to;
    if (HASH_MAP[raw]) to = HASH_MAP[raw];
    else if (isHomeLabelLink(a)) to = 'home.html';
    else if (raw.charAt(0) === '#') return null;   // anchor di halaman yang sama (mis. #projects)
    else to = raw;

    var url;
    try { url = new URL(to, window.location.href); } catch (e) { return null; }
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) return null;
    if (url.pathname === window.location.pathname) return null;
    return url.href;
  }

  function leave(dest) {
    if (leaving) return;
    leaving = true;
    if (reduceMotion) { window.location.href = dest; return; }
    root.classList.remove('tb-enter');
    root.classList.add('tb-leaving');
    window.setTimeout(function () { window.location.href = dest; }, LEAVE_MS);
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!event.target || !event.target.closest) return;

    var a = event.target.closest('a[href]');
    if (!a) return;

    var dest = resolveDest(a);
    if (dest) {
      event.preventDefault();
      event.stopImmediatePropagation();
      leave(dest);
      return;
    }

    // Klik menu yang sedang aktif (halaman yang sama) tidak perlu memuat ulang halaman
    var raw = a.getAttribute('href') || '';
    if (raw.charAt(0) !== '#' && a.classList.contains('nav-link') && a.closest('.nav-item.active')) {
      event.preventDefault();
    }
  }, true);

  // Prefetch halaman tujuan saat kursor mendekat (hanya jika dilayani lewat http/https)
  var prefetched = {};
  if (/^https?:$/.test(window.location.protocol)) {
    document.addEventListener('pointerover', function (event) {
      if (!event.target || !event.target.closest) return;
      var a = event.target.closest('a[href]');
      if (!a) return;
      var dest = resolveDest(a);
      if (!dest) return;
      var page = dest.split('#')[0];
      if (prefetched[page]) return;
      prefetched[page] = true;
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    }, true);
  }

  // Kembali lewat tombol Back (bfcache): pastikan halaman tidak tertinggal dalam keadaan "keluar"
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      leaving = false;
      root.classList.remove('tb-leaving');
    }
  });

  /* ---------- Setelah DOM siap ---------- */
  function toMs(value) {
    var n = parseFloat(value);
    if (isNaN(n)) return 0;
    return /ms\s*$/.test(value) ? n : n * 1000;
  }

  // Melanjutkan fase animasi blob latar dari halaman sebelumnya agar tidak "melompat"
  function syncBackground() {
    var t0;
    try {
      t0 = parseInt(window.sessionStorage.getItem(ANIM_KEY), 10);
      if (!t0) {
        t0 = Date.now();
        window.sessionStorage.setItem(ANIM_KEY, String(t0));
      }
    } catch (e) { return; }

    var elapsed = Date.now() - t0;
    var blobs = document.querySelectorAll('.ambient-background .blob');
    for (var i = 0; i < blobs.length; i++) {
      var cs = window.getComputedStyle(blobs[i]);
      if (!cs.animationName || cs.animationName === 'none') continue;
      var duration = toMs(cs.animationDuration);
      if (!duration) continue;
      var cycle = /alternate/.test(cs.animationDirection) ? duration * 2 : duration;
      blobs[i].style.animationDelay = (toMs(cs.animationDelay) - (elapsed % cycle)) + 'ms';
    }
  }

  function setupSidebarToggle() {
    var body = document.querySelector('.workspace-body');
    if (!body) return;
    var sidebar = body.querySelector(':scope > .sidebar');
    if (!sidebar) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tb-sidebar-toggle';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="15 18 9 12 15 6"></polyline></svg>';
    body.appendChild(btn);

    function sync() {
      var collapsed = root.classList.contains('tb-sidebar-collapsed');
      var label = collapsed ? 'Buka sidebar' : 'Tutup sidebar';
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }

    btn.addEventListener('click', function () {
      var collapsed = !root.classList.contains('tb-sidebar-collapsed');
      root.classList.toggle('tb-sidebar-collapsed', collapsed);
      writeCollapsed(collapsed);
      sync();
    });

    sync();

    // Aktifkan transisi setelah state awal diterapkan (hindari animasi saat memuat halaman)
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.add('tb-sidebar-ready');
      });
    });
  }

  function init() {
    syncBackground();
    setupSidebarToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
