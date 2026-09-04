// LIKEMARK CLOUD — Authentic Selectel Header Controller
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Drawer
  const burgerBtn = document.getElementById('btn-selectel-burger');
  const drawerOverlay = document.getElementById('mobile-drawer-selectel-overlay');
  const drawer = document.getElementById('mobile-drawer-selectel');
  const drawerClose = document.getElementById('btn-selectel-drawer-close');

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
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // 2. Search Modal
  const searchBtn = document.getElementById('btn-selectel-search');
  const searchModal = document.getElementById('search-modal-selectel');
  const searchInput = document.getElementById('search-input-selectel');

  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('active');
      if (searchInput) setTimeout(() => searchInput.focus(), 50);
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchModal) {
    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) closeSearch();
    });
  }

  // 3. Network Speed Modal
  const speedBtn = document.getElementById('btn-selectel-speed');
  const speedModal = document.getElementById('speed-modal-selectel');
  const speedClose = document.getElementById('btn-selectel-speed-close');

  function openSpeed() {
    if (speedModal) {
      speedModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSpeed() {
    if (speedModal) {
      speedModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (speedBtn) speedBtn.addEventListener('click', openSpeed);
  if (speedClose) speedClose.addEventListener('click', closeSpeed);
  if (speedModal) {
    speedModal.addEventListener('click', function (e) {
      if (e.target === speedModal) closeSpeed();
    });
  }

  // 4. Keyboard shortcuts (ESC to close modals)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
      closeSearch();
      closeSpeed();
    }
  });
});
