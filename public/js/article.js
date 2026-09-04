// LIKEMARK CLOUD — Article & Case Studies Controller
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

  // 2. Consultation Modal Logic
  const modal = document.getElementById('lead-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTariffInput = document.getElementById('modal-tariff-input');
  const modalTitle = document.querySelector('.modal-title');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');

  function openModal(tariffName = 'Консультація спеціаліста LIKEMARK') {
    if (modal) {
      if (modalTariffInput) modalTariffInput.value = tariffName;
      if (modalTitle && tariffName) {
        modalTitle.textContent = tariffName.startsWith('Консультація') ? tariffName : `Консультація: ${tariffName}`;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const tariff = this.getAttribute('data-tariff') || 'Консультація з інженером LIKEMARK';
      openModal(tariff);
      closeDrawer();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // 3. Form Submission Handling
  const leadForm = document.querySelector('.ajax-lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Відправка запиту...';

      // Simulate instantaneous processing / backend call
      setTimeout(() => {
        leadForm.innerHTML = `
          <div style="text-align:center; padding: 24px 0;">
            <div style="width: 52px; height: 52px; background: rgba(10, 180, 118, 0.12); color: #0ab476; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">✓</div>
            <h4 style="font-size: 19px; font-weight: 800; color: #092433; margin-bottom: 8px;">Дякуємо за звернення!</h4>
            <p style="font-size: 14px; color: #475569; line-height: 1.5;">Черговий архітектор LIKEMARK зв'яжеться з вами за вказаним номером протягом 15 хвилин.</p>
          </div>
        `;
        setTimeout(() => {
          closeModal();
        }, 3500);
      }, 600);
    });
  }

  // 4. Smooth scroll for Table of Contents
  document.querySelectorAll('.article-toc-list a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
