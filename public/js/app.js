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
      modalEl.classList.remove('hidden');
      modalEl.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalEl) {
    if (modalEl) {
      modalEl.classList.add('hidden');
      modalEl.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.modal-close-generic').forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = btn.closest('#auth-modal') || btn.closest('#panel-modal') || btn.closest('#consult-modal');
      closeModal(modal);
    });
  });

  ['auth-modal', 'panel-modal', 'consult-modal'].forEach(id => {
    const m = document.getElementById(id);
    if (m) {
      m.addEventListener('click', function (e) {
        if (e.target === m) closeModal(m);
      });
    }
  });

  // ==========================================
  // 5. ACCOUNT SYSTEM (LOGIN / REGISTRATION)
  // ==========================================
  const authModal = document.getElementById('auth-modal');
  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  const guestHeader = document.getElementById('header-auth-guest');
  const userHeader = document.getElementById('header-auth-user');
  const userNameDisplay = document.getElementById('user-name-display');
  const userDropdown = document.getElementById('user-dropdown-menu');
  const panelModal = document.getElementById('panel-modal');

  function setAuthTab(tab) {
    if (tab === 'login') {
      if (tabLogin) {
        tabLogin.classList.remove('text-gray-400', 'border-transparent');
        tabLogin.classList.add('text-brand-navy', 'border-brand-navy');
      }
      if (tabRegister) {
        tabRegister.classList.remove('text-brand-navy', 'border-brand-navy');
        tabRegister.classList.add('text-gray-400', 'border-transparent');
      }
      if (formLogin) { formLogin.classList.remove('hidden'); formLogin.style.display = 'flex'; }
      if (formRegister) { formRegister.classList.add('hidden'); formRegister.style.display = 'none'; }
    } else {
      if (tabRegister) {
        tabRegister.classList.remove('text-gray-400', 'border-transparent');
        tabRegister.classList.add('text-brand-navy', 'border-brand-navy');
      }
      if (tabLogin) {
        tabLogin.classList.remove('text-brand-navy', 'border-brand-navy');
        tabLogin.classList.add('text-gray-400', 'border-transparent');
      }
      if (formRegister) { formRegister.classList.remove('hidden'); formRegister.style.display = 'flex'; }
      if (formLogin) { formLogin.classList.add('hidden'); formLogin.style.display = 'none'; }
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => setAuthTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => setAuthTab('register'));

  function syncAuthState() {
    const rawUser = localStorage.getItem('likemark_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (guestHeader) { guestHeader.classList.add('hidden'); guestHeader.style.display = 'none'; }
      if (userHeader) { userHeader.classList.remove('hidden'); userHeader.style.display = 'flex'; }
      if (userNameDisplay) userNameDisplay.innerText = user.name || 'Кабінет';
    } else {
      if (guestHeader) { guestHeader.classList.remove('hidden'); guestHeader.style.display = 'flex'; }
      if (userHeader) { userHeader.classList.add('hidden'); userHeader.style.display = 'none'; }
    }
  }
  syncAuthState();

  if (userHeader) {
    userHeader.addEventListener('click', function () {
      if (userDropdown) {
        userDropdown.classList.toggle('hidden');
      }
    });
  }

  const menuLogout = document.getElementById('menu-logout');
  if (menuLogout) {
    menuLogout.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('likemark_user');
      if (userDropdown) userDropdown.classList.add('hidden');
      syncAuthState();
    });
  }

  const menuOpenPanel = document.getElementById('menu-open-panel');
  if (menuOpenPanel) {
    menuOpenPanel.addEventListener('click', function (e) {
      e.preventDefault();
      if (userDropdown) userDropdown.classList.add('hidden');
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
  // 6. HERO BUTTONS
  // ==========================================
  const heroBtnPanel = document.getElementById('hero-btn-panel');
  const heroBtnCalc = document.getElementById('hero-btn-calc');
  const heroBtnAi = document.getElementById('hero-btn-ai');

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
      const calcSection = document.getElementById('calc');
      if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
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
      const calcSection = document.getElementById('calc');
      if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
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
      setAuthTab('register');
      openModal(authModal);
    });
  }

  // ==========================================
  // 8. CONSULTATION MODAL & FLOATING BUTTON
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
            <div class="text-center py-6">
              <div class="text-5xl mb-3">✅</div>
              <h4 class="text-xl font-extrabold text-brand-navy mb-2">Заявку прийнято!</h4>
              <p class="text-gray-600 text-xs leading-relaxed">Черговий хмарний інженер зателефонує вам протягом 15 хвилин.</p>
              <button type="button" class="modal-close-generic mt-5 px-5 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs cursor-pointer">Закрити</button>
            </div>
          `;
        } else {
          alert('Помилка під час відправки заявки. Зателефонуйте: +380 (44) 334-58-92');
          btnConsultSubmit.disabled = false;
          btnConsultSubmit.innerText = origText;
        }
      } catch (err) {
        alert('Помилка з\'єднання. Зателефонуйте: +380 (44) 334-58-92');
        btnConsultSubmit.disabled = false;
        btnConsultSubmit.innerText = origText;
      }
    });
  }

  // ==========================================
  // 9. MAIN LEAD FORM ON PAGE
  // ==========================================
  const formLeadMain = document.getElementById('form-lead-main');
  if (formLeadMain) {
    formLeadMain.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = formLeadMain.querySelector('button[type="submit"]');
      const origText = btn.innerText;
      btn.disabled = true;
      btn.innerText = 'Надсилаємо заявку...';

      const formData = new FormData(formLeadMain);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          formLeadMain.innerHTML = `
            <div class="text-center py-8">
              <div class="text-5xl mb-3">🎉</div>
              <h3 class="text-2xl font-extrabold text-brand-navy mb-2">Дякуємо! Вашу заявку успішно надіслано</h3>
              <p class="text-gray-600 text-sm max-w-md mx-auto">Черговий інженер LIKEMARK CLOUD зв'яжеться з вами за 15 хвилин для надання доступу до тестового сервера.</p>
            </div>
          `;
        } else {
          alert('Помилка під час відправки. Зателефонуйте нам: +380 (44) 334-58-92');
          btn.disabled = false;
          btn.innerText = origText;
        }
      } catch (err) {
        alert('Помилка під час відправки. Зателефонуйте нам: +380 (44) 334-58-92');
        btn.disabled = false;
        btn.innerText = origText;
      }
    });
  }
});
