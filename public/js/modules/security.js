// LIKEMARK — Security Scroll Module
// Responsibility: sticky scroll image switcher for security-data section

(function () {
  'use strict';

  function initSecurityScroll() {
    var secCards = [
      document.querySelector('.security-data-card--1'),
      document.querySelector('.security-data-card--2'),
      document.querySelector('.security-data-card--3')
    ];
    var secPics = [
      document.getElementById('sec-pic-0'),
      document.getElementById('sec-pic-1'),
      document.getElementById('sec-pic-2')
    ];

    if (!secPics[0] || !secCards[0]) return;

    function update() {
      var triggerY = window.innerHeight * 0.45;
      var activeIdx = 0;

      secCards.forEach(function (card, idx) {
        if (card && card.getBoundingClientRect().top <= triggerY) activeIdx = idx;
      });

      secPics.forEach(function (pic, idx) {
        if (!pic) return;
        var isActive = idx === activeIdx;
        pic.classList.toggle('visible', isActive);
        pic.style.opacity = isActive ? '1' : '0';
        pic.style.zIndex  = isActive ? '2' : '1';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', initSecurityScroll);
}());
