// LIKEMARK — Consult Module
// Responsibility: consultation modal (floating button + form submit + API call)

(function () {
  'use strict';

  function initConsult() {
    var consultModal     = document.getElementById('consult-modal');
    var btnFloating      = document.getElementById('btn-consult-floating');
    var formConsult      = document.getElementById('form-consult');

    if (btnFloating && consultModal) {
      btnFloating.addEventListener('click', function () {
        consultModal.style.display = 'flex';
      });
    }

    if (formConsult) {
      formConsult.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = document.getElementById('btn-consult-submit');

        if (submitBtn) {
          submitBtn.disabled     = true;
          submitBtn.textContent  = '\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u0454\u043C\u043E \u0437\u0430\u044F\u0432\u043A\u0443\u2026';
        }

        var formData = new FormData(formConsult);
        var payload  = {
          name:    formData.get('name'),
          phone:   formData.get('phone'),
          comment: formData.get('comment'),
          source:  '\u0424\u043E\u0440\u043C\u0430 \u043E\u043D\u043B\u0430\u0439\u043D-\u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u0457 LIKEMARK CLOUD'
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
            submitBtn.textContent = '\u2713 \u0417\u0430\u044F\u0432\u043A\u0443 \u043F\u0440\u0438\u0439\u043D\u044F\u0442\u043E! \u0406\u043D\u0436\u0435\u043D\u0435\u0440 \u0437\u0430\u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0443\u0454 \u0432\u0430\u043C';
          }
          setTimeout(function () {
            if (consultModal) consultModal.style.display = 'none';
            formConsult.reset();
            if (submitBtn) {
              submitBtn.disabled     = false;
              submitBtn.style.background = '#eb4247';
              submitBtn.textContent  = '\u0417\u0430\u043C\u043E\u0432\u0438\u0442\u0438 \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u044E';
            }
          }, 2500);
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initConsult);
}());
