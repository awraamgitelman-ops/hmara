document.addEventListener('DOMContentLoaded', function () {
  // 1. Swiper track scroll support
  const swiperTrack = document.querySelector('.swiper-cards__track');
  const btnPrev = document.querySelector('.swiper-button-prev');
  const btnNext = document.querySelector('.swiper-button-next');

  if (swiperTrack) {
    swiperTrack.style.overflowX = 'auto';
    swiperTrack.style.scrollBehavior = 'smooth';
    swiperTrack.style.scrollbarWidth = 'none';

    if (btnNext) {
      btnNext.addEventListener('click', function (e) {
        e.preventDefault();
        swiperTrack.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', function (e) {
        e.preventDefault();
        swiperTrack.scrollBy({ left: -380, behavior: 'smooth' });
      });
    }
  }

  // 2. Scroll to top button
  const upBtn = document.querySelector('.up-button');
  if (upBtn) {
    upBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Modal Manager
  const modal = document.getElementById('custom-lead-modal');
  const closeBtn = document.getElementById('close-lead-modal');
  const tariffInput = document.getElementById('lead-tariff-input');
  const form = document.getElementById('lead-submit-form');
  const submitBtn = document.getElementById('lead-submit-btn');

  function openModal(title) {
    if (tariffInput && title) tariffInput.value = title;
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  // Intercept CTA and consultation buttons
  document.querySelectorAll('a, button').forEach(el => {
    const text = (el.innerText || '').trim();
    const href = el.getAttribute('href') || '';

    if (
      text.includes('Рассчитать стоимость') ||
      text.includes('Розрахувати вартість') ||
      text.includes('Перейти в панель') ||
      text.includes('Тест 7 днів') ||
      text.includes('Создать аккаунт') ||
      text.includes('Створити акаунт') ||
      text.includes('В платформу') ||
      text.includes('Замовити міграцію') ||
      text.includes('Консультация') ||
      text.includes('Консультація') ||
      href.includes('registration')
    ) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(text || 'Заявка на консультацію');
      });
    }
  });

  // AJAX submission to /api/lead
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const origText = submitBtn.innerText;
      submitBtn.disabled = true;
      submitBtn.innerText = 'Надсилаємо...';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          form.innerHTML = `
            <div style="text-align:center; padding:24px 0;">
              <div style="font-size:48px; margin-bottom:12px;">✅</div>
              <h4 style="font-size:22px; font-weight:700; color:#092433; margin-bottom:8px;">Дякуємо! Заявку прийнято</h4>
              <p style="color:rgba(9,36,51,0.7); font-size:14px; line-height:1.5;">
                Черговий інженер зв'яжеться з вами протягом 15 хвилин для надання тестового доступу.
              </p>
              <button type="button" onclick="document.getElementById('custom-lead-modal').style.display='none'; document.body.style.overflow='';" style="margin-top:20px; background:#092433; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:700; cursor:pointer;">
                Закрити
              </button>
            </div>
          `;
        } else {
          alert('Помилка надсилання заявки. Будь ласка, зателефонуйте: +380 (44) 334-58-92');
          submitBtn.disabled = false;
          submitBtn.innerText = origText;
        }
      } catch (err) {
        alert('Помилка з\'єднання. Будь ласка, зателефонуйте нам: +380 (44) 334-58-92');
        submitBtn.disabled = false;
        submitBtn.innerText = origText;
      }
    });
  }
});
