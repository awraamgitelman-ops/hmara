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

    // Close on any modal close button or ESC
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('modal-close-generic') || e.target.closest('.modal-close-generic')) {
        document.querySelectorAll('#auth-modal, #panel-modal, #calc-modal, #consult-modal, #lead-modal').forEach(function (m) {
          m.style.display = 'none';
        });
      }
      var targetModal = e.target;
      if (targetModal && (targetModal.id === 'auth-modal' || targetModal.id === 'panel-modal' || targetModal.id === 'calc-modal' || targetModal.id === 'consult-modal' || targetModal.id === 'lead-modal')) {
        targetModal.style.display = 'none';
      }
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('#auth-modal, #panel-modal, #calc-modal, #consult-modal, #lead-modal').forEach(function (m) {
        m.style.display = 'none';
      });
      var dropdown = document.getElementById('user-dropdown-menu');
      if (dropdown) dropdown.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
  } else {
    initModals();
  }
}());
