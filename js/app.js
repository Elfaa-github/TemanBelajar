/**
 * TemanBelajar - AI Learning Workspace
 * Interactive Controller & Pedagogical Socratic Loop
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current Application State
  const state = {
    currentTopicId: '2nf-normalization',
    mascotState: 'neutral', // neutral, thinking, explaining, encouraging
    progress: {
      current: 2,
      total: 4,
      label: 'concepts explored'
    },
    aiUsageCount: 3,
    reflectionSaved: false,
    viewMode: 'auto-scale', // 'auto-scale' or 'fluid'
    soundEnabled: true
  };

  // Sound Synthesizer (Zero-dependency Web Audio API)
  const soundFX = {
    ctx: null,
    init() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    },
    playChime(type = 'pop') {
      if (!state.soundEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    }
  };

  // Initialize Audio on first click
  document.body.addEventListener('click', () => {
    if (!soundFX.ctx) soundFX.init();
  }, { once: true });

  // DOM Elements
  const mascotBannerContainer = document.getElementById('mascotBannerAvatar');
  const mascotChatContainer = document.getElementById('mascotChatAvatar');
  const chatMessagesList = document.getElementById('chatMessagesList');
  const studentThinkingSection = document.getElementById('studentThinkingSection');
  const studentThinkingTextarea = document.getElementById('studentThinkingTextarea');
  const submitThinkingBtn = document.getElementById('submitThinkingBtn');
  const charCounter = document.getElementById('charCounter');
  const chatInputField = document.getElementById('chatInputField');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const conversationDropdownBtn = document.getElementById('conversationDropdownBtn');
  
  // Progress DOM Elements
  const donutNumber = document.getElementById('donutNumber');
  const donutLabel = document.getElementById('donutLabel');
  const donutProgressCircle = document.getElementById('donutProgressCircle');
  const currentGoalText = document.getElementById('currentGoalText');
  const currentActivityText = document.getElementById('currentActivityText');
  const aiUsageStat = document.getElementById('aiUsageStat');
  const reflectionStat = document.getElementById('reflectionStat');
  
  // Reflection DOM Elements
  const reflectionTextarea = document.getElementById('reflectionTextarea');
  const saveReflectionBtn = document.getElementById('saveReflectionBtn');
  const reflectionStatusWrap = document.getElementById('reflectionStatusWrap');

  // Modal DOM Elements
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Viewport Canvas Scaler
  const desktopCanvas = document.getElementById('desktopCanvas');
  const viewModeToggleBtn = document.getElementById('viewModeToggleBtn');

  // Setup Responsive Canvas Auto-fit
  function adjustCanvasScale() {
    if (state.viewMode !== 'auto-scale') {
      desktopCanvas.style.transform = 'none';
      return;
    }
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const targetW = 1440;
    const targetH = 1024;

    const scaleX = windowW / targetW;
    const scaleY = windowH / targetH;
    const scale = Math.min(scaleX, scaleY, 1);

    desktopCanvas.style.transform = `scale(${scale})`;
    desktopCanvas.style.transformOrigin = 'center center';
  }

  window.addEventListener('resize', adjustCanvasScale);
  adjustCanvasScale();

  if (viewModeToggleBtn) {
    viewModeToggleBtn.addEventListener('click', () => {
      if (state.viewMode === 'auto-scale') {
        state.viewMode = 'fluid';
        desktopCanvas.classList.remove('auto-scale');
        desktopCanvas.style.transform = 'none';
        desktopCanvas.style.width = '100%';
        desktopCanvas.style.height = '100%';
        desktopCanvas.style.maxWidth = '100%';
        desktopCanvas.style.maxHeight = '100%';
        viewModeToggleBtn.innerText = 'View: Fluid Desktop';
      } else {
        state.viewMode = 'auto-scale';
        desktopCanvas.classList.add('auto-scale');
        desktopCanvas.style.width = '1440px';
        desktopCanvas.style.height = '1024px';
        desktopCanvas.style.maxWidth = '1440px';
        desktopCanvas.style.maxHeight = '1024px';
        viewModeToggleBtn.innerText = 'View: 1440 × 1024 Canvas';
        adjustCanvasScale();
      }
    });
  }

  // --- MASCOT RENDERING & REACTIVE EMOTIONS ---
  function updateMascot(expression) {
    state.mascotState = expression;
    const mascotWrap = document.getElementById('mascotAvatarContainer');
    
    // Update SVG in banner
    if (mascotBannerContainer && window.MascotRenderer) {
      mascotBannerContainer.innerHTML = window.MascotRenderer.getSvg(expression, {
        size: 58,
        idPrefix: 'banner_mascot'
      });
    }

    // Update mini mascot in initial chat message
    if (mascotChatContainer && window.MascotRenderer) {
      mascotChatContainer.innerHTML = window.MascotRenderer.getSvg(expression, {
        size: 32,
        isMini: true,
        idPrefix: 'chat_mascot'
      });
    }

    // Toggle animation classes
    if (mascotWrap) {
      mascotWrap.classList.remove('thinking-mode', 'bounce-mode');
      if (expression === 'thinking') {
        mascotWrap.classList.add('thinking-mode');
      } else if (expression === 'explaining' || expression === 'encouraging') {
        mascotWrap.classList.add('bounce-mode');
      }
    }
  }

  // Initialize Mascot
  updateMascot('neutral');

  // --- PROGRESS DONUT UPDATE ---
  function updateProgressDisplay() {
    const current = state.progress.current;
    const total = state.progress.total;
    if (donutNumber) donutNumber.innerText = `${current} / ${total}`;
    if (donutLabel) donutLabel.innerText = state.progress.label;

    if (donutProgressCircle) {
      const radius = 34;
      const circumference = 2 * Math.PI * radius; // ~213.6
      const ratio = Math.min(current / total, 1);
      const offset = circumference * (1 - ratio);
      donutProgressCircle.style.strokeDasharray = `${circumference}`;
      donutProgressCircle.style.strokeDashoffset = `${offset}`;
    }

    if (aiUsageStat) {
      aiUsageStat.innerText = `${state.aiUsageCount} interactions`;
    }
  }

  updateProgressDisplay();

  // --- MODAL UTILITIES ---
  function openModal(title, text) {
    if (modalTitle) modalTitle.innerText = title;
    if (modalBody) modalBody.innerText = text;
    if (modalOverlay) modalOverlay.classList.add('active');
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // --- GUIDING ACTION CHIPS LISTENER ---
  function bindGuidingActionChips() {
    const hintBtn = document.getElementById('btnGiveHint');
    const exampleBtn = document.getElementById('btnShowExample');
    const checkBtn = document.getElementById('btnCheckUnderstanding');

    const topic = window.LearningTopics[state.currentTopicId];

    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        soundFX.playChime('pop');
        updateMascot('explaining');
        openModal('💡 Guiding Hint - 2NF', topic.hints[0] + '\n\n' + topic.hints[1]);
      });
    }

    if (exampleBtn) {
      exampleBtn.addEventListener('click', () => {
        soundFX.playChime('pop');
        updateMascot('explaining');
        openModal('📑 Contoh Studi Kasus Dekomposisi 2NF', topic.detailedExamples[0]);
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        soundFX.playChime('pop');
        if (studentThinkingTextarea) {
          studentThinkingTextarea.focus();
          studentThinkingSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  bindGuidingActionChips();

  // --- STARTER CHIPS CLICK ---
  const starterChips = document.querySelectorAll('.starter-chip');
  starterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      soundFX.playChime('pop');
      const textToAppend = chip.getAttribute('data-text') || chip.innerText;
      if (studentThinkingTextarea) {
        if (!studentThinkingTextarea.value.trim()) {
          studentThinkingTextarea.value = textToAppend + ' ';
        } else {
          studentThinkingTextarea.value += ' ' + textToAppend + ' ';
        }
        studentThinkingTextarea.focus();
        updateCharCounter();
      }
    });
  });

  // --- CHARACTER COUNTER ---
  function updateCharCounter() {
    if (!studentThinkingTextarea || !charCounter) return;
    const len = studentThinkingTextarea.value.trim().length;
    charCounter.innerText = `${len} karakter`;
    if (len >= 5) {
      submitThinkingBtn.removeAttribute('disabled');
    } else {
      submitThinkingBtn.setAttribute('disabled', 'true');
    }
  }

  if (studentThinkingTextarea) {
    studentThinkingTextarea.addEventListener('input', updateCharCounter);
  }

  // --- SUBMIT FOR FEEDBACK (Core Socratic Engine) ---
  if (submitThinkingBtn) {
    submitThinkingBtn.addEventListener('click', () => {
      const studentInput = studentThinkingTextarea.value.trim();
      if (!studentInput) return;

      soundFX.playChime('pop');

      // Mascot transitions to Thinking state
      updateMascot('thinking');
      submitThinkingBtn.setAttribute('disabled', 'true');
      submitThinkingBtn.innerText = 'Menganalisis pemikiranmu...';

      // Simulate thoughtful AI companion analysis delay (1.2s)
      setTimeout(() => {
        const topic = window.LearningTopics[state.currentTopicId];
        const evalResult = topic.evaluateThinking(studentInput);

        // Sound celebration
        soundFX.playChime('success');

        // Mascot transitions to encouraging / explaining
        updateMascot('encouraging');

        // Increment interactions & progress
        state.aiUsageCount += 1;
        if (state.progress.current < state.progress.total) {
          state.progress.current += evalResult.progressGain;
        }
        updateProgressDisplay();

        // Render AI Feedback Section
        renderAiFeedback(evalResult);

        // Reset submit button
        submitThinkingBtn.removeAttribute('disabled');
        submitThinkingBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Perbarui Pemikiran
        `;
      }, 1200);
    });
  }

  function renderAiFeedback(evalResult) {
    let feedbackContainer = document.getElementById('aiFeedbackContainer');
    if (!feedbackContainer) {
      feedbackContainer = document.createElement('div');
      feedbackContainer.id = 'aiFeedbackContainer';
      studentThinkingSection.parentNode.insertBefore(feedbackContainer, studentThinkingSection.nextSibling);
    }

    feedbackContainer.innerHTML = `
      <div class="ai-feedback-section">
        <div class="feedback-header-row">
          <div class="feedback-title-group">
            <span class="card-header-icon" style="background: rgba(110, 225, 255, 0.2); color: #0284C7;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </span>
            <span class="feedback-badge-title">AI Feedback</span>
          </div>
          <span class="status-pill status-${evalResult.status === 'Proficient' ? 'proficient' : 'developing'}">
            <span class="status-dot" style="background: ${evalResult.status === 'Proficient' ? '#10B981' : '#F59E0B'}"></span>
            Understanding: ${evalResult.status}
          </span>
        </div>

        <p class="feedback-body-text">
          "${evalResult.feedback}"
        </p>

        <div class="subcard subcard-violet" style="margin-top: 4px;">
          <div class="subcard-title-row">
            <span>💡 Pertanyaan Reflektif Lanjutan</span>
          </div>
          <div class="subcard-content">
            ${evalResult.followUpQuestion}
          </div>
        </div>

        <div class="feedback-actions">
          <button class="btn-secondary" id="btnRefineThinking">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Perdalam Argumen
          </button>
          <button class="btn-primary" id="btnContinueProgress" style="padding: 8px 18px; font-size: 13px;">
            Lanjut ke Konsep Berikutnya
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    `;

    // Hook internal buttons
    const btnRefine = document.getElementById('btnRefineThinking');
    if (btnRefine) {
      btnRefine.addEventListener('click', () => {
        studentThinkingTextarea.focus();
        studentThinkingSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const btnContinue = document.getElementById('btnContinueProgress');
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        soundFX.playChime('success');
        updateMascot('happy');
        openModal('🎉 Selamat!', 'Kamu berhasil menyelesaikan pemahaman 2NF! Langkah berikutnya adalah mengeksplorasi Transitive Dependency pada 3NF.');
        if (state.progress.current < 4) {
          state.progress.current = 4;
          updateProgressDisplay();
        }
      });
    }

    feedbackContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // --- SAVE REFLECTION HANDLER ---
  if (saveReflectionBtn) {
    saveReflectionBtn.addEventListener('click', () => {
      const text = reflectionTextarea.value.trim();
      if (!text) {
        reflectionTextarea.placeholder = 'Mohon tulis sedikit refleksimu di sini...';
        reflectionTextarea.focus();
        return;
      }

      soundFX.playChime('success');
      state.reflectionSaved = true;
      updateMascot('happy');

      // Update right panel stat
      if (reflectionStat) {
        reflectionStat.innerHTML = '<span style="color: #10B981; font-weight: 700;">Completed ✨</span>';
      }

      // Show saved banner
      if (reflectionStatusWrap) {
        reflectionStatusWrap.innerHTML = `
          <div class="reflection-saved-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Refleksi tersimpan di portofolio belajarmu!
          </div>
        `;
      }

      saveReflectionBtn.disabled = true;
      saveReflectionBtn.innerText = 'Refleksi Tersimpan ✓';
    });
  }

  // --- BOTTOM CHAT BAR SENDING (Student Asks Follow-up) ---
  function sendChatMessage() {
    const text = chatInputField.value.trim();
    if (!text) return;

    soundFX.playChime('pop');
    updateMascot('thinking');

    // Create student message element
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentBubbleEl = document.createElement('div');
    studentBubbleEl.className = 'message-row student-row';
    studentBubbleEl.innerHTML = `
      <div class="student-bubble-wrap">
        <div class="student-bubble">
          ${escapeHtml(text)}
        </div>
        <span class="message-time">${timeNow}</span>
      </div>
      <div class="avatar-circle student-avatar-small">
        <img src="assets/alya_avatar.svg" alt="Alya Rahma">
      </div>
    `;

    chatMessagesList.appendChild(studentBubbleEl);
    chatInputField.value = '';
    chatInputField.focus();
    studentBubbleEl.scrollIntoView({ behavior: 'smooth' });

    state.aiUsageCount += 1;
    updateProgressDisplay();

    // AI Companion Responds with Socratic Guidance
    setTimeout(() => {
      soundFX.playChime('pop');
      updateMascot('explaining');

      const aiResponseEl = document.createElement('div');
      aiResponseEl.className = 'message-row ai-row';
      aiResponseEl.innerHTML = `
        <div class="ai-avatar-small-wrap">
          ${window.MascotRenderer.getSvg('explaining', { size: 32, isMini: true })}
        </div>
        <div class="ai-response-card">
          <div class="ai-response-header">
            <div class="ai-sender-info">
              <span class="ai-sender-name">TemanBelajar AI</span>
              <span class="guided-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Guided exploration
              </span>
            </div>
          </div>
          <p class="explanation-text">
            Pertanyaan yang sangat bagus! Untuk memahami hal tersebut secara mandiri, mari kita urai dari sudut pandang pemecahan tabel.
          </p>
          <div class="subcard subcard-violet">
            <div class="subcard-title-row">
              <span>💡 Pertanyaan pemantik untukmu:</span>
            </div>
            <div class="subcard-content">
              Menurut analisismu, apa konsekuensi jika kita membiarkan atribut yang tidak bergantung penuh pada seluruh key tetap berada di tabel yang sama?
            </div>
          </div>
        </div>
      `;

      chatMessagesList.appendChild(aiResponseEl);
      aiResponseEl.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener('click', sendChatMessage);
  }

  if (chatInputField) {
    chatInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // Escape HTML helper
  function escapeHtml(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[s];
    });
  }

  // --- TOPIC / CONVERSATION SELECTOR ---
  if (conversationDropdownBtn) {
    conversationDropdownBtn.addEventListener('click', () => {
      soundFX.playChime('pop');
      openModal(
        'Pilih Topik Pembelajaran',
        '1. Normalisasi Database 2NF (Sedang aktif)\n2. Normalisasi Database 3NF (Transitive Dependency)\n3. Rekursi & Dynamic Programming\n\nKetik topik yang ingin kamu eksplorasi di kolom pencarian atas kapan saja!'
      );
    });
  }
});
