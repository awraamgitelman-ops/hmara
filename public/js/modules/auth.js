// LIKEMARK — Auth Module
// Responsibility: login/register modal UI, user state (localStorage), user dropdown, auto-open panel upon account creation

(function () {
  'use strict';

  function initAuth() {
    var authModal       = document.getElementById('auth-modal');
    var panelModal      = document.getElementById('panel-modal');
    var tabBtnLogin     = document.getElementById('tab-btn-login');
    var tabBtnRegister  = document.getElementById('tab-btn-register');
    var formLogin       = document.getElementById('form-login');
    var formRegister    = document.getElementById('form-register');
    var linkToReg       = document.getElementById('link-switch-to-reg');
    var linkToLogin     = document.getElementById('link-switch-to-login');
    var headerGuest     = document.getElementById('header-auth-guest');
    var headerUser      = document.getElementById('header-auth-user');
    var userNameDisplay = document.getElementById('user-name-display');
    var dropdownMenu    = document.getElementById('user-dropdown-menu');
    var menuLogout      = document.getElementById('menu-logout');
    var menuOpenPanel   = document.getElementById('menu-open-panel');
    var btnNavLogin     = document.getElementById('btn-nav-login');
    var btnNavRegister  = document.getElementById('btn-nav-register');

    // --- Tab switching ---
    function showLoginTab() {
      if (formLogin)    formLogin.style.display    = 'flex';
      if (formRegister) formRegister.style.display = 'none';
      if (tabBtnLogin)    { tabBtnLogin.style.color = '#092433';             tabBtnLogin.style.borderBottom    = '2px solid #092433'; }
      if (tabBtnRegister) { tabBtnRegister.style.color = 'rgba(9,36,51,0.4)'; tabBtnRegister.style.borderBottom = '2px solid transparent'; }
    }

    function showRegisterTab() {
      if (formLogin)    formLogin.style.display    = 'none';
      if (formRegister) formRegister.style.display = 'flex';
      if (tabBtnRegister) { tabBtnRegister.style.color = '#092433';             tabBtnRegister.style.borderBottom    = '2px solid #092433'; }
      if (tabBtnLogin)    { tabBtnLogin.style.color = 'rgba(9,36,51,0.4)'; tabBtnLogin.style.borderBottom = '2px solid transparent'; }
    }

    function openAuthModal(isRegister) {
      if (!authModal) return;
      authModal.style.display = 'flex';
      if (isRegister) showRegisterTab(); else showLoginTab();
    }

    function openControlPanel() {
      if (panelModal) {
        panelModal.style.display = 'flex';
      } else {
        window.location.href = '/panel';
      }
    }

    // --- User state ---
    function checkUserState() {
      var raw = localStorage.getItem('likemark_user');
      if (raw) {
        try {
          var parsed = JSON.parse(raw);
          var displayName = parsed.name || (parsed.email ? parsed.email.split('@')[0] : 'Клієнт');

          if (headerGuest && headerUser) {
            headerGuest.style.display = 'none';
            headerUser.style.display  = 'flex';
            if (userNameDisplay) userNameDisplay.textContent = displayName;
          }

          // Update header login buttons to show profile or panel
          document.querySelectorAll('.btn-header-login, #btn-header-login').forEach(function (btn) {
            btn.textContent = displayName;
            btn.setAttribute('title', 'Відкрити панель керування');
            btn.classList.add('logged-in');
          });
        } catch (e) {}
      } else {
        if (headerGuest && headerUser) {
          headerGuest.style.display = 'flex';
          headerUser.style.display  = 'none';
        }
        document.querySelectorAll('.btn-header-login, #btn-header-login').forEach(function (btn) {
          btn.textContent = 'Увійти';
          btn.classList.remove('logged-in');
        });
      }
    }

    function saveUser(name, email) {
      var userObj = { name: name, email: email, loggedIn: true, registeredAt: new Date().toISOString() };
      localStorage.setItem('likemark_user', JSON.stringify(userObj));
      checkUserState();
    }

    // --- Event bindings ---
    if (btnNavLogin)    btnNavLogin.addEventListener('click',    function () { openAuthModal(false); });
    if (btnNavRegister) btnNavRegister.addEventListener('click', function () { openAuthModal(true); });
    if (tabBtnLogin)    tabBtnLogin.addEventListener('click',    showLoginTab);
    if (tabBtnRegister) tabBtnRegister.addEventListener('click', showRegisterTab);

    if (linkToReg)   linkToReg.addEventListener('click',   function (e) { e.preventDefault(); showRegisterTab(); });
    if (linkToLogin) linkToLogin.addEventListener('click', function (e) { e.preventDefault(); showLoginTab(); });

    // Submit LOGIN form
    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('login-email') && document.getElementById('login-email').value || '').trim();
        saveUser(email.split('@')[0], email);
        if (authModal)  authModal.style.display  = 'none';
        openControlPanel();
      });
    }

    // Submit REGISTER form — immediately activates and opens control panel
    if (formRegister) {
      formRegister.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('reg-email') && document.getElementById('reg-email').value || '').trim();
        var name  = (document.getElementById('reg-name') && document.getElementById('reg-name').value || '').trim();
        saveUser(name || email.split('@')[0], email);

        // Submit registration notice to /api/lead
        fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || email.split('@')[0],
            email: email,
            source: 'Реєстрація нового клієнта в панелі LIKEMARK',
            comment: 'Створено акаунт у хмарній панелі'
          })
        }).catch(function () {});

        if (authModal) authModal.style.display = 'none';
        openControlPanel();
      });
    }

    // User dropdown toggle
    if (headerUser) {
      headerUser.addEventListener('click', function (e) {
        if (e.target.closest('#user-dropdown-menu')) return;
        if (dropdownMenu) {
          dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        }
      });
    }

    if (menuLogout) {
      menuLogout.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('likemark_user');
        checkUserState();
        if (dropdownMenu) dropdownMenu.style.display = 'none';
      });
    }

    if (menuOpenPanel) {
      menuOpenPanel.addEventListener('click', function (e) {
        e.preventDefault();
        if (dropdownMenu) dropdownMenu.style.display = 'none';
        openControlPanel();
      });
    }

    // Intercept clicks on panel buttons & links
    document.addEventListener('click', function (e) {
      var target = e.target;
      var panelTrigger = target.closest('#hero-btn-panel, a[href="#panel"], a[href="/panel"], .btn-open-panel, .btn-header-login');
      if (panelTrigger) {
        e.preventDefault();
        var user = localStorage.getItem('likemark_user');
        if (user) {
          openControlPanel();
        } else {
          // If clicking "Увійти", show login; if clicking "Перейти в панель", show registration
          var isRegister = panelTrigger.id === 'hero-btn-panel' || panelTrigger.getAttribute('href') === '#panel' || panelTrigger.getAttribute('href') === '/panel';
          openAuthModal(isRegister);
        }
      }
    });

    // Expose globally
    window.openAuthModal = openAuthModal;
    window.openControlPanel = openControlPanel;
    window.checkUserState = checkUserState;

    // Handle any links targeting #login or #register
    document.querySelectorAll('a[href="#login"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openAuthModal(false); });
    });
    document.querySelectorAll('a[href="#register"], a[href="#signup"]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openAuthModal(true); });
    });

    checkUserState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
