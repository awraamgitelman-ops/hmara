// LIKEMARK — Consult Module
// Responsibility: consultation modal (floating button + form submit + API call)

(function () {
  'use strict';

  function initConsult() {
    var consultModal = document.getElementById('consult-modal') || document.getElementById('consultModal');
    var btnFloating  = document.getElementById('btn-consult-floating');
    var formConsult  = document.getElementById('form-consult');

    function openConsult() {
      if (consultModal) {
        consultModal.style.display = 'flex';
      }
    }

    function closeConsult() {
      if (consultModal) {
        consultModal.style.display = 'none';
      }
    }

    window.openConsultModal = openConsult;
    window.closeConsultModal = closeConsult;

    if (btnFloating && consultModal) {
      btnFloating.addEventListener('click', function () {
        openConsult();
      });
    }

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (target.closest('.btn-header-cta, .mobile-drawer-btn-cta, .modal-trigger-consult, a[href="#consult"], #btn-consult-floating, .floating-consult-btn')) {
        e.preventDefault();
        openConsult();
      }
      var upBtn = target.closest('#btn-scroll-up, .floating-up-btn, .up-button');
      if (upBtn) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    function checkScroll() {
      var scrollBtns = document.querySelectorAll('#btn-scroll-up, .floating-up-btn, .up-button');
      var isScrolled = window.scrollY > 250;
      scrollBtns.forEach(function (btn) {
        if (isScrolled) {
          btn.classList.add('visible');
          btn.style.opacity = '1';
          btn.style.visibility = 'visible';
          btn.style.pointerEvents = 'auto';
          btn.style.transform = 'translateY(0)';
        } else {
          btn.classList.remove('visible');
          btn.style.opacity = '0';
          btn.style.visibility = 'hidden';
          btn.style.pointerEvents = 'none';
          btn.style.transform = 'translateY(12px)';
        }
      });
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    if (formConsult) {
      formConsult.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = document.getElementById('btn-consult-submit') || formConsult.querySelector('button[type="submit"]');

        if (submitBtn) {
          submitBtn.disabled    = true;
          submitBtn.textContent = 'Надсилаємо заявку…';
        }

        var formData = new FormData(formConsult);
        var payload = {
          name:    formData.get('name'),
          phone:   formData.get('phone'),
          comment: formData.get('comment'),
          source:  'Форма онлайн-консультації LIKEMARK CLOUD'
        };

        fetch('/api/lead', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        }).catch(function (err) {
          console.warn('Lead submission fallback:', err);
        }).finally(function () {
          if (submitBtn) {
            submitBtn.style.background = '#0ab476';
            submitBtn.textContent = 'Заявку прийнято! Інженер зателефонує вам';
          }
          setTimeout(function () {
            closeConsult();
            formConsult.reset();
            if (submitBtn) {
              submitBtn.disabled     = false;
              submitBtn.style.background = '#eb4247';
              submitBtn.textContent  = 'Замовити консультацію';
            }
          }, 2500);
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsult);
  } else {
    initConsult();
  }
})();
