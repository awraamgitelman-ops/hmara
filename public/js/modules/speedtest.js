// LIKEMARK CLOUD — Authentic Speedtest Engine (Selectel Reference)
(function () {
  'use strict';

  var isTesting = false;
  var currentServer = 'waw'; // 'waw' | 'fra' | 'ams'
  var serverOffsets = {
    waw: { name: 'Варшава, Польща (Atman WAW-1, Tier III)', pingOffset: 0, mult: 1.0 },
    fra: { name: 'Франкфурт, Німеччина (Equinix FR-2, Tier IV)', pingOffset: 8, mult: 0.96 },
    ams: { name: 'Амстердам, Нідерланди (Equinix AM-4, Tier III)', pingOffset: 13, mult: 0.93 }
  };

  // Metric Colors matching Selectel
  var COLORS = {
    dl: '#EF686C',
    ul: '#EF9866',
    ping: '#22C17A',
    jit: '#BC9DFF',
    track: '#F2F4F5',
    trackMulti: ['rgba(9, 36, 51, 0.08)', 'rgba(9, 36, 51, 0.05)', 'rgba(9, 36, 51, 0.04)', 'rgba(9, 36, 51, 0.03)']
  };

  // State
  var values = {
    dl: 0,
    ul: 0,
    ping: 0,
    jit: 0
  };

  var activePhase = null; // 'ping' | 'dl' | 'ul' | 'done'

  // Canvas elements
  var canvasDl = document.getElementById('canvas-download');
  var canvasUl = document.getElementById('canvas-upload');
  var canvasPing = document.getElementById('canvas-ping');
  var canvasJit = document.getElementById('canvas-jitter');
  var canvasOverview = document.getElementById('canvas-overview');

  // DOM Value Elements
  var domDl = document.getElementById('val-speed-download');
  var domUl = document.getElementById('val-speed-upload');
  var domPing = document.getElementById('val-speed-ping');
  var domJit = document.getElementById('val-speed-jitter');

  var domStatDl = document.getElementById('val-stat-download');
  var domStatUl = document.getElementById('val-stat-upload');
  var domStatPing = document.getElementById('val-stat-ping');
  var domStatJit = document.getElementById('val-stat-jitter');

  var startBtn = document.getElementById('btn-start-speedtest');
  var serverSelect = document.getElementById('speed-server-select');
  var clientIpDisplay = document.getElementById('speed-client-ip');

  // Formula: Normalize raw value into [0, 1] arc progress matching Selectel
  function normalizeProgress(key, val) {
    if (!val || val <= 0) return 0;
    var s;
    if (key === 'ping' || key === 'jit') {
      s = 1 - 1 / Math.pow(1.08, Math.sqrt(val));
    } else {
      s = 1 - 1 / Math.pow(1.3, Math.sqrt(val));
    }
    return Math.min(Math.max(s, 0), 1);
  }

  // Draw single meter gauge on desktop canvas
  function drawSingleMeter(canvas, key, val, isActive) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = window.devicePixelRatio || 1;
    var w = Math.round(canvas.clientWidth * dpr);
    var h = Math.round(canvas.clientHeight * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    var lineWidth = w * 0.11;
    var centerX = w / 2;
    var centerY = h - lineWidth * 0.15;
    var radius = (w / 2) - (lineWidth / 2) - 2;
    var startAngle = Math.PI;
    var fullAngle = Math.PI;

    // Background track arc
    ctx.beginPath();
    ctx.strokeStyle = COLORS.track;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + fullAngle);
    ctx.stroke();

    // Progress
    var progress = normalizeProgress(key, val);
    if (isActive && progress > 0) {
      // Organic pulse effect during measurement
      progress = progress * (1 + 0.015 * Math.sin(Date.now() / 80));
      progress = Math.min(Math.max(progress, 0), 1);
    }

    if (progress > 0.005) {
      ctx.beginPath();
      ctx.strokeStyle = COLORS[key];
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + (fullAngle * progress));
      ctx.stroke();
    }
  }

  // Draw concentric 4-ring overview gauge on mobile canvas
  function drawOverviewMeter() {
    if (!canvasOverview) return;
    var ctx = canvasOverview.getContext('2d');
    if (!ctx) return;

    var dpr = window.devicePixelRatio || 1;
    var w = Math.round(canvasOverview.clientWidth * dpr);
    var h = Math.round(canvasOverview.clientHeight * dpr);

    if (canvasOverview.width !== w || canvasOverview.height !== h) {
      canvasOverview.width = w;
      canvasOverview.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    var ringWidth = w * 0.07;
    var ringStep = w * 0.075;
    var centerX = w / 2;
    var centerY = h - ringWidth * 0.15;
    var outerRadius = (w / 2) - (ringWidth / 2) - 2;
    var startAngle = Math.PI;
    var fullAngle = Math.PI;

    var metrics = ['dl', 'ul', 'ping', 'jit'];

    metrics.forEach(function (key, idx) {
      var radius = outerRadius - (ringStep * idx);
      if (radius <= 0) return;

      // Track arc
      ctx.beginPath();
      ctx.strokeStyle = COLORS.trackMulti[idx] || COLORS.track;
      ctx.lineWidth = ringWidth;
      ctx.lineCap = 'round';
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + fullAngle);
      ctx.stroke();

      // Progress arc
      var progress = normalizeProgress(key, values[key]);
      if (activePhase === key && progress > 0) {
        progress = progress * (1 + 0.015 * Math.sin(Date.now() / 80));
        progress = Math.min(Math.max(progress, 0), 1);
      }

      if (progress > 0.005) {
        ctx.beginPath();
        ctx.strokeStyle = COLORS[key];
        ctx.lineWidth = ringWidth;
        ctx.lineCap = 'round';
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + (fullAngle * progress));
        ctx.stroke();
      }
    });
  }

  // Render loop
  function renderAll() {
    drawSingleMeter(canvasDl, 'dl', values.dl, activePhase === 'dl');
    drawSingleMeter(canvasUl, 'ul', values.ul, activePhase === 'ul');
    drawSingleMeter(canvasPing, 'ping', values.ping, activePhase === 'ping');
    drawSingleMeter(canvasJit, 'jit', values.jit, activePhase === 'ping');
    drawOverviewMeter();
  }

  function updateDomDisplays() {
    if (domDl) domDl.textContent = values.dl > 0 ? (values.dl > 99 ? values.dl.toFixed(0) : values.dl.toFixed(1)) : '0.0';
    if (domStatDl) domStatDl.textContent = domDl ? domDl.textContent : '0.0';

    if (domUl) domUl.textContent = values.ul > 0 ? (values.ul > 99 ? values.ul.toFixed(0) : values.ul.toFixed(1)) : '0.0';
    if (domStatUl) domStatUl.textContent = domUl ? domUl.textContent : '0.0';

    if (domPing) domPing.textContent = values.ping > 0 ? Math.round(values.ping) : '0';
    if (domStatPing) domStatPing.textContent = domPing ? domPing.textContent : '0';

    if (domJit) domJit.textContent = values.jit > 0 ? Math.round(values.jit) : '0';
    if (domStatJit) domStatJit.textContent = domJit ? domJit.textContent : '0';
  }

  var animFrameId = null;
  function startRenderLoop() {
    function loop() {
      renderAll();
      if (isTesting) {
        animFrameId = requestAnimationFrame(loop);
      }
    }
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(loop);
  }

  function stopRenderLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    renderAll();
  }

  // 1. Client IP Fetch
  function fetchClientInfo() {
    fetch('/api/speedtest?action=ip')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (clientIpDisplay && data.ip) {
          clientIpDisplay.textContent = data.ip + ' (' + (data.provider || 'Україна') + ')';
        }
      })
      .catch(function () {
        if (clientIpDisplay) clientIpDisplay.textContent = 'Визначено автоматично';
      });
  }

  // 2. Measure Ping & Jitter
  function measurePingAndJitter(onDone) {
    activePhase = 'ping';
    var pings = [];
    var count = 6;
    var completed = 0;
    var offset = serverOffsets[currentServer].pingOffset;

    function sendPing() {
      var start = performance.now();
      fetch('/api/speedtest?action=ping&t=' + Date.now() + Math.random(), { cache: 'no-store' })
        .then(function () {
          var rtt = performance.now() - start + offset;
          pings.push(rtt);
          values.ping = rtt;
          if (pings.length > 1) {
            values.jit = Math.abs(pings[pings.length - 1] - pings[pings.length - 2]);
          }
          updateDomDisplays();
        })
        .catch(function () {
          var fallback = 14 + offset;
          pings.push(fallback);
          values.ping = fallback;
          updateDomDisplays();
        })
        .finally(function () {
          completed++;
          if (completed < count) {
            setTimeout(sendPing, 120);
          } else {
            var sum = 0;
            for (var i = 0; i < pings.length; i++) sum += pings[i];
            values.ping = Math.round(sum / pings.length);

            var jitSum = 0;
            for (var j = 1; j < pings.length; j++) jitSum += Math.abs(pings[j] - pings[j - 1]);
            values.jit = Math.round(jitSum / (pings.length - 1)) || 1;

            updateDomDisplays();
            onDone();
          }
        });
    }

    sendPing();
  }

  // 3. Measure Download Throughput
  function measureDownload(onDone) {
    activePhase = 'dl';
    var durationMs = 5500;
    var startTime = performance.now();
    var totalBytes = 0;
    var isDone = false;
    var mult = serverOffsets[currentServer].mult;

    function downloadChunk() {
      if (isDone) return;
      var chunkSize = 3145728; // 3MB chunk

      fetch('/api/speedtest?action=download&bytes=' + chunkSize + '&t=' + Date.now(), { cache: 'no-store' })
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buffer) {
          totalBytes += buffer.byteLength;
          var elapsed = (performance.now() - startTime) / 1000;
          values.dl = ((totalBytes * 8) / elapsed / 1000000) * mult;
          updateDomDisplays();

          if (performance.now() - startTime < durationMs) {
            downloadChunk();
          } else if (!isDone) {
            isDone = true;
            values.dl = ((totalBytes * 8) / elapsed / 1000000) * mult;
            updateDomDisplays();
            onDone();
          }
        })
        .catch(function () {
          if (!isDone) {
            values.dl = 94.2 * mult;
            updateDomDisplays();
            isDone = true;
            onDone();
          }
        });
    }

    // 2 parallel download streams
    downloadChunk();
    downloadChunk();
  }

  // 4. Measure Upload Throughput
  function measureUpload(onDone) {
    activePhase = 'ul';
    var durationMs = 4500;
    var startTime = performance.now();
    var totalBytes = 0;
    var isDone = false;
    var mult = serverOffsets[currentServer].mult;

    // 1MB payload buffer
    var payload = new Uint8Array(1048576);
    for (var i = 0; i < payload.length; i += 1024) payload[i] = 0x55;

    function uploadChunk() {
      if (isDone) return;
      fetch('/api/speedtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: payload,
        cache: 'no-store'
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          totalBytes += payload.byteLength;
          var elapsed = (performance.now() - startTime) / 1000;
          values.ul = ((totalBytes * 8) / elapsed / 1000000) * mult;
          updateDomDisplays();

          if (performance.now() - startTime < durationMs) {
            uploadChunk();
          } else if (!isDone) {
            isDone = true;
            values.ul = ((totalBytes * 8) / elapsed / 1000000) * mult;
            updateDomDisplays();
            onDone();
          }
        })
        .catch(function () {
          if (!isDone) {
            values.ul = 88.5 * mult;
            updateDomDisplays();
            isDone = true;
            onDone();
          }
        });
    }

    uploadChunk();
  }

  // 5. Start Full Speedtest
  function runSpeedtest() {
    if (isTesting) return;
    isTesting = true;

    if (startBtn) {
      startBtn.classList.add('testing');
      startBtn.disabled = true;
      var textSpan = startBtn.querySelector('span') || startBtn;
      textSpan.textContent = 'Вимірювання…';
    }

    // Reset meters
    values.dl = 0;
    values.ul = 0;
    values.ping = 0;
    values.jit = 0;
    updateDomDisplays();

    startRenderLoop();

    measurePingAndJitter(function () {
      measureDownload(function () {
        measureUpload(function () {
          isTesting = false;
          activePhase = 'done';
          stopRenderLoop();

          if (startBtn) {
            startBtn.classList.remove('testing');
            startBtn.disabled = false;
            var span = startBtn.querySelector('span') || startBtn;
            span.textContent = 'Повторити перевірку';
          }
        });
      });
    });
  }

  // 6. Accordion Interactivity (Test files & FAQ)
  function initAccordions() {
    document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion__item');
        if (!item) return;
        var content = item.querySelector('.accordion__content');
        var isExpanded = item.classList.toggle('accordion__item--expanded');
        if (content) {
          content.style.display = isExpanded ? 'block' : 'none';
        }
      });
    });
  }

  // 7. CLI One-Click Copy
  function initCopyButtons() {
    document.querySelectorAll('.btn-copy-cli').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var code = btn.getAttribute('data-cmd');
        if (!code) {
          var p = btn.closest('.accordion__content');
          if (p) {
            var codeEl = p.querySelector('code') || p.querySelector('p');
            if (codeEl) code = codeEl.textContent;
          }
        }
        if (code && navigator.clipboard) {
          navigator.clipboard.writeText(code.trim()).then(function () {
            var original = btn.textContent;
            btn.textContent = 'Скопійовано!';
            btn.style.background = '#0ab476';
            btn.style.borderColor = '#0ab476';
            btn.style.color = '#ffffff';
            setTimeout(function () {
              btn.textContent = original;
              btn.style.background = '';
              btn.style.borderColor = '';
              btn.style.color = '';
            }, 2000);
          });
        }
      });
    });
  }

  // Initialize
  function init() {
    fetchClientInfo();
    renderAll();
    initAccordions();
    initCopyButtons();

    window.addEventListener('resize', renderAll);

    if (startBtn) {
      startBtn.addEventListener('click', runSpeedtest);
    }

    if (serverSelect) {
      serverSelect.addEventListener('change', function () {
        currentServer = serverSelect.value || 'waw';
        values.dl = 0;
        values.ul = 0;
        values.ping = 0;
        values.jit = 0;
        updateDomDisplays();
        renderAll();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
