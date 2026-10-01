/* TemanBelajar — Halaman Reflection: simpan refleksi (dependency-free, localStorage) */
(function () {
  'use strict';

  var STORAGE_KEY = 'temanbelajar.reflection.v1';
  var FIELDS = ['understanding', 'process', 'ai', 'next'];

  var form = document.getElementById('reflectionForm');
  var feedback = document.getElementById('reflectionFeedback');
  var statusPill = document.getElementById('reflectionStatusPill');
  var saveBtn = document.getElementById('reflectionSaveBtn');
  if (!form || !feedback || !statusPill || !saveBtn) return;

  var inputs = {};
  FIELDS.forEach(function (name) {
    inputs[name] = document.getElementById('reflection-' + name);
  });
  for (var i = 0; i < FIELDS.length; i++) {
    if (!inputs[FIELDS[i]]) return;
  }

  function readStore() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStore(data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function formatTime(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function setStatus(saved) {
    statusPill.textContent = saved ? 'Tersimpan' : 'Belum disimpan';
    statusPill.classList.toggle('rf-status-saved', saved);
    statusPill.classList.toggle('status-developing', !saved);
  }

  function showHint(text, warning) {
    feedback.innerHTML = '';
    var span = document.createElement('span');
    span.className = 'rf-hint' + (warning ? ' rf-hint-warning' : '');
    span.textContent = text;
    feedback.appendChild(span);
  }

  function showSaved(iso) {
    feedback.innerHTML = '';
    var banner = document.createElement('div');
    banner.className = 'reflection-saved-banner';
    banner.setAttribute('role', 'status');
    var time = formatTime(iso);
    banner.textContent = 'Reflection berhasil disimpan' + (time ? ' · ' + time : '') + ' ✓';
    feedback.appendChild(banner);
  }

  function collect() {
    var data = {};
    FIELDS.forEach(function (name) {
      data[name] = inputs[name].value.trim();
    });
    return data;
  }

  // Muat refleksi yang sudah pernah disimpan
  var stored = readStore();
  if (stored && typeof stored === 'object') {
    FIELDS.forEach(function (name) {
      if (typeof stored[name] === 'string') inputs[name].value = stored[name];
    });
    if (stored.savedAt) {
      setStatus(true);
      showSaved(stored.savedAt);
    }
  }

  // Perubahan baru = belum disimpan
  FIELDS.forEach(function (name) {
    inputs[name].addEventListener('input', function () {
      setStatus(false);
      showHint('Ada perubahan yang belum disimpan.', false);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = collect();
    var hasContent = FIELDS.some(function (name) { return data[name].length > 0; });

    if (!hasContent) {
      showHint('Tulis setidaknya satu refleksi sebelum menyimpan.', true);
      inputs.understanding.focus();
      return;
    }

    data.savedAt = new Date().toISOString();

    if (writeStore(data)) {
      setStatus(true);
      showSaved(data.savedAt);
    } else {
      showHint('Reflection tidak dapat disimpan di browser ini.', true);
    }
  });
})();