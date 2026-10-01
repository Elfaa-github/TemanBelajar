/* TemanBelajar — Sidebar yang dapat diciutkan (mode ikon) + navigasi antar halaman yang halus.
   Dependency-free. Muat di <head> agar state tersimpan diterapkan sebelum halaman tampil. */
(function () {
  'use strict';

  var root = document.documentElement;
  var SIDEBAR_KEY = 'temanbelajar.sidebar.collapsed';
  var ANIM_KEY = 'temanbelajar.anim.t0';
  var LEAVE_MS = 160;

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

  // Skala kanvas 1440 × 1024 dihitung lebih awal agar tidak ada lompatan ukuran
  function applyScale() {
    var scale = Math.min(1, window.innerWidth / 1440, window.innerHeight / 1024);
    root.style.setProperty('--tb-scale', String(scale));
  }

  applyScale();
  window.addEventListener('resize', applyScale);

  /* ---------- Mode tampilan (Fluid Desktop / 1440 × 1024 Canvas) tetap saat pindah halaman ---------- */
  var VIEW_KEY = 'temanbelajar.view.fluid';

  function readFluid() {
    try { return window.localStorage.getItem(VIEW_KEY) === '1'; } catch (e) { return false; }
  }

  function writeFluid(value) {
    try { window.localStorage.setItem(VIEW_KEY, value ? '1' : '0'); } catch (e) { /* abaikan */ }
  }

  function isFluidLabel(btn) {
    return /fluid/i.test(btn.textContent || '');
  }

  // Terapkan lebih awal agar halaman langsung tampil fluid (tanpa lompatan ukuran)
  var restoreFluid = readFluid();

  if (restoreFluid) root.classList.add('tb-fluid');

  // Simpan pilihan setiap kali tombol view ditekan
  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    var btn = event.target.closest('#viewModeToggleBtn');
    if (!btn) return;

    root.classList.remove('tb-fluid');
    writeFluid(isFluidLabel(btn));
  });

  // Setelah skrip halaman siap, samakan status tombol bawaan halaman dengan pilihan tersimpan
  document.addEventListener('DOMContentLoaded', function () {
    if (!restoreFluid) return;

    // setTimeout: tunggu semua handler DOMContentLoaded halaman (mis. app.js) selesai terpasang
    window.setTimeout(function () {
      var btn = document.getElementById('viewModeToggleBtn');

      if (btn && !isFluidLabel(btn)) {
        btn.click();   // memakai logika bawaan tiap halaman
      }

      root.classList.remove('tb-fluid');
    }, 0);
  });

  /* ---------- Navigasi: tujuan halaman ---------- */
  // Menu yang memakai anchor "#..." dipetakan ke halaman masing-masing
  var HASH_MAP = {
    '#home': 'home.html',
    'index.html#home': 'home.html',
    '#my-learning': 'my-learning.html',
    'index.html#my-learning': 'my-learning.html',
    '#reflection': 'reflection.html',
    'index.html#reflection': 'reflection.html',
    '#discussion': 'discussion.html',
    'index.html#discussion': 'discussion.html'
  };

  var leaving = false;
  var previousActive = null;   // untuk dipulihkan jika halaman dibuka lewat tombol Back (bfcache)

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

    if (HASH_MAP[raw]) {
      to = HASH_MAP[raw];
    } else if (isHomeLabelLink(a)) {
      to = 'home.html';
    } else if (raw.charAt(0) === '#') {
      return null;   // anchor di halaman yang sama (mis. #projects)
    } else {
      to = raw;
    }

    var url;

    try {
      url = new URL(to, window.location.href);
    } catch (e) {
      return null;
    }

    if (url.protocol !== window.location.protocol ||
        url.host !== window.location.host) {
      return null;
    }

    if (url.pathname === window.location.pathname) return null;

    return url.href;
  }

  // Umpan balik instan: pill aktif langsung pindah ke menu yang diklik
  function markActive(link) {
    var item = link.closest('.nav-item');

    if (!item || !item.closest('.sidebar')) return;

    var current = document.querySelector('.sidebar .nav-item.active');

    if (current === item) return;

    previousActive = current;

    if (current) current.classList.remove('active');

    item.classList.add('active');
  }

  function leave(dest, link) {
    if (leaving) return;

    leaving = true;

    if (link) markActive(link);

    if (reduceMotion) {
      window.location.href = dest;
      return;
    }

    root.classList.remove('tb-enter');
    root.classList.add('tb-leaving');

    window.setTimeout(function () {
      window.location.href = dest;
    }, LEAVE_MS);
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (!event.target || !event.target.closest) return;

    var a = event.target.closest('a[href]');

    if (!a) return;

    var dest = resolveDest(a);

    if (dest) {
      event.preventDefault();
      event.stopImmediatePropagation();
      leave(dest, a);
      return;
    }

    // Klik menu yang sedang aktif (halaman yang sama) tidak perlu memuat ulang halaman
    var raw = a.getAttribute('href') || '';

    if (raw.charAt(0) !== '#' &&
        a.classList.contains('nav-link') &&
        a.closest('.nav-item.active')) {
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
    if (!event.persisted) return;

    leaving = false;

    root.classList.remove('tb-leaving');

    var shown = document.querySelector('.sidebar .nav-item.active');

    if (previousActive && previousActive !== shown) {
      if (shown) shown.classList.remove('active');

      previousActive.classList.add('active');
    }
  });

  /* ---------- Melanjutkan animasi blob latar dari halaman sebelumnya ---------- */
  function toMs(value) {
    var n = parseFloat(value);

    if (isNaN(n)) return 0;

    return /ms\s*$/.test(value) ? n : n * 1000;
  }

  function syncBackground() {
    var t0;

    try {
      t0 = parseInt(window.sessionStorage.getItem(ANIM_KEY), 10);

      if (!t0) {
        t0 = Date.now();
        window.sessionStorage.setItem(ANIM_KEY, String(t0));
      }
    } catch (e) {
      return;
    }

    var elapsed = Date.now() - t0;
    var blobs = document.querySelectorAll('.ambient-background .blob');

    for (var i = 0; i < blobs.length; i++) {
      var cs = window.getComputedStyle(blobs[i]);

      if (!cs.animationName || cs.animationName === 'none') continue;

      var duration = toMs(cs.animationDuration);

      if (!duration) continue;

      var cycle = /alternate/.test(cs.animationDirection)
        ? duration * 2
        : duration;

      blobs[i].style.animationDelay =
        (toMs(cs.animationDelay) - (elapsed % cycle)) + 'ms';
    }
  }

  /* ---------- Sidebar: tombol toggle + tooltip pada mode ikon ---------- */
  function setupSidebar() {
    var body = document.querySelector('.workspace-body');

    if (!body) return;

    var sidebar = body.querySelector(':scope > .sidebar');

    if (!sidebar) return;

    // Label tiap item (untuk tooltip saat hanya ikon yang terlihat)
    var tipTargets = [];
    var items = sidebar.querySelectorAll('.nav-link, .help-link, .student-card');

    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var text;

      if (el.classList.contains('student-card')) {
        var name = el.querySelector('.student-name');
        var major = el.querySelector('.student-major');

        text =
          (name ? name.textContent.trim() : '') +
          (major ? ' · ' + major.textContent.trim() : '');
      } else {
        var labelEl = el.querySelector(':scope > span:last-child');

        text = labelEl
          ? labelEl.textContent.replace(/\s+/g, ' ').trim()
          : '';
      }

      if (text) {
        tipTargets.push({ el: el, text: text });
      }
    }

    function syncTooltips(collapsed) {
      for (var j = 0; j < tipTargets.length; j++) {
        if (collapsed) {
          tipTargets[j].el.setAttribute('title', tipTargets[j].text);
        } else {
          tipTargets[j].el.removeAttribute('title');
        }
      }
    }

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

      syncTooltips(collapsed);
    }

    btn.addEventListener('click', function () {
      var collapsed =
        !root.classList.contains('tb-sidebar-collapsed');

      root.classList.toggle('tb-sidebar-collapsed', collapsed);

      writeCollapsed(collapsed);
      sync();
    });

    // Sinkron jika sidebar diubah dari tab/halaman lain
    window.addEventListener('storage', function (event) {
      if (event.key !== SIDEBAR_KEY) return;

      root.classList.toggle(
        'tb-sidebar-collapsed',
        event.newValue === '1'
      );

      sync();
    });

    sync();

    // Aktifkan transisi setelah state awal diterapkan
    // (hindari animasi saat memuat halaman)
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.add('tb-sidebar-ready');
      });
    });
  }

  function init() {
    syncBackground();
    setupSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();