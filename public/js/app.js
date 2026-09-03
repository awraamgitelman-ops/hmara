// LIKEMARK Cloud Platform - Main Interactive Logic
document.addEventListener('DOMContentLoaded', function () {
  console.log('LIKEMARK Cloud initialized.');

  // =========================================================================
  // 1. SINGLE NATIVE CAROUSEL CONTROLLER
  // =========================================================================
  const track = document.querySelector('.swiper-cards__track');
  const wrapper = track ? track.querySelector('.swiper-wrapper') : null;
  const slides = wrapper ? wrapper.querySelectorAll('.swiper-slide') : [];
  const prevBtn = document.querySelector('.slider-controls__button:not(.slider-controls__button--next)');
  const nextBtn = document.querySelector('.slider-controls__button--next');
  const segments = document.querySelectorAll('.slider-controls__pagination-segment');

  let currentIndex = 0;

  function getStepWidth() {
    if (!slides || slides.length === 0) return 396;
    const slide = slides[0];
    const style = window.getComputedStyle(slide);
    const mr = parseFloat(style.marginRight) || 16;
    return slide.offsetWidth + mr;
  }

  function getMaxIndex() {
    if (segments && segments.length > 0) {
      return segments.length - 1;
    }
    return Math.max(0, slides.length - 1);
  }

  function updateSlider() {
    if (!wrapper || !track) return;
    const step = getStepWidth();
    const maxIdx = getMaxIndex();

    // Clamp index
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIdx) currentIndex = maxIdx;

    // Calculate maximum available scroll
    const trackWidth = track.clientWidth;
    const totalWidth = wrapper.scrollWidth || (slides.length * step);
    const maxScroll = Math.max(0, totalWidth - trackWidth);

    let targetX = currentIndex * step;
    if (targetX > maxScroll) targetX = maxScroll;

    // Smooth transform
    wrapper.style.transform = `translate3d(-${targetX}px, 0px, 0px)`;

    // Update segment active states (59px wide dash vs 12px short dash)
    segments.forEach((seg, idx) => {
      if (idx === currentIndex) {
        seg.classList.add('slider-controls__pagination-segment--active');
        seg.setAttribute('aria-current', 'true');
      } else {
        seg.classList.remove('slider-controls__pagination-segment--active');
        seg.removeAttribute('aria-current');
      }
    });

    // Update buttons disabled state
    if (prevBtn) {
      if (currentIndex === 0) {
        prevBtn.setAttribute('disabled', 'disabled');
        prevBtn.disabled = true;
      } else {
        prevBtn.removeAttribute('disabled');
        prevBtn.disabled = false;
      }
    }

    if (nextBtn) {
      if (currentIndex >= maxIdx || targetX >= maxScroll) {
        nextBtn.setAttribute('disabled', 'disabled');
        nextBtn.disabled = true;
      } else {
        nextBtn.removeAttribute('disabled');
        nextBtn.disabled = false;
      }
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateSlider();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });
  }

  segments.forEach((seg, idx) => {
    seg.addEventListener('click', function (e) {
      e.preventDefault();
      currentIndex = idx;
      updateSlider();
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  if (track) {
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && currentIndex < getMaxIndex()) {
          currentIndex++;
          updateSlider();
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      }
    }, { passive: true });
  }

  window.addEventListener('resize', updateSlider);
  // Initial run
  updateSlider();

  // =========================================================================
  // 2. NATIVE COOKIE NOTICE BANNER
  // =========================================================================
  const cookieBanner = document.getElementById('native-cookie-banner') || document.getElementById('cookie-notice-banner') || document.querySelector('.cookies');
  const cookieAcceptBtn = document.getElementById('btn-cookie-native-accept') || document.getElementById('cookie-accept-btn');
  const cookieCloseBtn = document.getElementById('btn-cookie-native-close') || document.getElementById('cookie-close-btn') || (cookieBanner ? cookieBanner.querySelector('.cookies__close') : null);

  if (cookieBanner) {
    const isAccepted = localStorage.getItem('likemark_cookie_accepted');
    if (isAccepted === 'true') {
      cookieBanner.style.setProperty('display', 'none', 'important');
    }

    function dismissCookie(e) {
      if (e) e.preventDefault();
      localStorage.setItem('likemark_cookie_accepted', 'true');
      cookieBanner.style.opacity = '0';
      cookieBanner.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { cookieBanner.style.setProperty('display', 'none', 'important'); }, 300);
    }

    if (cookieAcceptBtn) cookieAcceptBtn.addEventListener('click', dismissCookie);
    if (cookieCloseBtn) cookieCloseBtn.addEventListener('click', dismissCookie);
  }

  // =========================================================================
  // 3. AUTH MODAL & STATE MANAGEMENT
  // =========================================================================
  const authModal = document.getElementById('auth-modal');
  const btnNavLogin = document.getElementById('btn-nav-login');
  const btnNavRegister = document.getElementById('btn-nav-register');
  const tabBtnLogin = document.getElementById('tab-btn-login');
  const tabBtnRegister = document.getElementById('tab-btn-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const linkSwitchToReg = document.getElementById('link-switch-to-reg');
  const linkSwitchToLogin = document.getElementById('link-switch-to-login');
  const headerAuthGuest = document.getElementById('header-auth-guest');
  const headerAuthUser = document.getElementById('header-auth-user');
  const userNameDisplay = document.getElementById('user-name-display');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  const menuLogout = document.getElementById('menu-logout');
  const menuOpenPanel = document.getElementById('menu-open-panel');
  const panelModal = document.getElementById('panel-modal');

  function openAuthModal(isRegister = false) {
    if (!authModal) return;
    authModal.style.display = 'flex';
    if (isRegister) {
      showRegisterTab();
    } else {
      showLoginTab();
    }
  }

  function showLoginTab() {
    if (formLogin) formLogin.style.display = 'flex';
    if (formRegister) formRegister.style.display = 'none';
    if (tabBtnLogin) {
      tabBtnLogin.style.color = '#092433';
      tabBtnLogin.style.borderBottom = '2px solid #092433';
    }
    if (tabBtnRegister) {
      tabBtnRegister.style.color = 'rgba(9,36,51,0.4)';
      tabBtnRegister.style.borderBottom = '2px solid transparent';
    }
  }

  function showRegisterTab() {
    if (formLogin) formLogin.style.display = 'none';
    if (formRegister) formRegister.style.display = 'flex';
    if (tabBtnRegister) {
      tabBtnRegister.style.color = '#092433';
      tabBtnRegister.style.borderBottom = '2px solid #092433';
    }
    if (tabBtnLogin) {
      tabBtnLogin.style.color = 'rgba(9,36,51,0.4)';
      tabBtnLogin.style.borderBottom = '2px solid transparent';
    }
  }

  if (btnNavLogin) btnNavLogin.addEventListener('click', () => openAuthModal(false));
  if (btnNavRegister) btnNavRegister.addEventListener('click', () => openAuthModal(true));
  if (tabBtnLogin) tabBtnLogin.addEventListener('click', showLoginTab);
  if (tabBtnRegister) tabBtnRegister.addEventListener('click', showRegisterTab);
  if (linkSwitchToReg) linkSwitchToReg.addEventListener('click', (e) => { e.preventDefault(); showRegisterTab(); });
  if (linkSwitchToLogin) linkSwitchToLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginTab(); });

  function checkUserState() {
    const user = localStorage.getItem('likemark_user');
    if (user && headerAuthGuest && headerAuthUser) {
      headerAuthGuest.style.display = 'none';
      headerAuthUser.style.display = 'flex';
      try {
        const parsed = JSON.parse(user);
        if (userNameDisplay && parsed.name) {
          userNameDisplay.textContent = parsed.name;
        }
      } catch (e) {}
    } else if (headerAuthGuest && headerAuthUser) {
      headerAuthGuest.style.display = 'flex';
      headerAuthUser.style.display = 'none';
    }
  }
  checkUserState();

  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const user = { name: email.split('@')[0], email: email, loggedIn: true };
      localStorage.setItem('likemark_user', JSON.stringify(user));
      checkUserState();
      if (authModal) authModal.style.display = 'none';
      if (panelModal) panelModal.style.display = 'flex';
    });
  }

  if (formRegister) {
    formRegister.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const name = document.getElementById('reg-name').value;
      const user = { name: name || email.split('@')[0], email: email, loggedIn: true };
      localStorage.setItem('likemark_user', JSON.stringify(user));
      checkUserState();
      if (authModal) authModal.style.display = 'none';
      if (panelModal) panelModal.style.display = 'flex';
    });
  }

  if (headerAuthUser) {
    headerAuthUser.addEventListener('click', function (e) {
      if (e.target.closest('#user-dropdown-menu')) return;
      if (userDropdownMenu) {
        userDropdownMenu.style.display = userDropdownMenu.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  if (menuLogout) {
    menuLogout.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('likemark_user');
      checkUserState();
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
    });
  }

  if (menuOpenPanel) {
    menuOpenPanel.addEventListener('click', function (e) {
      e.preventDefault();
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
      if (panelModal) panelModal.style.display = 'flex';
    });
  }

  const heroBtnPanel = document.getElementById('hero-btn-panel');
  if (heroBtnPanel) {
    heroBtnPanel.addEventListener('click', function (e) {
      e.preventDefault();
      const user = localStorage.getItem('likemark_user');
      if (user && panelModal) {
        panelModal.style.display = 'flex';
      } else {
        openAuthModal(false);
      }
    });
  }

  // =========================================================================
  // 4. CLOUD CALCULATOR MODAL & DYNAMIC PRICING
  // =========================================================================
  const calcModal = document.getElementById('calc-modal');
  const heroBtnCalc = document.getElementById('hero-btn-calc');
  const calcCpuRange = document.getElementById('calc-cpu-range');
  const calcRamRange = document.getElementById('calc-ram-range');
  const calcDiskRange = document.getElementById('calc-disk-range');
  const calcOsSelect = document.getElementById('calc-os-select');
  const calcCpuVal = document.getElementById('calc-cpu-val');
  const calcRamVal = document.getElementById('calc-ram-val');
  const calcDiskVal = document.getElementById('calc-disk-val');
  const calcTotalPrice = document.getElementById('calc-total-price');
  const calcOrderBtn = document.getElementById('calc-order-btn');

  function openCalcModal() {
    if (calcModal) calcModal.style.display = 'flex';
  }

  if (heroBtnCalc) heroBtnCalc.addEventListener('click', (e) => { e.preventDefault(); openCalcModal(); });

  // Any link targeting #calc
  document.querySelectorAll('a[href="#calc"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCalcModal();
    });
  });

  function recalculatePrice() {
    if (!calcCpuRange || !calcRamRange || !calcDiskRange || !calcOsSelect) return;
    const cpu = parseInt(calcCpuRange.value) || 4;
    const ram = parseInt(calcRamRange.value) || 8;
    const disk = parseInt(calcDiskRange.value) || 120;
    const osPrice = parseInt(calcOsSelect.value) || 0;

    if (calcCpuVal) calcCpuVal.textContent = `${cpu} ${cpu === 1 ? 'ядро' : (cpu < 5 ? 'ядра' : 'ядер')}`;
    if (calcRamVal) calcRamVal.textContent = `${ram} GB`;
    if (calcDiskVal) calcDiskVal.textContent = `${disk} GB`;

    // CPU: 180 ₴/core, RAM: 75 ₴/GB, NVMe: 2.5 ₴/GB
    const total = Math.round((cpu * 180) + (ram * 75) + (disk * 2.5) + osPrice);
    if (calcTotalPrice) {
      calcTotalPrice.textContent = `${total.toLocaleString('uk-UA')} ₴ / міс`;
    }
  }

  if (calcCpuRange) calcCpuRange.addEventListener('input', recalculatePrice);
  if (calcRamRange) calcRamRange.addEventListener('input', recalculatePrice);
  if (calcDiskRange) calcDiskRange.addEventListener('input', recalculatePrice);
  if (calcOsSelect) calcOsSelect.addEventListener('change', recalculatePrice);

  const consultModal = document.getElementById('consult-modal');
  if (calcOrderBtn) {
    calcOrderBtn.addEventListener('click', function () {
      if (calcModal) calcModal.style.display = 'none';
      if (consultModal) {
        consultModal.style.display = 'flex';
        const commentField = consultModal.querySelector('textarea[name="comment"]');
        if (commentField) {
          commentField.value = `Замовлення сервера: ${calcCpuVal.textContent}, ${calcRamVal.textContent}, ${calcDiskVal.textContent} NVMe. Вартість: ${calcTotalPrice.textContent}`;
        }
      }
    });
  }

  // =========================================================================
  // 5. CONSULTATION MODAL & FLOATING BUTTON
  // =========================================================================
  const btnConsultFloating = document.getElementById('btn-consult-floating');
  const formConsult = document.getElementById('form-consult');

  if (btnConsultFloating) {
    btnConsultFloating.addEventListener('click', function () {
      if (consultModal) consultModal.style.display = 'flex';
    });
  }

  if (formConsult) {
    formConsult.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-consult-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Надсилаємо заявку...';
      }

      const formData = new FormData(formConsult);
      const payload = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        comment: formData.get('comment'),
        source: 'Форма онлайн-консультації LIKEMARK CLOUD'
      };

      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Fallback offline handling lead:', err);
      }

      if (submitBtn) {
        submitBtn.style.background = '#0ab476';
        submitBtn.textContent = '✓ Заявку прийнято! Інженер зателефонує вам';
      }

      setTimeout(() => {
        if (consultModal) consultModal.style.display = 'none';
        formConsult.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.background = '#eb4247';
          submitBtn.textContent = 'Замовити консультацію';
        }
      }, 2500);
    });
  }

  // =========================================================================
  // 6. GENERIC MODAL CLOSE BUTTONS & OUTSIDE CLICK
  // =========================================================================
  document.querySelectorAll('.modal-close-generic').forEach(btn => {
    btn.addEventListener('click', function () {
      if (authModal) authModal.style.display = 'none';
      if (panelModal) panelModal.style.display = 'none';
      if (calcModal) calcModal.style.display = 'none';
      if (consultModal) consultModal.style.display = 'none';
    });
  });

  [authModal, panelModal, calcModal, consultModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (authModal) authModal.style.display = 'none';
      if (panelModal) panelModal.style.display = 'none';
      if (calcModal) calcModal.style.display = 'none';
      if (consultModal) consultModal.style.display = 'none';
      if (userDropdownMenu) userDropdownMenu.style.display = 'none';
    }
  });
});
