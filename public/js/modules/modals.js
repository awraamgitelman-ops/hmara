// LIKEMARK — Modals Module
// Responsibility: generic modal close (X button, outside click, ESC key) for all modals

(function () {
  'use strict';

  function initModals() {
    var modals = [
      document.getElementById('auth-modal'),
      document.getElementById('panel-modal'),
      document.getElementById('calc-modal'),
      document.getElementById('consult-modal')
    ].filter(Boolean);

    // Generic close buttons
    document.querySelectorAll('.modal-close-generic').forEach(function (btn) {
      btn.addEventListener('click', function () {
        modals.forEach(function (m) { m.style.display = 'none'; });
      });
    });

    // Outside click
    modals.forEach(function (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.style.display = 'none';
      });
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      modals.forEach(function (m) { m.style.display = 'none'; });
      var dropdown = document.getElementById('user-dropdown-menu');
      if (dropdown) dropdown.style.display = 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', initModals);
}());
