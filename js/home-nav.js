/* TemanBelajar — Navigasi menu "Home" ke halaman home.html */
(function () {
  'use strict';

  var HOME_PAGE = 'home.html';

  // Jika sedang berada di home.html, jangan arahkan ulang.
  if (/home\.html$/i.test(window.location.pathname)) return;

  // Mendukung akses langsung seperti index.html#home
  if (window.location.hash === '#home') {
    window.location.replace(HOME_PAGE);
    return;
  }

  function isHomeLink(link) {
    var href = link.getAttribute('href');
    if (href === '#home' || href === 'index.html#home') return true;

    // Pada projects.html & work-area.html, menu Home berhref "index.html"
    // (sama dengan AI Assistant), sehingga dikenali dari labelnya.
    if (link.classList.contains('nav-link')) {
      var label = link.querySelector('span:last-child');
      return !!label && label.textContent.trim() === 'Home';
    }
    return false;
  }

  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    var link = event.target.closest('a.nav-link, a.brand-group');
    if (!link || !isHomeLink(link)) return;

    event.preventDefault();
    window.location.href = HOME_PAGE;
  });
})();