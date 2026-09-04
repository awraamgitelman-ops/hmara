// LIKEMARK CLOUD — Unified Site Header Controller
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Drawer Navigation
  const burgerBtn = document.getElementById('header-burger-btn');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('mobile-drawer-close');

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

  document.querySelectorAll('.mobile-drawer-link').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // 2. Login & Consultation Modal Triggers
  function triggerLogin(e) {
    if (e) e.preventDefault();
    closeDrawer();
    const authModal = document.getElementById('auth-modal');
    const leadModal = document.getElementById('lead-modal');
    const consultModal = document.getElementById('consultModal') || document.getElementById('consult-modal');

    if (authModal) {
      authModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else if (leadModal) {
      const modalTariffInput = document.getElementById('modal-tariff-input');
      const modalTitle = leadModal.querySelector('.modal-title');
      if (modalTariffInput) modalTariffInput.value = 'Вхід до кабінету';
      if (modalTitle) modalTitle.textContent = 'Вхід до кабінету';
      leadModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else if (consultModal) {
      consultModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function triggerConsult(e) {
    if (e) e.preventDefault();
    closeDrawer();
    const consultModal = document.getElementById('consult-modal') || document.getElementById('consultModal');
    const leadModal = document.getElementById('lead-modal');

    if (consultModal) {
      consultModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else if (leadModal) {
      const modalTariffInput = document.getElementById('modal-tariff-input');
      const modalTitle = leadModal.querySelector('.modal-title');
      if (modalTariffInput) modalTariffInput.value = 'Консультація спеціаліста LIKEMARK';
      if (modalTitle) modalTitle.textContent = 'Консультація спеціаліста';
      leadModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  document.querySelectorAll('.btn-header-login').forEach(function (btn) {
    btn.addEventListener('click', triggerLogin);
  });

  document.querySelectorAll('.btn-header-cta, .mobile-drawer-btn-cta').forEach(function (btn) {
    btn.addEventListener('click', triggerConsult);
  });

  // 3. Cookie Banner — robust dismissal
  function dismissCookieBanner() {
    try {
      localStorage.setItem('likemark_cookie_accepted', 'true');
    } catch (e) {}

    var banners = document.querySelectorAll('#native-cookie-banner, #cookie-notice-banner, .cookies, [data-sonner-toaster], [data-sonner-toast]');
    banners.forEach(function (banner) {
      banner.style.transition = 'opacity 0.25s ease';
      banner.style.opacity = '0';
      setTimeout(function () {
        banner.style.setProperty('display', 'none', 'important');
        banner.setAttribute('hidden', 'true');
      }, 250);
    });
  }

  // Show/hide banner based on localStorage
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
    }
  }

  // Capture phase (true) — fires BEFORE Nuxt/Vue component handlers,
  // so stopPropagation() from inside the component cannot block us.
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document) {
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
        dismissCookieBanner();
        return;
      }
      t = t.parentElement;
    }
  }, true); // <-- capture phase

  // Init immediately and retry after short delay (Vue hydration may be async)
  initCookieBanner();
  setTimeout(initCookieBanner, 300);
  setTimeout(initCookieBanner, 800);
  setTimeout(initCookieBanner, 1500);
});
