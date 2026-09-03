/**
 * LIKEMARK CLOUD — Interactive Scripts & Configurator
 * ТОВ "ЛАЙКМАРК ЮКРЕЙН" (код ЄДРПОУ 45356074)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initConfigurator();
  initModals();
  initFaq();
  initMobileMenu();
  initFormSubmit();
});

/* ==========================================================================
   TABS: PRESETS VS CUSTOM CALCULATOR
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tariffsGrid = document.getElementById('tariffs-presets');
  const calcBox = document.getElementById('tariffs-custom');

  if (!tabBtns.length || !tariffsGrid || !calcBox) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.tab;
      if (target === 'presets') {
        tariffsGrid.style.display = 'grid';
        calcBox.classList.remove('active');
      } else {
        tariffsGrid.style.display = 'none';
        calcBox.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   CONFIGURATOR SLIDER LOGIC
   ========================================================================== */
function initConfigurator() {
  const cpuSlider = document.getElementById('range-cpu');
  const ramSlider = document.getElementById('range-ram');
  const diskSlider = document.getElementById('range-disk');
  const osSelect = document.getElementById('select-os');
  const backupCheck = document.getElementById('check-backup');

  const cpuVal = document.getElementById('val-cpu');
  const ramVal = document.getElementById('val-ram');
  const diskVal = document.getElementById('val-disk');

  const sumCpu = document.getElementById('sum-cpu');
  const sumRam = document.getElementById('sum-ram');
  const sumDisk = document.getElementById('sum-disk');
  const sumOs = document.getElementById('sum-os');
  const sumBackup = document.getElementById('sum-backup');
  const sumTotal = document.getElementById('sum-total');
  const sumUsd = document.getElementById('sum-usd');

  if (!cpuSlider || !ramSlider || !diskSlider) return;

  function calculate() {
    const cpu = parseInt(cpuSlider.value, 10);
    const ram = parseInt(ramSlider.value, 10);
    const disk = parseInt(diskSlider.value, 10);
    const os = osSelect ? osSelect.value : 'linux';
    const hasBackup = backupCheck ? backupCheck.checked : false;

    // Rates in UAH
    // CPU: ~150 UAH per vCPU
    // RAM: ~90 UAH per GB
    // NVMe: ~3 UAH per GB
    // Base IPv4 & Port: ~150 UAH
    let price = 150 + (cpu * 150) + (ram * 90) + (disk * 3.5);

    // Windows license supplement
    let osCost = 0;
    if (os === 'windows') {
      osCost = Math.max(350, cpu * 90);
      price += osCost;
    }

    // Backup fee ~15%
    let backupCost = 0;
    if (hasBackup) {
      backupCost = Math.round(price * 0.15);
      price += backupCost;
    }

    price = Math.round(price);
    const usd = Math.round(price / 41.5);

    // Update displays
    cpuVal.textContent = `${cpu} vCPU`;
    ramVal.textContent = `${ram} GB`;
    diskVal.textContent = `${disk} GB NVMe`;

    sumCpu.textContent = `${cpu} ядер`;
    sumRam.textContent = `${ram} GB RAM`;
    sumDisk.textContent = `${disk} GB NVMe`;
    sumOs.textContent = os === 'windows' ? 'Windows Server (+ліцензія)' : 'Linux (Ubuntu/Debian)';
    sumBackup.textContent = hasBackup ? 'Увімкнено (щодня)' : 'Ні';

    sumTotal.textContent = `${price.toLocaleString('uk-UA')} ₴/міс`;
    sumUsd.textContent = `~ $${usd} / місяць (SLA 99.98%)`;

    // Store config on custom order button
    const customOrderBtn = document.getElementById('btn-order-custom');
    if (customOrderBtn) {
      customOrderBtn.dataset.tariff = `Кастомний: ${cpu} vCPU / ${ram}GB RAM / ${disk}GB NVMe / ${os} / Бекап: ${hasBackup ? 'Так' : 'Ні'} (${price} грн/міс)`;
    }
  }

  cpuSlider.addEventListener('input', calculate);
  ramSlider.addEventListener('input', calculate);
  diskSlider.addEventListener('input', calculate);
  if (osSelect) osSelect.addEventListener('change', calculate);
  if (backupCheck) backupCheck.addEventListener('change', calculate);

  calculate();
}

/* ==========================================================================
   MODAL WINDOW LOGIC
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('lead-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const tariffInput = document.getElementById('modal-tariff-input');
  const modalDesc = document.getElementById('modal-desc');

  if (!modal) return;

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tariff = btn.dataset.tariff || 'Безкоштовна консультація та підбір хмари';
      if (tariffInput) tariffInput.value = tariff;
      if (modalDesc) modalDesc.innerHTML = `Обрана послуга: <strong style="color:#00e599;">${tariff}</strong>. Залиште контакти, і черговий інженер підготує для вас доступ.`;
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('burger-btn');
  const nav = document.getElementById('nav-links');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    if (isOpen) {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '76px';
      nav.style.left = '0';
      nav.style.width = '100%';
      nav.style.background = '#080c14';
      nav.style.padding = '24px 20px';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      nav.style.gap = '18px';
    }
  });
}

/* ==========================================================================
   LEAD FORM SUBMISSION (AJAX)
   ========================================================================== */
function initFormSubmit() {
  const forms = document.querySelectorAll('.ajax-lead-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Надіслати';
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Надсилаємо заявку...';
      }

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          form.innerHTML = `
            <div style="text-align:center; padding: 24px 10px;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(0,229,153,0.15); color: #00e599; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 style="font-size: 1.35rem; color:#fff; margin-bottom: 8px;">Заявку успішно прийнято!</h3>
              <p style="color:#94a3b8; font-size: 0.92rem; line-height: 1.6;">${result.message}</p>
            </div>
          `;
        } else {
          alert(result.error || 'Помилка при надсиланні. Будь ласка, перевірте номер телефону.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      } catch (err) {
        alert('Помилка зв\'язку із сервером. Спробуйте ще раз або зателефонуйте нам.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  });
}
