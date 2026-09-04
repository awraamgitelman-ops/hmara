// LIKEMARK — Article Module
// Responsibility: lead modal, form submit, smooth ToC scroll (for cases/*.html)

(function () {
  'use strict';

  // --- Lead modal ---
  function initLeadModal() {
    var modal         = document.getElementById('lead-modal');
    var closeBtn      = document.getElementById('modal-close-btn');
    var tariffInput   = document.getElementById('modal-tariff-input');
    var modalTitle    = document.querySelector('.modal-title');

    function openModal(tariffName) {
      if (!modal) return;
      if (tariffInput)  tariffInput.value = tariffName;
      if (modalTitle) {
        modalTitle.textContent = tariffName.indexOf('\u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u044F') === 0
          ? tariffName : '\u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u044F: ' + tariffName;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn.getAttribute('data-tariff') || '\u041A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u044F \u0437 \u0456\u043D\u0436\u0435\u043D\u0435\u0440\u043E\u043C LIKEMARK');
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    }
  }

  // --- Lead form submit ---
  function initLeadForm() {
    var form = document.querySelector('.ajax-lead-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn    = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '\u0412\u0456\u0434\u043F\u0440\u0430\u0432\u043A\u0430 \u0437\u0430\u043F\u0438\u0442\u0443\u2026'; }

      setTimeout(function () {
        form.innerHTML = [
          '<div style="text-align:center;padding:24px 0">',
          '<div style="width:52px;height:52px;background:rgba(10,180,118,0.12);color:#0ab476;border-radius:50%;',
          'display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px">\u2713</div>',
          '<h4 style="font-size:19px;font-weight:800;color:#092433;margin-bottom:8px">\u0414\u044F\u043A\u0443\u0454\u043C\u043E \u0437\u0430 \u0437\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F!</h4>',
          '<p style="font-size:14px;color:#475569;line-height:1.5">\u0427\u0435\u0440\u0433\u043E\u0432\u0438\u0439 \u0430\u0440\u0445\u0456\u0442\u0435\u043A\u0442\u043E\u0440 LIKEMARK \u0437\u0432\u2019\u044F\u0436\u0435\u0442\u044C\u0441\u044F \u0437 \u0432\u0430\u043C\u0438 \u0437\u0430 \u0432\u043A\u0430\u0437\u0430\u043D\u0438\u043C \u043D\u043E\u043C\u0435\u0440\u043E\u043C \u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C 15 \u0445\u0432\u0438\u043B\u0438\u043D.</p>',
          '</div>'
        ].join('');
        var modal = document.getElementById('lead-modal');
        setTimeout(function () {
          if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
        }, 3500);
      }, 600);
    });
  }

  // --- Table of Contents smooth scroll ---
  function initTocScroll() {
    document.querySelectorAll('.article-toc-list a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(a.getAttribute('href').substring(1));
        if (!target) return;
        window.scrollTo({
          top:      target.getBoundingClientRect().top + window.pageYOffset - 90,
          behavior: 'smooth'
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLeadModal();
    initLeadForm();
    initTocScroll();
  });
}());
