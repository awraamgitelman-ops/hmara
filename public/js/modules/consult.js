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
      if (target.closest('.btn-header-cta, .mobile-drawer-btn-cta, .modal-trigger-consult, a[href="#consult"]')) {
        e.preventDefault();
        openConsult();
      }
    });

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
