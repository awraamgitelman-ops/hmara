// LIKEMARK — Calculator Module
// Responsibility: cloud configurator modal (hero), slider inputs, dynamic pricing

(function () {
  'use strict';

  function initCalculator() {
    var calcModal      = document.getElementById('calc-modal');
    var heroBtnCalc    = document.getElementById('hero-btn-calc');
    var cpuRange       = document.getElementById('calc-cpu-range');
    var ramRange       = document.getElementById('calc-ram-range');
    var diskRange      = document.getElementById('calc-disk-range');
    var osSelect       = document.getElementById('calc-os-select');
    var cpuVal         = document.getElementById('calc-cpu-val');
    var ramVal         = document.getElementById('calc-ram-val');
    var diskVal        = document.getElementById('calc-disk-val');
    var totalPrice     = document.getElementById('calc-total-price');
    var orderBtn       = document.getElementById('calc-order-btn');
    var consultModal   = document.getElementById('consult-modal');

    function openCalcModal() {
      if (calcModal) calcModal.style.display = 'flex';
    }

    function recalculate() {
      if (!cpuRange || !ramRange || !diskRange) return;
      var cpu    = parseInt(cpuRange.value)  || 4;
      var ram    = parseInt(ramRange.value)  || 8;
      var disk   = parseInt(diskRange.value) || 120;
      var osPrice = parseInt(osSelect ? osSelect.value : 0) || 0;

      var coreWord = cpu === 1 ? 'ядро' : (cpu < 5 ? 'ядра' : 'ядер');
      if (cpuVal)  cpuVal.textContent  = cpu  + ' ' + coreWord;
      if (ramVal)  ramVal.textContent  = ram  + ' GB';
      if (diskVal) diskVal.textContent = disk + ' GB';

      // Rates: CPU 180 ₴/core, RAM 75 ₴/GB, NVMe 2.5 ₴/GB
      var total = Math.round((cpu * 180) + (ram * 75) + (disk * 2.5) + osPrice);
      if (totalPrice) totalPrice.textContent = total.toLocaleString('uk-UA') + ' \u20B4 / \u043C\u0456\u0441';
    }

    if (heroBtnCalc) {
      heroBtnCalc.addEventListener('click', function (e) { e.preventDefault(); openCalcModal(); });
    }

    document.querySelectorAll('a[href="#calc"]').forEach(function (link) {
      link.addEventListener('click', function (e) { e.preventDefault(); openCalcModal(); });
    });

    if (cpuRange)  cpuRange.addEventListener('input',  recalculate);
    if (ramRange)  ramRange.addEventListener('input',  recalculate);
    if (diskRange) diskRange.addEventListener('input',  recalculate);
    if (osSelect)  osSelect.addEventListener('change', recalculate);

    if (orderBtn) {
      orderBtn.addEventListener('click', function () {
        if (calcModal)   calcModal.style.display   = 'none';
        if (consultModal) {
          consultModal.style.display = 'flex';
          var comment = consultModal.querySelector('textarea[name="comment"]');
          if (comment) {
            comment.value = '\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0441\u0435\u0440\u0432\u0435\u0440\u0430: '
              + (cpuVal  ? cpuVal.textContent  : '')  + ', '
              + (ramVal  ? ramVal.textContent  : '')  + ', '
              + (diskVal ? diskVal.textContent : '') + ' NVMe. '
              + '\u0412\u0430\u0440\u0442\u0456\u0441\u0442\u044C: ' + (totalPrice ? totalPrice.textContent : '');
          }
        }
      });
    }

    recalculate();
  }

  document.addEventListener('DOMContentLoaded', initCalculator);
}());
