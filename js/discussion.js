/* TemanBelajar — Discussion & Feedback interactions */
(function () {
  const form = document.getElementById('discussionForm');
  const input = document.getElementById('discussionInput');
  const submit = document.getElementById('discussionSubmit');
  const thread = document.getElementById('discussionThread');

  if (!form || !input || !submit || !thread) return;

  function updateSubmitState() {
    submit.disabled = input.value.trim().length === 0;
  }

  input.addEventListener('input', updateSubmitState);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    const article = document.createElement('article');
    article.className = 'comment-item';
    article.innerHTML = `
      <div class="comment-avatar">
        <img src="assets/alya_avatar.svg" alt="Alya Rahma">
      </div>
      <div class="comment-content">
        <div class="comment-meta">
          <span class="comment-author">Alya Rahma</span>
          <span class="comment-time">Baru saja</span>
        </div>
        <p class="comment-text"></p>
        <div class="comment-actions">
          <button class="text-action reply-button" type="button">Balas</button>
        </div>
      </div>
    `;

    article.querySelector('.comment-text').textContent = message;
    thread.appendChild(article);
    thread.scrollTop = thread.scrollHeight;

    input.value = '';
    updateSubmitState();
  });

  thread.addEventListener('click', function (event) {
    const replyButton = event.target.closest('.reply-button');
    if (!replyButton) return;

    input.focus();
    input.value = 'Menanggapi diskusi: ';
    updateSubmitState();
  });
})();
