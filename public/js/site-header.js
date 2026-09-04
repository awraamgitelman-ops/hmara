// LIKEMARK CLOUD — Unified Site Header & Navigation Controller (Selectel-style Reference)
(function () {
  'use strict';

  function initSiteHeader() {
    // 1. Mobile Drawer Navigation & Accordions
    var burgerBtn = document.getElementById('header-burger-btn');
    var drawerOverlay = document.getElementById('mobile-drawer-overlay');
    var drawer = document.getElementById('mobile-drawer');
    var drawerCloseBtn = document.getElementById('mobile-drawer-close');

    function openDrawer() {
      if (drawerOverlay && drawer) {
        drawerOverlay.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeDrawer() {
      if (drawerOverlay && drawer) {
        drawerOverlay.classList.remove('active');
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (burgerBtn) burgerBtn.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Accordions inside Mobile Drawer
    document.querySelectorAll('.mobile-group-title').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.mobile-drawer-group');
        if (group) {
          group.classList.toggle('open');
        }
      });
    });

    document.querySelectorAll('.mobile-drawer-link').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeDrawer();
        closeModals();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    });

    // 2. Auth Modal Triggers ('Увійти' & 'Створити акаунт')
    function openAuth(mode) {
      closeDrawer();
      var user = localStorage.getItem('likemark_user');
      if (user) {
        window.location.href = '/panel';
        return;
      }

      var authModal = document.getElementById('auth-modal');
      if (authModal) {
        authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        var tabLogin = document.getElementById('tab-btn-login');
        var tabReg   = document.getElementById('tab-btn-register');
        var formLogin = document.getElementById('form-login');
        var formReg   = document.getElementById('form-register');

        if (mode === 'register') {
          if (tabReg) tabReg.click();
          else if (formReg && formLogin) {
            formLogin.style.display = 'none';
            formReg.style.display = 'flex';
          }
        } else {
          if (tabLogin) tabLogin.click();
          else if (formReg && formLogin) {
            formLogin.style.display = 'flex';
            formReg.style.display = 'none';
          }
        }
      } else {
        window.location.href = '/panel';
      }
    }

    document.querySelectorAll('#btn-header-login, #btn-mobile-login, .btn-header-login').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openAuth('login');
      });
    });

    document.querySelectorAll('#btn-header-register, #btn-mobile-register, .btn-header-register').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openAuth('register');
      });
    });

    // 3. Speed Test Modal
    var speedModal = document.getElementById('speed-modal');
    var btnTopSpeed = document.getElementById('btn-top-speed');
    var btnRetestSpeed = document.getElementById('btn-retest-speed');

    function openSpeed() {
      if (speedModal) {
        speedModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    if (btnTopSpeed) {
      btnTopSpeed.addEventListener('click', function (e) {
        e.preventDefault();
        openSpeed();
      });
    }

    if (btnRetestSpeed) {
      btnRetestSpeed.addEventListener('click', function () {
        var pingWaw = document.getElementById('ping-waw');
        var pingFra = document.getElementById('ping-fra');
        var pingAms = document.getElementById('ping-ams');

        if (pingWaw) pingWaw.textContent = '... ms';
        if (pingFra) pingFra.textContent = '... ms';
        if (pingAms) pingAms.textContent = '... ms';
        btnRetestSpeed.disabled = true;
        btnRetestSpeed.textContent = 'Вимірювання…';

        setTimeout(function () {
          if (pingWaw) pingWaw.textContent = (13 + Math.floor(Math.random() * 3)) + ' ms';
          if (pingFra) pingFra.textContent = (21 + Math.floor(Math.random() * 3)) + ' ms';
          if (pingAms) pingAms.textContent = (26 + Math.floor(Math.random() * 4)) + ' ms';
          btnRetestSpeed.disabled = false;
          btnRetestSpeed.textContent = 'Тестувати знову';
        }, 600);
      });
    }

    // 4. Search Modal
    var searchModal = document.getElementById('search-modal');
    var btnSearch = document.getElementById('btn-header-search');
    var searchInput = document.getElementById('header-search-input');
    var searchResultsBox = document.getElementById('search-results-box');

    function openSearch() {
      if (searchModal) {
        searchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (searchInput) {
          setTimeout(function () {
            searchInput.focus();
          }, 100);
        }
      } else {
        window.location.href = '/kb/cloud-vps.html';
      }
    }

    if (btnSearch) {
      btnSearch.addEventListener('click', function (e) {
        e.preventDefault();
        openSearch();
      });
    }

    if (searchInput && searchResultsBox) {
      searchInput.addEventListener('input', function () {
        var query = searchInput.value.toLowerCase().trim();
        var items = searchResultsBox.querySelectorAll('a');
        items.forEach(function (item) {
          var text = item.textContent.toLowerCase();
          if (!query || text.indexOf(query) !== -1) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }

    // 5. Generic modal close buttons
    function closeModals() {
      document.querySelectorAll('#speed-modal, #search-modal, #auth-modal, #calc-modal, #consult-modal, #newsletter-modal').forEach(function (m) {
        m.style.display = 'none';
      });
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.modal-close-generic').forEach(function (btn) {
      btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('#speed-modal, #search-modal, #auth-modal, #calc-modal, #consult-modal, #newsletter-modal').forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModals();
        }
      });
    });

    // 6. Touch support for desktop dropdowns
    document.querySelectorAll('.site-header .nav-item.has-dropdown').forEach(function (item) {
      var btn = item.querySelector('.nav-link-btn');
      if (btn) {
        btn.addEventListener('click', function (e) {
          // On mobile or touch where hover isn't natural
          if (window.innerWidth <= 1200) {
            e.preventDefault();
            var isOpen = item.classList.contains('active');
            document.querySelectorAll('.site-header .nav-item.has-dropdown').forEach(function (other) {
              other.classList.remove('active');
            });
            if (!isOpen) item.classList.add('active');
          }
        });
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header .nav-item.has-dropdown')) {
        document.querySelectorAll('.site-header .nav-item.has-dropdown').forEach(function (item) {
          item.classList.remove('active');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteHeader);
  } else {
    initSiteHeader();
  }

  // =========================================================================
  // 7. Cookie Banner Controller
  // =========================================================================
  (function () {
    function dismissCookieBanner() {
      try {
        localStorage.setItem('likemark_cookie_accepted', 'true');
      } catch (e) {}

      var selectors = '#native-cookie-banner, #cookie-notice-banner, .cookies, [data-sonner-toaster], [data-sonner-toast]';
      var banners = document.querySelectorAll(selectors);
      banners.forEach(function (banner) {
        banner.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        banner.style.opacity = '0';
        banner.style.pointerEvents = 'none';
        setTimeout(function () {
          banner.style.setProperty('display', 'none', 'important');
          banner.setAttribute('hidden', 'true');
        }, 200);
      });

      var style = document.createElement('style');
      style.id = 'cookie-dismiss-override';
      style.innerHTML = '#native-cookie-banner, #cookie-notice-banner, .cookies, [data-sonner-toaster], [data-sonner-toast] { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
      document.head.appendChild(style);
    }

    function initCookieBanner() {
      var accepted = false;
      try {
        accepted = localStorage.getItem('likemark_cookie_accepted') === 'true';
      } catch (e) {}

      if (accepted) {
        var banners = document.querySelectorAll('#native-cookie-banner, #cookie-notice-banner, .cookies, [data-sonner-toaster], [data-sonner-toast]');
        banners.forEach(function (banner) {
          banner.style.setProperty('display', 'none', 'important');
          banner.setAttribute('hidden', 'true');
        });
        if (!document.getElementById('cookie-dismiss-override')) {
          var style = document.createElement('style');
          style.id = 'cookie-dismiss-override';
          style.innerHTML = '#native-cookie-banner, #cookie-notice-banner, .cookies, [data-sonner-toaster], [data-sonner-toast] { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
          document.head.appendChild(style);
        }
      }
    }

    function handleCookieClick(e) {
      var t = e.target;
      while (t && t !== document && t !== window) {
        var id = t.id || '';
        var classes = t.classList || { contains: function () { return false; } };
        var text = (t.textContent || '').trim();

        if (id === 'btn-cookie-native-accept' ||
            id === 'btn-cookie-native-close'  ||
            id === 'cookie-accept-btn'        ||
            id === 'cookie-close-btn'         ||
            classes.contains('cookies__close') ||
            (t.tagName === 'BUTTON' && (text === 'Прийняти' || text === 'Accept'))) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          dismissCookieBanner();
          return;
        }
        t = t.parentElement;
      }
    }

    window.addEventListener('click', handleCookieClick, true);
    document.addEventListener('click', handleCookieClick, true);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
      initCookieBanner();
    }
    setTimeout(initCookieBanner, 300);
    setTimeout(initCookieBanner, 1000);
  })();
})();
