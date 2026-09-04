// LIKEMARK Cloud — app.js (orchestrator)
// All logic has been moved to focused modules in js/modules/
// This file kept for backward compatibility; modules are loaded separately via <script> tags.
// Loaded on: index.html, servers.html, migration.html

(function () {
  'use strict';
  if (typeof console !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      console.log('LIKEMARK Cloud initialized (modular).');
    });
  }
}());
