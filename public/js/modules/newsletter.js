// LIKEMARK — Newsletter Subscription Module
// Responsibility: Open newsletter modal on subscribe button click, validate email, send to /api/lead, show confirmation

(function () {
  'use strict';

  function initNewsletter() {
    var modal = document.getElementById('newsletter-modal');
    var form = document.getElementById('form-newsletter');
    var emailInput = document.getElementById('newsletter-email-input');
    var submitBtn = document.getElementById('btn-newsletter-submit');
    var successMsg = document.getElementById('newsletter-success-msg');

    function openModal() {
      if (!modal) return;
      modal.style.display = 'flex';
      if (emailInput) {
        setTimeout(function () {
          emailInput.focus();
        }, 150);
      }
    }

    function closeModal() {
      if (modal) {
        modal.style.display = 'none';
      }
    }

    // Expose globally
    window.openNewsletterModal = openModal;
    window.closeNewsletterModal = closeModal;

    // Attach click listeners to all subscribe buttons
    document.addEventListener('click', function (e) {
      var target = e.target;
      if (
        target.classList.contains('footer-info__block-subscribe-btn') ||
        target.closest('.footer-info__block-subscribe-btn') ||
        (target.getAttribute && target.getAttribute('data-open-modal') === 'newsletter-modal') ||
        (target.closest && target.closest('[data-open-modal="newsletter-modal"]'))
      ) {
        e.preventDefault();
        openModal();
      }
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (emailInput && emailInput.value || '').trim();
        if (!email) return;

        var originalBtnText = submitBtn ? submitBtn.textContent : 'Підписатися';
        var originalBtnBg = submitBtn ? submitBtn.style.background : '#1f93ff';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Підписуємо...';
          submitBtn.style.opacity = '0.85';
        }

        var payload = {
          email: email,
          name: 'Підписник розсилки',
          source: 'Підписка на розсилку новин LIKEMARK CLOUD',
          comment: 'Авторозсилка новин, порад з безпеки та знижок'
        };

        fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .catch(function (err) {
          console.warn('Newsletter submission error:', err);
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.style.background = '#10b981';
            submitBtn.style.color = '#fff';
            submitBtn.style.opacity = '1';
            submitBtn.textContent = 'Ви успішно підписалися!';
          }
          if (successMsg) {
            successMsg.style.display = 'block';
          }

          setTimeout(function () {
            closeModal();
            form.reset();
            if (successMsg) {
              successMsg.style.display = 'none';
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.style.background = originalBtnBg;
              submitBtn.textContent = originalBtnText;
            }
          }, 2500);
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletter);
  } else {
    initNewsletter();
  }
})();
