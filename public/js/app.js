document.addEventListener('DOMContentLoaded', function () {
  // ==========================================
  // 1. SWIPER HORIZONTAL NAVIGATION & DASHES
  // ==========================================
  const swiperTrack = document.querySelector('.swiper-cards__track');
  const btnPrev = document.getElementById('swiper-btn-prev');
  const btnNext = document.getElementById('swiper-btn-next');
  const dashes = document.querySelectorAll('.carousel-dash');

  function updateDashes() {
    if (!swiperTrack || dashes.length === 0) return;
    const slide = swiperTrack.querySelector('.swiper-slide');
    if (!slide) return;
    const slideWidth = slide.offsetWidth + 16;
    const maxIdx = dashes.length - 1;
    const currentIdx = Math.min(maxIdx, Math.max(0, Math.round(swiperTrack.scrollLeft / slideWidth)));

    dashes.forEach((d, idx) => {
      if (idx === currentIdx) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }

  if (swiperTrack) {
    swiperTrack.addEventListener('scroll', updateDashes, { passive: true });

    if (btnNext) {
      btnNext.addEventListener('click', function (e) {
        e.preventDefault();
        const slide = swiperTrack.querySelector('.swiper-slide');
        const step = slide ? (slide.offsetWidth + 16) : 380;
        swiperTrack.scrollBy({ left: step, behavior: 'smooth' });
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', function (e) {
        e.preventDefault();
        const slide = swiperTrack.querySelector('.swiper-slide');
        const step = slide ? (slide.offsetWidth + 16) : 380;
        swiperTrack.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    dashes.forEach(d => {
      d.addEventListener('click', function () {
        const idx = parseInt(d.getAttribute('data-index'));
        const slide = swiperTrack.querySelector('.swiper-slide');
        const step = slide ? (slide.offsetWidth + 16) : 380;
        swiperTrack.scrollTo({ left: idx * step, behavior: 'smooth' });
      });
    });
  }

  // ==========================================
  // 2. SCROLL TO TOP BUTTON
  // ==========================================
  const upBtn = document.querySelector('.up-button');
  if (upBtn) {
    upBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 3. COOKIE BANNER MANAGER
  // ==========================================
  const cookieBanner = document.getElementById('cookie-notice-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
  const cookieCloseBtn = document.getElementById('cookie-close-btn');

  if (cookieBanner) {
    const isAccepted = localStorage.getItem('likemark_cookie_accepted');
    if (isAccepted) {
      cookieBanner.style.display = 'none';
    } else {
      cookieBanner.style.display = 'flex';
    }

    if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', function () {
        localStorage.setItem('likemark_cookie_accepted', 'true');
        cookieBanner.style.opacity = '0';
        setTimeout(() => { cookieBanner.style.display = 'none'; }, 200);
      });
    }

    if (cookieCloseBtn) {
      cookieCloseBtn.addEventListener('click', function () {
        cookieBanner.style.display = 'none';
      });
    }
  }

  // ==========================================
  // 4. MODAL CONTROLS (GENERIC)
  // ==========================================
  function openModal(modalEl) {
    if (modalEl) {
      modalEl.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalEl) {
    if (modalEl) {
      modalEl.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.modal-close-generic').forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = btn.closest('[id$="-modal"]');
      closeModal(modal);
    });
  });

  document.querySelectorAll('[id$="-modal"]').forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal(modal);
    });
  });

  // ==========================================
  // 5. ACCOUNT SYSTEM (LOGIN / REGISTRATION)
  // ==========================================
  const authModal = document.getElementById('auth-modal');
  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const switchReg = document.getElementById('link-switch-to-reg');
  const switchLog = document.getElementById('link-switch-to-login');

  const guestHeader = document.getElementById('header-auth-guest');
  const userHeader = document.getElementById('header-auth-user');
  const userNameDisplay = document.getElementById('user-name-display');
  const userDropdown = document.getElementById('user-dropdown-menu');
  const panelModal = document.getElementById('panel-modal');

  function setAuthTab(tab) {
    if (tab === 'login') {
      if (tabLogin) {
        tabLogin.style.color = '#092433';
        tabLogin.style.borderBottom = '2px solid #092433';
      }
      if (tabRegister) {
        tabRegister.style.color = 'rgba(9,36,51,0.4)';
        tabRegister.style.borderBottom = 'none';
      }
      if (formLogin) formLogin.style.display = 'flex';
      if (formRegister) formRegister.style.display = 'none';
    } else {
      if (tabRegister) {
        tabRegister.style.color = '#092433';
        tabRegister.style.borderBottom = '2px solid #092433';
      }
      if (tabLogin) {
        tabLogin.style.color = 'rgba(9,36,51,0.4)';
        tabLogin.style.borderBottom = 'none';
      }
      if (formRegister) formRegister.style.display = 'flex';
      if (formLogin) formLogin.style.display = 'none';
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => setAuthTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => setAuthTab('register'));
  if (switchReg) switchReg.addEventListener('click', (e) => { e.preventDefault(); setAuthTab('register'); });
  if (switchLog) switchLog.addEventListener('click', (e) => { e.preventDefault(); setAuthTab('login'); });

  function syncAuthState() {
    const rawUser = localStorage.getItem('likemark_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (guestHeader) guestHeader.style.display = 'none';
      if (userHeader) userHeader.style.display = 'flex';
      if (userNameDisplay) userNameDisplay.innerText = user.name || 'Кабінет';
    } else {
      if (guestHeader) guestHeader.style.display = 'flex';
      if (userHeader) userHeader.style.display = 'none';
    }
  }
  syncAuthState();

  if (userHeader) {
    userHeader.addEventListener('click', function () {
      if (userDropdown) {
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  const menuLogout = document.getElementById('menu-logout');
  if (menuLogout) {
    menuLogout.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('likemark_user');
      if (userDropdown) userDropdown.style.display = 'none';
      syncAuthState();
    });
  }

  const menuOpenPanel = document.getElementById('menu-open-panel');
  if (menuOpenPanel) {
    menuOpenPanel.addEventListener('click', function (e) {
      e.preventDefault();
      if (userDropdown) userDropdown.style.display = 'none';
      openModal(panelModal);
    });
  }

  const btnNavLogin = document.getElementById('btn-nav-login');
  const btnNavRegister = document.getElementById('btn-nav-register');
  if (btnNavLogin) {
    btnNavLogin.addEventListener('click', function () {
      setAuthTab('login');
      openModal(authModal);
    });
  }
  if (btnNavRegister) {
    btnNavRegister.addEventListener('click', function () {
      setAuthTab('register');
      openModal(authModal);
    });
  }

  document.querySelectorAll('.btn-open-login').forEach(b => {
    b.addEventListener('click', () => { setAuthTab('login'); openModal(authModal); });
  });
  document.querySelectorAll('.btn-open-register').forEach(b => {
    b.addEventListener('click', () => { setAuthTab('register'); openModal(authModal); });
  });

  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const user = { email, name: email.split('@')[0], id: '45356074', loggedIn: true };
      localStorage.setItem('likemark_user', JSON.stringify(user));
      syncAuthState();
      closeModal(authModal);
      openModal(panelModal);
    });
  }

  if (formRegister) {
    formRegister.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const phone = document.getElementById('reg-phone').value;
      const name = document.getElementById('reg-name').value;

      const user = { email, phone, name, id: '45356074', loggedIn: true };
      localStorage.setItem('likemark_user', JSON.stringify(user));
      syncAuthState();

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, source: 'Реєстрація акаунта LIKEMARK', tariff: 'Тест 7 днів (Облако)' })
      }).catch(() => {});

      closeModal(authModal);
      openModal(panelModal);
    });
  }

  // ==========================================
  // 6. HERO BANNERS & CARDS BUTTONS
  // ==========================================
  const heroBtnPanel = document.getElementById('hero-btn-panel');
  const heroBtnCalc = document.getElementById('hero-btn-calc');
  const heroBtnAi = document.getElementById('hero-btn-ai');
  const calcModal = document.getElementById('calc-modal');

  if (heroBtnPanel) {
    heroBtnPanel.addEventListener('click', function () {
      const rawUser = localStorage.getItem('likemark_user');
      if (rawUser) {
        openModal(panelModal);
      } else {
        setAuthTab('login');
        openModal(authModal);
      }
    });
  }

  if (heroBtnCalc) {
    heroBtnCalc.addEventListener('click', function () {
      openModal(calcModal);
    });
  }

  if (heroBtnAi) {
    heroBtnAi.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(panelModal);
    });
  }

  document.querySelectorAll('.btn-open-calc').forEach(b => {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(calcModal);
    });
  });

  // ==========================================
  // 7. INTERACTIVE SERVER CALCULATOR
  // ==========================================
  const cpuRange = document.getElementById('calc-cpu-range');
  const ramRange = document.getElementById('calc-ram-range');
  const diskRange = document.getElementById('calc-disk-range');
  const osSelect = document.getElementById('calc-os-select');

  const cpuVal = document.getElementById('calc-cpu-val');
  const ramVal = document.getElementById('calc-ram-val');
  const diskVal = document.getElementById('calc-disk-val');
  const totalPrice = document.getElementById('calc-total-price');
  const calcOrderBtn = document.getElementById('calc-order-btn');

  function updateCalc() {
    if (!cpuRange || !ramRange || !diskRange || !osSelect) return;
    const cpu = parseInt(cpuRange.value);
    const ram = parseInt(ramRange.value);
    const disk = parseInt(diskRange.value);
    const os = parseInt(osSelect.value);

    cpuVal.innerText = cpu + (cpu === 1 ? ' ядро' : (cpu < 5 ? ' ядра' : ' ядер'));
    ramVal.innerText = ram + ' GB';
    diskVal.innerText = disk + ' GB';

    const total = 390 + (cpu * 120) + (ram * 60) + Math.round(disk * 2.2) + os;
    totalPrice.innerText = total.toLocaleString('uk-UA') + ' ₴ / міс';
  }

  if (cpuRange) cpuRange.addEventListener('input', updateCalc);
  if (ramRange) ramRange.addEventListener('input', updateCalc);
  if (diskRange) diskRange.addEventListener('input', updateCalc);
  if (osSelect) osSelect.addEventListener('change', updateCalc);
  updateCalc();

  if (calcOrderBtn) {
    calcOrderBtn.addEventListener('click', function () {
      closeModal(calcModal);
      setAuthTab('register');
      openModal(authModal);
    });
  }

  // ==========================================
  // 8. FLOATING CONSULTATION BUTTON & MODAL
  // ==========================================
  const btnConsultFloating = document.getElementById('btn-consult-floating');
  const consultModal = document.getElementById('consult-modal');
  const formConsult = document.getElementById('form-consult');
  const btnConsultSubmit = document.getElementById('btn-consult-submit');

  if (btnConsultFloating) {
    btnConsultFloating.addEventListener('click', function () {
      openModal(consultModal);
    });
  }

  document.querySelectorAll('.btn-open-consult').forEach(b => {
    b.addEventListener('click', function () {
      openModal(consultModal);
    });
  });

  if (formConsult) {
    formConsult.addEventListener('submit', async function (e) {
      e.preventDefault();
      const origText = btnConsultSubmit.innerText;
      btnConsultSubmit.disabled = true;
      btnConsultSubmit.innerText = 'Надсилаємо...';

      const formData = new FormData(formConsult);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          formConsult.innerHTML = `
            <div style="text-align:center; padding:20px 0;">
              <div style="font-size:44px; margin-bottom:10px;">✅</div>
              <h4 style="font-size:20px; font-weight:700; color:#092433; margin-bottom:6px;">Заявку успішно прийнято!</h4>
              <p style="color:rgba(9,36,51,0.7); font-size:13px; line-height:1.4;">
                Черговий хмарний інженер зв'яжеться з вами за вказаним номером протягом 15 хвилин.
              </p>
              <button type="button" class="modal-close-generic" onclick="document.getElementById('consult-modal').style.display='none'; document.body.style.overflow='';" style="margin-top:16px; background:#092433; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer;">
                Закрити
              </button>
            </div>
          `;
        } else {
          alert('Помилка під час відправки заявки. Будь ласка, зателефонуйте: +380 (44) 334-58-92');
          btnConsultSubmit.disabled = false;
          btnConsultSubmit.innerText = origText;
        }
      } catch (err) {
        alert('Помилка з\'єднання. Будь ласка, зателефонуйте: +380 (44) 334-58-92');
        btnConsultSubmit.disabled = false;
        btnConsultSubmit.innerText = origText;
      }
    });
  }

  // ==========================================
  // 9. CALL TO REGISTRATION FORMS ON PAGE
  // ==========================================
  document.querySelectorAll('.registration-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        const regEmailInput = document.getElementById('reg-email');
        if (regEmailInput) regEmailInput.value = input.value;
      }
      setAuthTab('register');
      openModal(authModal);
    });
  });
});
