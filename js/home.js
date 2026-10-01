/* TemanBelajar — Halaman Home: karakter AI, interaksi tombol, dan data ringan (dependency-free) */
(function () {
  'use strict';

  var REFLECTION_KEY = 'temanbelajar.reflection.v1';
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Karakter AI (memakai MascotRenderer yang sudah ada) ---------- */
  var wrap = document.getElementById('homeMascotWrap');
  var inner = document.getElementById('homeMascot');
  var blinkTimer = null;

  // Bungkus mata (elips gelap + catchlight) dalam satu <g> agar bisa berkedip bersama.
  function groupEyes(svg) {
    var eyes = svg.querySelectorAll('ellipse[fill="#1E2A4A"]');
    if (!eyes.length) return null; // ekspresi crescent (happy) tidak punya elips mata

    var lights = [];
    svg.querySelectorAll('circle').forEach(function (c) {
      var cx = parseFloat(c.getAttribute('cx'));
      var r = parseFloat(c.getAttribute('r'));
      var fill = (c.getAttribute('fill') || '').toUpperCase();
      if (cx > 36 && cx < 76 && r < 4 && (fill === '#FFFFFF' || fill === '#6EE1FF')) {
        lights.push(c);
      }
    });

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'hm-eyes');
    eyes[0].parentNode.insertBefore(g, eyes[0]);
    eyes.forEach(function (e) { g.appendChild(e); });
    lights.forEach(function (c) { g.appendChild(c); });
    return g;
  }

  function renderMascot(expression) {
    if (!wrap || !inner || !window.MascotRenderer) return;
    inner.innerHTML = window.MascotRenderer.getSvg(expression, {
      size: 124,
      idPrefix: 'home_mascot'
    });
    var svg = inner.querySelector('svg');
    if (svg) groupEyes(svg);
  }

  function blink() {
    var eyes = inner && inner.querySelector('.hm-eyes');
    if (!eyes) return;
    eyes.classList.add('is-blinking');
    window.setTimeout(function () { eyes.classList.remove('is-blinking'); }, 140);
  }

  function startBlinking() {
    if (reduceMotion) return;
    (function schedule() {
      blinkTimer = window.setTimeout(function () {
        blink();
        schedule();
      }, 3800 + Math.random() * 2400);
    })();
  }

  if (wrap && inner && window.MascotRenderer) {
    renderMascot('neutral');

    // Gerakan kecil satu kali saat Home dibuka, lalu kembali ke animasi mengambang
    if (!reduceMotion) {
      wrap.classList.add('bounce-mode');
      wrap.addEventListener('animationend', function onEnd(e) {
        if (e.animationName !== 'mascotBounce') return;
        wrap.classList.remove('bounce-mode');
        wrap.removeEventListener('animationend', onEnd);
      });
    }
    startBlinking();

    // Respons kecil saat tombol "Lanjutkan" di-hover / difokuskan
    var cta = document.getElementById('homeContinueBtn');
    if (cta) {
      var cheer = function () {
        renderMascot('encouraging');
        inner.classList.add('is-cheering');
      };
      var calm = function () {
        renderMascot('neutral');
        inner.classList.remove('is-cheering');
      };
      cta.addEventListener('mouseenter', cheer);
      cta.addEventListener('focus', cheer);
      cta.addEventListener('mouseleave', calm);
      cta.addEventListener('blur', calm);
    }
  }

  /* ---------- Pertanyaan pemantik dari learning-data.js (jika tersedia) ---------- */
  try {
    var topic = window.LearningTopics && window.LearningTopics['2nf-normalization'];
    var q = topic && topic.initialChat && topic.initialChat[1] &&
      topic.initialChat[1].guidingQuestionCard;
    var qEl = document.getElementById('homeGuidingQuestion');
    if (q && q.text && qEl) qEl.textContent = q.text;
  } catch (e) { /* gunakan teks bawaan di HTML */ }

  /* ---------- Status Reflection (dari penyimpanan halaman Reflection) ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  try {
    var raw = window.localStorage.getItem(REFLECTION_KEY);
    var data = raw ? JSON.parse(raw) : null;
    if (data && data.savedAt) {
      var d = new Date(data.savedAt);
      if (!isNaN(d.getTime())) {
        var time = pad(d.getHours()) + ':' + pad(d.getMinutes());

        var title = document.getElementById('homeReflectionTitle');
        var text = document.getElementById('homeReflectionText');
        var link = document.getElementById('homeReflectionLink');
        if (title) title.textContent = 'Refleksi sudah tersimpan';
        if (text) text.textContent = 'Terakhir disimpan pukul ' + time + '. Tinjau atau perbarui kapan saja.';
        if (link) link.textContent = 'Buka Reflection →';

        var item = document.getElementById('homeReflectionActivity');
        var itemTime = document.getElementById('homeReflectionActivityTime');
        if (item) item.textContent = 'Menyimpan refleksi untuk Normalisasi Database 2NF';
        if (itemTime) itemTime.textContent = 'Tersimpan · ' + time;
      }
    }
  } catch (e) { /* abaikan jika penyimpanan tidak tersedia */ }
})();