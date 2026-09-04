// LIKEMARK — Auth Module
// Responsibility: login/register modal UI, user state (localStorage), user dropdown

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
    var heroBtnPanel    = document.getElementById('hero-btn-panel');
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

    // --- User state ---
    function checkUserState() {
      var raw = localStorage.getItem('likemark_user');
      if (raw && headerGuest && headerUser) {
        headerGuest.style.display = 'none';
        headerUser.style.display  = 'flex';
        try {
          var parsed = JSON.parse(raw);
          if (userNameDisplay && parsed.name) userNameDisplay.textContent = parsed.name;
        } catch (e) {}
      } else if (headerGuest && headerUser) {
        headerGuest.style.display = 'flex';
        headerUser.style.display  = 'none';
      }
    }

    function saveUser(name, email) {
      localStorage.setItem('likemark_user', JSON.stringify({ name: name, email: email, loggedIn: true }));
      checkUserState();
    }

    // --- Event bindings ---
    if (btnNavLogin)    btnNavLogin.addEventListener('click',    function () { openAuthModal(false); });
    if (btnNavRegister) btnNavRegister.addEventListener('click', function () { openAuthModal(true); });
    if (tabBtnLogin)    tabBtnLogin.addEventListener('click',    showLoginTab);
    if (tabBtnRegister) tabBtnRegister.addEventListener('click', showRegisterTab);

    if (linkToReg)   linkToReg.addEventListener('click',   function (e) { e.preventDefault(); showRegisterTab(); });
    if (linkToLogin) linkToLogin.addEventListener('click', function (e) { e.preventDefault(); showLoginTab(); });

    if (formLogin) {
      formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('login-email').value;
        saveUser(email.split('@')[0], email);
        if (authModal)  authModal.style.display  = 'none';
        if (panelModal) panelModal.style.display = 'flex';
      });
    }

    if (formRegister) {
      formRegister.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('reg-email').value;
        var name  = document.getElementById('reg-name').value;
        saveUser(name || email.split('@')[0], email);
        if (authModal)  authModal.style.display  = 'none';
        if (panelModal) panelModal.style.display = 'flex';
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
        if (panelModal)   panelModal.style.display   = 'flex';
      });
    }

    // Hero panel button
    if (heroBtnPanel) {
      heroBtnPanel.addEventListener('click', function (e) {
        e.preventDefault();
        if (localStorage.getItem('likemark_user') && panelModal) {
          panelModal.style.display = 'flex';
        } else {
          openAuthModal(false);
        }
      });
    }

    checkUserState();
  }

  document.addEventListener('DOMContentLoaded', initAuth);
}());
