(function () {
      const aiView = document.getElementById('ai-assistant');
      const projectsView = document.getElementById('projects');
      const projectSelectionView = document.getElementById('projectSelectionView');
      const workAreaView = document.getElementById('workAreaView');
      const workProjectTitle = document.getElementById('workProjectTitle');
      const backToProjectsBtn = document.getElementById('backToProjectsBtn');
      const navItems = document.querySelectorAll('.nav-item');
      const workspaceBody = document.getElementById('workspaceBody');
      const navLinks = document.querySelectorAll('.nav-link');

      function setActiveNav(target) {
        navItems.forEach(item => item.classList.remove('active'));
        const link = document.querySelector('.nav-link[href="' + target + '"]');
        if (link) link.closest('.nav-item').classList.add('active');
      }

      function showView(view) {
        const showProjects = view === 'projects';
        aiView.hidden = showProjects;
        projectsView.hidden = !showProjects;
        workspaceBody.classList.toggle('projects-mode', showProjects);
        setActiveNav(showProjects ? '#projects' : '#ai-assistant');
      }

      function showProjectsList() {
        projectSelectionView.hidden = false;
        workAreaView.hidden = true;
        showView('projects');
        history.replaceState(null, '', '#projects');
      }

      function showWorkArea(projectName) {
        projectSelectionView.hidden = true;
        workAreaView.hidden = false;
        workProjectTitle.textContent = projectName;
        showView('projects');
        history.replaceState(null, '', '#projects');
      }

      navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
          const target = this.getAttribute('href');
          if (target === '#projects') {
            event.preventDefault();
            showProjectsList();
          } else if (target === '#ai-assistant') {
            event.preventDefault();
            showView('ai-assistant');
            history.replaceState(null, '', '#ai-assistant');
          }
        });
      });

      document.querySelectorAll('.project-start-btn').forEach(button => {
        button.addEventListener('click', function () {
          showWorkArea(this.dataset.project || 'Website Profil Sederhana');
        });
      });

      if (backToProjectsBtn) backToProjectsBtn.addEventListener('click', showProjectsList);

      if (window.location.hash === '#projects') showProjectsList();
      else showView('ai-assistant');
    })();
