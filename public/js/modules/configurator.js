// LIKEMARK — Configurator Module (servers.html)
// Responsibility: tariff tabs toggle + custom server price configurator + lead-modal

(function () {
  'use strict';

  // --- Tabs: Presets vs Custom ---
  function initTabs() {
    var tabBtns     = document.querySelectorAll('.tab-btn');
    var presetsGrid = document.getElementById('tariffs-presets');
    var calcBox     = document.getElementById('tariffs-custom');

    if (!tabBtns.length || !presetsGrid || !calcBox) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        if (btn.dataset.tab === 'presets') {
          presetsGrid.style.display = 'grid';
          calcBox.classList.remove('active');
        } else {
          presetsGrid.style.display = 'none';
          calcBox.classList.add('active');
        }
      });
    });
  }

  // --- Custom server configurator ---
  function initConfigurator() {
    var cpuSlider    = document.getElementById('range-cpu');
    var ramSlider    = document.getElementById('range-ram');
    var diskSlider   = document.getElementById('range-disk');
    var osSelect     = document.getElementById('select-os');
    var backupCheck  = document.getElementById('check-backup');
    var cpuVal       = document.getElementById('val-cpu');
    var ramVal       = document.getElementById('val-ram');
    var diskVal      = document.getElementById('val-disk');
    var sumCpu       = document.getElementById('sum-cpu');
    var sumRam       = document.getElementById('sum-ram');
    var sumDisk      = document.getElementById('sum-disk');
    var sumOs        = document.getElementById('sum-os');
    var sumBackup    = document.getElementById('sum-backup');
    var sumTotal     = document.getElementById('sum-total');
    var sumUsd       = document.getElementById('sum-usd');

    if (!cpuSlider || !ramSlider || !diskSlider) return;

    function calculate() {
      var cpu       = parseInt(cpuSlider.value, 10);
      var ram       = parseInt(ramSlider.value, 10);
      var disk      = parseInt(diskSlider.value, 10);
      var os        = osSelect    ? osSelect.value    : 'linux';
      var hasBackup = backupCheck ? backupCheck.checked : false;

      // Rates: CPU 150 ₴/vCPU, RAM 90 ₴/GB, NVMe 3.5 ₴/GB, base 150 ₴
      var price = 150 + (cpu * 150) + (ram * 90) + (disk * 3.5);
      var osCost = 0;
      if (os === 'windows') { osCost = Math.max(350, cpu * 90); price += osCost; }
      var backupCost = 0;
      if (hasBackup) { backupCost = Math.round(price * 0.15); price += backupCost; }
      price = Math.round(price);

      if (cpuVal)  cpuVal.textContent  = cpu  + ' vCPU';
      if (ramVal)  ramVal.textContent  = ram  + ' GB';
      if (diskVal) diskVal.textContent = disk + ' GB NVMe';
      if (sumCpu)  sumCpu.textContent  = cpu  + ' \u044F\u0434\u0435\u0440';
      if (sumRam)  sumRam.textContent  = ram  + ' GB RAM';
      if (sumDisk) sumDisk.textContent = disk + ' GB NVMe';
      if (sumOs)   sumOs.textContent   = os === 'windows' ? 'Windows Server (+\u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044F)' : 'Linux (Ubuntu/Debian)';
      if (sumBackup) sumBackup.textContent = hasBackup ? '\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E (\u0449\u043E\u0434\u043D\u044F)' : '\u041D\u0456';
      if (sumTotal)  sumTotal.textContent = price.toLocaleString('uk-UA') + ' \u20B4/\u043C\u0456\u0441';
      if (sumUsd)    sumUsd.textContent   = '~ $' + Math.round(price / 41.5) + ' / \u043C\u0456\u0441\u044F\u0446\u044C (SLA 99.98%)';

      var orderBtn = document.getElementById('btn-order-custom');
      if (orderBtn) {
        orderBtn.dataset.tariff = '\u041A\u0430\u0441\u0442\u043E\u043C\u043D\u0438\u0439: ' + cpu + ' vCPU / ' + ram + 'GB RAM / ' + disk + 'GB NVMe / ' + os + ' / \u0411\u0435\u043A\u0430\u043F: ' + (hasBackup ? '\u0422\u0430\u043A' : '\u041D\u0456') + ' (' + price + ' \u0433\u0440\u043D/\u043C\u0456\u0441)';
      }
    }

    cpuSlider.addEventListener('input',   calculate);
    ramSlider.addEventListener('input',   calculate);
    diskSlider.addEventListener('input',  calculate);
    if (osSelect)    osSelect.addEventListener('change',    calculate);
    if (backupCheck) backupCheck.addEventListener('change', calculate);
    calculate();
  }

  // --- Lead modal (for tariff order buttons) ---
  function initLeadModal() {
    var modal        = document.getElementById('lead-modal');
    var closeBtn     = document.getElementById('modal-close-btn');
    var tariffInput  = document.getElementById('modal-tariff-input');
    var modalDesc    = document.getElementById('modal-desc');

    if (!modal) return;

    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var tariff = btn.dataset.tariff || '\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0430 \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0456\u044F \u0442\u0430 \u043F\u0456\u0434\u0431\u0456\u0440 \u0445\u043C\u0430\u0440\u0438';
        if (tariffInput) tariffInput.value = tariff;
        if (modalDesc) modalDesc.innerHTML = '\u041E\u0431\u0440\u0430\u043D\u0430 \u043F\u043E\u0441\u043B\u0443\u0433\u0430: <strong style="color:#00e599;">' + tariff + '</strong>. \u0417\u0430\u043B\u0438\u0448\u0442\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0438, \u0456 \u0447\u0435\u0440\u0433\u043E\u0432\u0438\u0439 \u0456\u043D\u0436\u0435\u043D\u0435\u0440 \u043F\u0456\u0434\u0433\u043E\u0442\u0443\u0454 \u0434\u043B\u044F \u0432\u0430\u0441 \u0434\u043E\u0441\u0442\u0443\u043F.';
        modal.classList.add('active');
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', function () { modal.classList.remove('active'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('active'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) modal.classList.remove('active');
    });
  }

  // --- FAQ accordion ---
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-question');
      if (!q) return;
      q.addEventListener('click', function () {
        var isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('active'); });
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // --- Lead form AJAX ---
  function initLeadForm() {
    document.querySelectorAll('.ajax-lead-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn  = form.querySelector('button[type="submit"]');
        var originalHtml = submitBtn ? submitBtn.innerHTML : '';

        var data = Object.fromEntries(new FormData(form).entries());
        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '\u041D\u0430\u0434\u0441\u0438\u043B\u0430\u0454\u043C\u043E \u0437\u0430\u044F\u0432\u043A\u0443\u2026'; }

        fetch('/api/lead', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(data)
        }).then(function (res) { return res.json(); }).then(function (result) {
          if (result.success) {
            form.innerHTML = '<div style="text-align:center;padding:24px 10px"><div style="width:56px;height:56px;border-radius:50%;background:rgba(0,229,153,0.15);color:#00e599;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></div><h3 style="font-size:1.35rem;color:#fff;margin-bottom:8px">\u0417\u0430\u044F\u0432\u043A\u0443 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u043F\u0440\u0438\u0439\u043D\u044F\u0442\u043E!</h3><p style="color:#94a3b8;font-size:0.92rem;line-height:1.6">' + result.message + '</p></div>';
          } else {
            alert(result.error || '\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u0456.');
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalHtml; }
          }
        }).catch(function () {
          alert('\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0432\u2019\u044F\u0437\u043A\u0443 \u0456\u0437 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437.');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalHtml; }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initConfigurator();
    initLeadModal();
    initFaq();
    initLeadForm();
  });
}());
