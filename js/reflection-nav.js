/* TemanBelajar — Navigasi menu "Reflection" ke halaman reflection.html */
(function () {
  'use strict';

  var REFLECTION_PAGE = 'reflection.html';

  // Jika sedang berada di reflection.html, jangan arahkan ulang.
  if (/reflection\.html$/i.test(window.location.pathname)) return;

  // Mendukung akses langsung seperti index.html#reflection
  if (window.location.hash === '#reflection') {
    window.location.replace(REFLECTION_PAGE);
    return;
  }

  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    var link = event.target.closest(
      'a.nav-link[href="#reflection"], a.nav-link[href="index.html#reflection"]'
    );
    if (!link) return;

    event.preventDefault();
    window.location.href = REFLECTION_PAGE;
  });
})();