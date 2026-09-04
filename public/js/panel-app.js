// ==========================================================================
// LIKEMARK CLOUD — CONSOLE & CRM DEMO APPLICATION LOGIC
// Standalone Single Page Application with LocalStorage Persistence
// ==========================================================================

(function () {
  'use strict';

  // --- Seed Demo Data ---
  var defaultUser = {
    name: 'Сергій Мельник',
    company: 'ТОВ «ТЕХНО-СОФТ ЮКРЕЙН»',
    email: 'sergiy@technosoft.ua',
    edrpou: '41895620',
    id: '45356074'
  };

  var defaultServers = [
    {
      id: 'srv-1',
      name: 'vps-warsaw-1c-prod',
      ip: '185.156.42.18',
      region: 'Варшава (WAW-1 Tier III)',
      specs: '4 vCPU • 8 GB RAM DDR5 • 120 GB NVMe',
      cpu: 4,
      ram: 8,
      disk: 120,
      os: 'Ubuntu 24.04 LTS',
      status: 'active',
      price: 950
    },
    {
      id: 'srv-2',
      name: 'vps-frankfurt-dev',
      ip: '194.182.170.84',
      region: 'Франкфурт (FRA-1 Tier III+)',
      specs: '2 vCPU • 4 GB RAM DDR5 • 60 GB NVMe',
      cpu: 2,
      ram: 4,
      disk: 60,
      os: 'Debian 12 Bookworm',
      status: 'active',
      price: 540
    }
  ];

  var defaultDedicated = [
    {
      id: 'ded-1',
      name: 'dedicated-epyc-warsaw-db',
      ip: '185.156.40.10',
      model: 'AMD EPYC 9654 (96c / 192t)',
      ram: '256 GB DDR5 ECC Reg',
      disks: '2x 3.84 TB NVMe U.2 RAID-1',
      location: 'Варшава, Atman DC WAW-1',
      status: 'active',
      ipmi: 'https://ipmi-ded-1.likemark.cloud',
      temp: '38°C (Normal)',
      power: '210 W'
    }
  ];

  var defaultDatabases = [
    {
      id: 'db-1',
      name: 'pg-cluster-production',
      engine: 'PostgreSQL 16',
      mode: 'Primary + 1 Standby Replica',
      conn: 'postgresql://postgres:***@pg-cluster.likemark.internal:5432/corp_db',
      status: 'active',
      size: '34.8 GB / 100 GB'
    }
  ];

  var defaultBuckets = [
    {
      id: 'bkt-1',
      name: 'likemark-static-assets',
      endpoint: 'https://s3.waw.likemark.cloud/likemark-static-assets',
      objects: 1482,
      size: '18.4 GB',
      access: 'Public Read'
    },
    {
      id: 'bkt-2',
      name: 'db-backups-encrypted',
      endpoint: 'https://s3.fra.likemark.cloud/db-backups-encrypted',
      objects: 38,
      size: '142.6 GB',
      access: 'Private (AES-256)'
    }
  ];

  var defaultTickets = [
    {
      id: 'TK-8492',
      title: 'Міграція бази 1С з фізичного сервера',
      service: 'Виділені сервери',
      priority: 'Високий',
      status: 'Вирішено',
      date: '02.09.2026',
      messages: [
        { sender: 'user', name: 'Сергій Мельник', time: '10:14', text: 'Доброго дня! Потрібно допомогти налаштувати імпорт бекапу бази 1С на новий VPS.' },
        { sender: 'tech', name: 'Інженер чергової зміни (Олександр)', time: '10:28', text: 'Вітаю! Бекап імпортовано на vps-warsaw-1c-prod, перевірте підключення через RDP.' }
      ]
    },
    {
      id: 'TK-8510',
      title: 'Анонс власної автономної системи BGP AS212450',
      service: 'Мережі та BGP',
      priority: 'Середній',
      status: 'В обробці',
      date: '04.09.2026',
      messages: [
        { sender: 'user', name: 'Сергій Мельник', time: '14:05', text: 'Просимо підняти BGP-сесію для анонсу нашої підмережі /24.' },
        { sender: 'tech', name: 'Мережевий інженер (Дмитро)', time: '14:18', text: 'Сесію налаштовано на маршрутизаторі Juniper у Варшаві. Очікуємо підтвердження анонсу з вашого боку.' }
      ]
    }
  ];

  var defaultInvoices = [
    {
      number: 'INV-2026-0814',
      date: '01.08.2026',
      amount: '1 490.00 ₴',
      desc: 'Оренда обчислювальних ресурсів за серпень 2026',
      status: 'Оплачено'
    }
  ];

  var defaultActivity = [
    { time: '10 хвилин тому', text: 'Вхід у панель керування з IP 178.62.204.15 (Варшава, UA)' },
    { time: '2 години тому', text: 'Автоматичний знімок (Snapshot) створено для vps-warsaw-1c-prod' },
    { time: 'Вчора, 18:30', text: 'Списано погодинну абонплату за сервери: 2.07 ₴' }
  ];

  // --- State Accessors ---
  function getUser() {
    var raw = localStorage.getItem('likemark_user');
    if (raw) {
      try {
        var p = JSON.parse(raw);
        return {
          name: p.name || defaultUser.name,
          company: defaultUser.company,
          email: p.email || defaultUser.email,
          edrpou: defaultUser.edrpou,
          id: defaultUser.id
        };
      } catch (e) {}
    }
    return defaultUser;
  }

  function getServers() {
    var raw = localStorage.getItem('likemark_panel_servers');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    localStorage.setItem('likemark_panel_servers', JSON.stringify(defaultServers));
    return defaultServers;
  }

  function saveServers(servers) {
    localStorage.setItem('likemark_panel_servers', JSON.stringify(servers));
    renderServersTable();
    updateOverviewMetrics();
  }

  function getBalance() {
    var raw = localStorage.getItem('likemark_panel_balance');
    if (raw) return parseFloat(raw);
    localStorage.setItem('likemark_panel_balance', '1500.00');
    return 1500.00;
  }

  function setBalance(val) {
    localStorage.setItem('likemark_panel_balance', val.toFixed(2));
    updateBalanceDisplay();
  }

  function getTickets() {
    var raw = localStorage.getItem('likemark_panel_tickets');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    localStorage.setItem('likemark_panel_tickets', JSON.stringify(defaultTickets));
    return defaultTickets;
  }

  function saveTickets(tickets) {
    localStorage.setItem('likemark_panel_tickets', JSON.stringify(tickets));
    renderTickets();
  }

  function addActivity(text) {
    defaultActivity.unshift({ time: 'Тільки що', text: text });
    renderActivityLog();
  }

  // --- Toast Notification ---
  function showToast(msg) {
    var existing = document.getElementById('console-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'console-toast';
    toast.style.cssText = 'position:fixed; bottom:28px; right:28px; background:#092433; color:#fff; padding:14px 22px; border-radius:10px; font-size:14px; font-weight:600; box-shadow:0 10px 30px rgba(0,0,0,0.3); z-index:999999; display:flex; align-items:center; gap:10px; transition:transform 0.3s ease, opacity 0.3s ease; border:1px solid rgba(255,255,255,0.15);';
    toast.innerHTML = '<span style="color:#10b981; font-weight:bold;">OK</span> ' + msg;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  // --- Navigation & Routing ---
  function navigateTo(tabId) {
    if (!tabId) tabId = 'overview';
    var navItems = document.querySelectorAll('.console-nav-item');
    navItems.forEach(function (el) {
      if (el.getAttribute('data-tab') === tabId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    var views = document.querySelectorAll('.console-view');
    views.forEach(function (v) {
      if (v.id === 'view-' + tabId) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    window.location.hash = tabId;

    // Close mobile drawer if open
    var sidebar = document.getElementById('console-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  }

  // --- Renderers ---
  function updateBalanceDisplay() {
    var bal = getBalance();
    var str = bal.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₴';
    var el = document.getElementById('topbar-balance-val');
    if (el) el.textContent = str;
    var el2 = document.getElementById('billing-balance-val');
    if (el2) el2.textContent = str;
  }

  function updateOverviewMetrics() {
    var servers = getServers();
    var activeServers = servers.filter(function (s) { return s.status === 'active'; });
    var totalCores = 0;
    var totalRam = 0;
    var totalDisk = 0;
    var totalMonthly = 0;

    servers.forEach(function (s) {
      totalCores += (s.cpu || 2);
      totalRam += (s.ram || 4);
      totalDisk += (s.disk || 40);
      totalMonthly += (s.price || 500);
    });

    var elVms = document.getElementById('metric-vms-count');
    if (elVms) elVms.textContent = servers.length.toString();

    var elCores = document.getElementById('metric-cores-count');
    if (elCores) elCores.textContent = totalCores.toString() + ' vCPU';

    var elRam = document.getElementById('metric-ram-count');
    if (elRam) elRam.textContent = totalRam.toString() + ' GB';

    var elDisk = document.getElementById('metric-disk-count');
    if (elDisk) elDisk.textContent = totalDisk.toString() + ' GB NVMe';

    var elExpense = document.getElementById('metric-monthly-expense');
    if (elExpense) elExpense.textContent = totalMonthly.toLocaleString('uk-UA') + ' ₴/міс';

    // Update nav badge count
    var srvBadge = document.getElementById('nav-servers-count');
    if (srvBadge) srvBadge.textContent = servers.length.toString();
  }

  function renderServersTable() {
    var tbody = document.getElementById('servers-table-body');
    if (!tbody) return;
    var servers = getServers();

    if (servers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#64748b;">У вас немає активних серверів. Натисніть "+ Створити сервер" щоб розгорнути першу віртуальну машину.</td></tr>';
      return;
    }

    var html = '';
    servers.forEach(function (srv) {
      var statusClass = srv.status === 'active' ? 'active' : (srv.status === 'rebooting' ? 'rebooting' : 'stopped');
      var statusText = srv.status === 'active' ? 'В роботі' : (srv.status === 'rebooting' ? 'Перезапуск...' : 'Зупинено');

      html += '<tr data-server-id="' + srv.id + '">';
      html += '<td>';
      html += '  <div style="font-weight:700; color:#092433; font-size:14px;">' + srv.name + '</div>';
      html += '  <div style="font-size:12px; color:#64748b;">' + srv.os + '</div>';
      html += '</td>';
      html += '<td>';
      html += '  <div class="status-pill ' + statusClass + '">';
      html += '    <span class="status-dot"></span>';
      html += '    <span>' + statusText + '</span>';
      html += '  </div>';
      html += '</td>';
      html += '<td>';
      html += '  <span class="console-ip-cell">' + srv.ip;
      html += '    <button type="button" class="btn-copy-ip" data-copy="' + srv.ip + '" title="Скопіювати IP">';
      html += '      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
      html += '    </button>';
      html += '  </span>';
      html += '</td>';
      html += '<td style="font-size:13px; color:#475467;">' + srv.specs + '</td>';
      html += '<td style="font-size:13px; color:#475467;">' + srv.region + '</td>';
      html += '<td style="text-align:right;">';
      html += '  <div class="action-btn-group">';
      html += '    <button type="button" class="action-btn btn-vnc" data-action="vnc" data-id="' + srv.id + '" title="Відкрити Web VNC">';
      html += '      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
      html += '      Консоль';
      html += '    </button>';

      if (srv.status === 'active') {
        html += '    <button type="button" class="action-btn" data-action="reboot" data-id="' + srv.id + '" title="Перезавантажити">Перезапуск</button>';
        html += '    <button type="button" class="action-btn" data-action="stop" data-id="' + srv.id + '" title="Зупинити">Зупинити</button>';
      } else {
        html += '    <button type="button" class="action-btn" data-action="start" data-id="' + srv.id + '" title="Запустити" style="color:#059669; font-weight:700;">Запустити</button>';
      }

      html += '    <button type="button" class="btn-danger-outline" data-action="delete" data-id="' + srv.id + '" title="Видалити сервер">✕</button>';
      html += '  </div>';
      html += '</td>';
      html += '</tr>';
    });

    tbody.innerHTML = html;
  }

  function renderTickets() {
    var container = document.getElementById('tickets-list-container');
    if (!container) return;
    var tickets = getTickets();

    var html = '';
    tickets.forEach(function (t) {
      var badgeColor = t.status === 'Вирішено' ? '#059669' : '#d97706';
      var badgeBg = t.status === 'Вирішено' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)';

      html += '<div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:18px 24px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">';
      html += '  <div>';
      html += '    <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">';
      html += '      <span style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color:#1f93ff;">#' + t.id + '</span>';
      html += '      <span style="background:' + badgeBg + '; color:' + badgeColor + '; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px;">' + t.status + '</span>';
      html += '      <span style="font-size:12px; color:#64748b;">' + t.service + '</span>';
      html += '      <span style="font-size:12px; color:#94a3b8;">' + t.date + '</span>';
      html += '    </div>';
      html += '    <div style="font-weight:700; font-size:15px; color:#092433; margin-bottom:4px;">' + t.title + '</div>';
      var lastMsg = t.messages[t.messages.length - 1];
      html += '    <div style="font-size:13px; color:#475467;">' + lastMsg.sender + ': ' + lastMsg.text + '</div>';
      html += '  </div>';
      html += '  <div>';
      html += '    <button type="button" class="btn-secondary" data-ticket-id="' + t.id + '">Відкрити листування</button>';
      html += '  </div>';
      html += '</div>';
    });

    container.innerHTML = html;
  }

  function renderActivityLog() {
    var el = document.getElementById('overview-activity-list');
    if (!el) return;
    var html = '';
    defaultActivity.slice(0, 5).forEach(function (a) {
      html += '<div style="padding:10px 0; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; font-size:13px;">';
      html += '  <span style="color:#092433;">' + a.text + '</span>';
      html += '  <span style="color:#64748b; font-size:12px; white-space:nowrap; margin-left:16px;">' + a.time + '</span>';
      html += '</div>';
    });
    el.innerHTML = html;
  }

  // --- Modals Controller ---
  function openModal(modalId) {
    var m = document.getElementById(modalId);
    if (m) {
      m.style.display = 'flex';
      document.body.classList.add('panel-body-locked');
    }
  }

  function closeModal(modalId) {
    var m = document.getElementById(modalId);
    if (m) {
      m.style.display = 'none';
      document.body.classList.remove('panel-body-locked');
    }
  }

  // --- VNC Console Simulator ---
  function launchVNC(serverId) {
    var servers = getServers();
    var srv = servers.find(function (s) { return s.id === serverId; }) || servers[0];
    var titleEl = document.getElementById('vnc-server-title');
    if (titleEl) titleEl.textContent = 'Web VNC Console — ' + srv.name + ' (' + srv.ip + ')';

    var bodyEl = document.getElementById('vnc-terminal-body');
    if (bodyEl) {
      bodyEl.innerHTML = [
        '<div class="term-line">Likemark Cloud Virtual Machine Hypervisor v4.2</div>',
        '<div class="term-line">Booting Linux kernel 6.8.0-45-generic on x86_64...</div>',
        '<div class="term-line"><span class="term-green">[ OK ]</span> Started System Logging Service.</div>',
        '<div class="term-line"><span class="term-green">[ OK ]</span> Reached target Network (IPv4/IPv6 BGP dual-stack).</div>',
        '<div class="term-line"><span class="term-green">[ OK ]</span> Started OpenSSH server daemon (port 22).</div>',
        '<div class="term-line"><span class="term-green">[ OK ]</span> Mounted Enterprise NVMe volume /dev/vda1 on /</div>',
        '<div class="term-line">Ubuntu 24.04.1 LTS ' + srv.name + ' ttyS0</div>',
        '<div class="term-line" style="margin-top:10px;"><span class="term-prompt">root@' + srv.name + ':~#</span> uname -a</div>',
        '<div class="term-line">Linux ' + srv.name + ' 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</div>',
        '<div class="term-line"><span class="term-prompt">root@' + srv.name + ':~#</span> free -h</div>',
        '<div class="term-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shared&nbsp;&nbsp;buff/cache&nbsp;&nbsp;available</div>',
        '<div class="term-line">Mem:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + srv.ram + '.0Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.2Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (srv.ram - 2) + '.1Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12Mi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;700Mi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + (srv.ram - 1.5) + 'Gi</div>',
        '<div class="term-line"><span class="term-prompt">root@' + srv.name + ':~#</span> <span style="display:inline-block; width:8px; height:15px; background:#58a6ff; vertical-align:middle; animation:pulse 1s infinite;"></span></div>'
      ].join('');
    }
    openModal('modal-vnc-console');
  }

  // --- Event Listeners Initialization ---
  function initEvents() {
    // Nav Click
    document.querySelectorAll('.console-nav-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var tabId = this.getAttribute('data-tab');
        navigateTo(tabId);
      });
    });

    // Mobile Hamburger
    var mobileBtn = document.getElementById('console-mobile-toggle');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', function () {
        var sidebar = document.getElementById('console-sidebar');
        if (sidebar) sidebar.classList.toggle('mobile-open');
      });
    }

    // Modal close triggers
    document.querySelectorAll('.modal-close, [data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = this.closest('.modal-overlay');
        if (modal) closeModal(modal.id);
      });
    });

    // Server Table Actions (Delegation)
    var tableBody = document.getElementById('servers-table-body');
    if (tableBody) {
      tableBody.addEventListener('click', function (e) {
        var copyBtn = e.target.closest('.btn-copy-ip');
        if (copyBtn) {
          var ip = copyBtn.getAttribute('data-copy');
          navigator.clipboard.writeText(ip);
          showToast('IP-адресу ' + ip + ' скопійовано');
          return;
        }

        var btn = e.target.closest('button[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');
        var servers = getServers();
        var srv = servers.find(function (s) { return s.id === id; });
        if (!srv) return;

        if (action === 'vnc') {
          launchVNC(id);
        } else if (action === 'reboot') {
          srv.status = 'rebooting';
          saveServers(servers);
          showToast('Сервер ' + srv.name + ' перезавантажується...');
          addActivity('Перезавантаження сервера ' + srv.name);
          setTimeout(function () {
            srv.status = 'active';
            saveServers(servers);
            showToast('Сервер ' + srv.name + ' успішно перезавантажено');
          }, 2000);
        } else if (action === 'stop') {
          srv.status = 'stopped';
          saveServers(servers);
          showToast('Сервер ' + srv.name + ' зупинено');
          addActivity('Зупинка сервера ' + srv.name);
        } else if (action === 'start') {
          srv.status = 'active';
          saveServers(servers);
          showToast('Сервер ' + srv.name + ' запущено');
          addActivity('Запуск сервера ' + srv.name);
        } else if (action === 'delete') {
          if (confirm('Ви дійсно бажаєте видалити віртуальний сервер ' + srv.name + '? Усі дані на NVMe буде видалено безповоротно.')) {
            servers = servers.filter(function (s) { return s.id !== id; });
            saveServers(servers);
            showToast('Сервер ' + srv.name + ' видалено');
            addActivity('Видалення сервера ' + srv.name);
          }
        }
      });
    }

    // Modal: Create Server Wizard
    var openCreateBtn = document.getElementById('btn-open-create-server');
    if (openCreateBtn) {
      openCreateBtn.addEventListener('click', function () {
        openModal('modal-create-server');
      });
    }

    var formCreate = document.getElementById('form-create-server');
    if (formCreate) {
      formCreate.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('new-srv-name').value.trim() || 'vps-custom-' + Math.floor(Math.random() * 900 + 100);
        var os = document.getElementById('new-srv-os').value;
        var region = document.getElementById('new-srv-region').value;
        var cpu = parseInt(document.getElementById('new-srv-cpu').value, 10);
        var ram = parseInt(document.getElementById('new-srv-ram').value, 10);
        var disk = parseInt(document.getElementById('new-srv-disk').value, 10);

        // Calculate price
        var price = Math.round(cpu * 120 + ram * 45 + disk * 3);

        var randomIp = '185.156.' + Math.floor(Math.random() * 20 + 40) + '.' + Math.floor(Math.random() * 200 + 20);

        var newServer = {
          id: 'srv-' + Date.now(),
          name: name,
          ip: randomIp,
          region: region,
          specs: cpu + ' vCPU • ' + ram + ' GB RAM DDR5 • ' + disk + ' GB NVMe',
          cpu: cpu,
          ram: ram,
          disk: disk,
          os: os,
          status: 'active',
          price: price
        };

        var servers = getServers();
        servers.unshift(newServer);
        saveServers(servers);
        closeModal('modal-create-server');
        showToast('Сервер ' + name + ' успішно створено та запущено!');
        addActivity('Створено новий хмарний сервер ' + name + ' (' + newServer.specs + ')');
        navigateTo('servers');
      });
    }

    // Modal: Topup Balance
    var openTopupBtns = document.querySelectorAll('.btn-open-topup');
    openTopupBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal('modal-topup-balance');
      });
    });

    var formTopup = document.getElementById('form-topup-balance');
    if (formTopup) {
      formTopup.addEventListener('submit', function (e) {
        e.preventDefault();
        var amount = parseFloat(document.getElementById('topup-amount').value) || 1000;
        var current = getBalance();
        setBalance(current + amount);
        closeModal('modal-topup-balance');
        showToast('Баланс успішно поповнено на ' + amount.toLocaleString('uk-UA') + ' ₴');
        addActivity('Поповнення балансу рахунку на ' + amount.toLocaleString('uk-UA') + ' ₴');
      });
    }

    // Modal: New Ticket
    var openTicketBtn = document.getElementById('btn-open-new-ticket');
    if (openTicketBtn) {
      openTicketBtn.addEventListener('click', function () {
        openModal('modal-new-ticket');
      });
    }

    var formTicket = document.getElementById('form-new-ticket');
    if (formTicket) {
      formTicket.addEventListener('submit', function (e) {
        e.preventDefault();
        var title = document.getElementById('ticket-subject').value.trim();
        var service = document.getElementById('ticket-service').value;
        var priority = document.getElementById('ticket-priority').value;
        var msg = document.getElementById('ticket-message').value.trim();

        var tickets = getTickets();
        var newId = 'TK-' + Math.floor(Math.random() * 9000 + 1000);
        var user = getUser();

        var newT = {
          id: newId,
          title: title,
          service: service,
          priority: priority,
          status: 'В обробці',
          date: 'Сьогодні',
          messages: [
            { sender: 'user', name: user.name, time: 'Зараз', text: msg }
          ]
        };

        tickets.unshift(newT);
        saveTickets(tickets);
        closeModal('modal-new-ticket');
        showToast('Тикет #' + newId + ' створено. Черговий інженер зв'яжеться з вами за 15 хв.');
        addActivity('Створено тикет #' + newId + ': ' + title);

        // Simulate instant engineer automated acknowledgment
        setTimeout(function () {
          newT.messages.push({
            sender: 'tech',
            name: 'Черговий інженер 24/7 (Максим)',
            time: 'Тільки що',
            text: 'Добрий день! Звернення зареєстровано в системі SLA. Перевіряю логи інфраструктури.'
          });
          saveTickets(tickets);
          showToast('Отримано відповідь чергового інженера за тикетом #' + newId);
        }, 3500);
      });
    }

    // Hashchange listener
    window.addEventListener('hashchange', function () {
      var hash = window.location.hash.replace('#', '');
      if (hash) navigateTo(hash);
    });

    // Invoice Print Preview
    var btnPrintInvoice = document.getElementById('btn-print-invoice');
    if (btnPrintInvoice) {
      btnPrintInvoice.addEventListener('click', function () {
        window.print();
      });
    }

    // Download Kubeconfig
    var btnDlKube = document.getElementById('btn-download-kubeconfig');
    if (btnDlKube) {
      btnDlKube.addEventListener('click', function () {
        var config = [
          'apiVersion: v1',
          'clusters:',
          '- cluster:',
          '    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCg==',
          '    server: https://k8s.waw-1.likemark.cloud:6443',
          '  name: likemark-k8s-prod',
          'contexts:',
          '- context:',
          '    cluster: likemark-k8s-prod',
          '    user: cluster-admin',
          '  name: likemark-k8s-prod-admin',
          'current-context: likemark-k8s-prod-admin',
          'kind: Config',
          'preferences: {}',
          'users:',
          '- name: cluster-admin',
          '  user:',
          '    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCg==',
          '    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQo='
        ].join('\n');

        var blob = new Blob([config], { type: 'text/yaml' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'kubeconfig-likemark-prod.yaml';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Kubeconfig файл успішно завантажено');
      });
    }
  }

  // --- Initial Setup ---
  function init() {
    var user = getUser();
    var nameEls = document.querySelectorAll('.user-display-name');
    nameEls.forEach(function (el) { el.textContent = user.name; });

    var avatarEls = document.querySelectorAll('.user-display-avatar');
    avatarEls.forEach(function (el) { el.textContent = user.name.charAt(0).toUpperCase(); });

    var emailEls = document.querySelectorAll('.user-display-email');
    emailEls.forEach(function (el) { el.textContent = user.email; });

    var idEls = document.querySelectorAll('.user-display-id');
    idEls.forEach(function (el) { el.textContent = '#' + user.id; });

    updateBalanceDisplay();
    updateOverviewMetrics();
    renderServersTable();
    renderTickets();
    renderActivityLog();

    initEvents();

    var initialTab = window.location.hash.replace('#', '') || 'overview';
    navigateTo(initialTab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
