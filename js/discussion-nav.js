/* TemanBelajar — Navigasi menu "Discussion" ke halaman discussion.html */
(function () {
  'use strict';

  var DISCUSSION_PAGE = 'discussion.html';

  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    var link = event.target.closest('a.nav-link[href="#discussion"]');
    if (!link) return;

    event.preventDefault();
    window.location.href = DISCUSSION_PAGE;
  });
})();