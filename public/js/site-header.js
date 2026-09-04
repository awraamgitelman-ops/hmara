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

  // 3. Cookie Banner — event delegation (works after Vue hydration)
  function dismissCookieBanner() {
    var banner = document.getElementById('native-cookie-banner') ||
                 document.getElementById('cookie-notice-banner') ||
                 document.querySelector('.cookies');
    if (!banner) return;
    localStorage.setItem('likemark_cookie_accepted', 'true');
    banner.style.transition = 'opacity 0.3s ease';
    banner.style.opacity = '0';
    setTimeout(function () {
      banner.style.setProperty('display', 'none', 'important');
    }, 300);
  }

  // Show/hide banner based on localStorage
  function initCookieBanner() {
    var banner = document.getElementById('native-cookie-banner') ||
                 document.getElementById('cookie-notice-banner') ||
                 document.querySelector('.cookies');
    if (!banner) return;
    if (localStorage.getItem('likemark_cookie_accepted') === 'true') {
      banner.style.setProperty('display', 'none', 'important');
    }
  }

  // Use delegation so we catch buttons even after Vue replaces the DOM
  document.addEventListener('click', function (e) {
    var t = e.target;
    // Walk up to find a button (in case click was on SVG inside button)
    while (t && t !== document) {
      if (t.id === 'btn-cookie-native-accept' ||
          t.id === 'btn-cookie-native-close' ||
          t.id === 'cookie-accept-btn' ||
          t.id === 'cookie-close-btn' ||
          t.classList.contains('cookies__close')) {
        e.preventDefault();
        dismissCookieBanner();
        return;
      }
      t = t.parentElement;
    }
  });

  // Init immediately and retry after short delay (Vue hydration may be async)
  initCookieBanner();
  setTimeout(initCookieBanner, 500);
  setTimeout(initCookieBanner, 1500);
});
