const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Anti-Fingerprinting
app.disable('x-powered-by');
app.disable('etag');

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('Server', 'webserver');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (req.path.startsWith('/css/') || req.path.startsWith('/js/')) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }
  next();
});

// Favicon & SEO assets delivery
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (
    p.startsWith('/favicon') ||
    p.startsWith('/apple-touch-icon') ||
    p === '/robots.txt' ||
    p === '/sitemap.xml'
  ) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Protect system files from probes
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (
    p.startsWith('/.') ||
    p.includes('/.git') ||
    p.includes('package') ||
    p.includes('server.js') ||
    p.endsWith('.env') ||
    p.endsWith('.json')
  ) {
    return res.status(404).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 301 Redirect old .html paths to clean URLs
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const cleanPath = req.path.slice(0, -5);
    const query = req.url.slice(req.path.length);
    if (cleanPath === '/index') {
      return res.redirect(301, '/' + query);
    }
    return res.redirect(301, cleanPath + query);
  }
  next();
});

// Serve local static files first (CSS, JS, Fonts, local images)
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Reverse proxy fallback for any missing images or Nuxt image optimizer assets
app.use(['/_ipx', '/images'], (req, res) => {
  const targetUrl = 'https://selectel.ru' + req.originalUrl;
  https.get(targetUrl, { rejectUnauthorized: false }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', () => {
    res.status(404).end();
  });
});

// Healthcheck for Railway
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Clean URLs routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/servers', (req, res) => res.sendFile(path.join(__dirname, 'public', 'servers.html')));
app.get('/migration', (req, res) => res.sendFile(path.join(__dirname, 'public', 'migration.html')));
app.get('/contacts', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contacts.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, 'public', 'privacy.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(__dirname, 'public', 'terms.html')));

// Helper to broadcast lead to Telegram if configured
function sendTelegramNotification(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Promise.resolve();

  const payload = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      resolve();
    });
    req.on('error', (e) => resolve());
    req.write(payload);
    req.end();
  });
}

// Lead & Order processing endpoint
app.post(['/api/lead', '/api/order'], async (req, res) => {
  try {
    const raw = req.body || {};
    const name = (raw.name || raw.fullName || 'Клієнт').trim();
    const phone = (raw.phone || raw.tel || '').trim();
    const email = (raw.email || '').trim();
    const tariff = (raw.tariff || raw.plan || raw.config || 'Індивідуальна конфігурація').trim();
    const comment = (raw.comment || raw.notes || raw.message || '').trim();
    const source = (raw.source || 'Головна сторінка LIKEMARK CLOUD').trim();
    const dateStr = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });

    if (!phone && !email) {
      return res.status(400).json({ success: false, error: 'Вкажіть номер телефону або Email для зв\'язку' });
    }

    console.log('=== [НОВА ЗАЯВКА НА ХМАРНІ СЕРВЕРИ] ===');
    console.log('Клієнт:', name);
    console.log('Телефон:', phone);
    console.log('Email:', email || 'не вказано');
    console.log('Тариф/Конфігурація:', tariff);
    console.log('Коментар:', comment || '-');
    console.log('Джерело:', source);
    console.log('Час (Київ):', dateStr);
    console.log('=======================================');

    const tgMessage = `🚀 <b>НОВА ЗАЯВКА LIKEMARK CLOUD</b>\n\n` +
      `👤 <b>Клієнт:</b> ${name}\n` +
      `📞 <b>Телефон:</b> ${phone}\n` +
      `✉️ <b>Email:</b> ${email || 'не вказано'}\n` +
      `⚙️ <b>Тариф:</b> ${tariff}\n` +
      `💬 <b>Коментар:</b> ${comment || '-'}\n` +
      `📍 <b>Джерело:</b> ${source}\n` +
      `⏰ <b>Час:</b> ${dateStr}`;

    await sendTelegramNotification(tgMessage);

    res.json({
      success: true,
      message: 'Дякуємо! Вашу заявку успішно прийнято. Черговий інженер зв\'яжеться з вами протягом 15 хвилин для надання доступу або консультації.'
    });
  } catch (err) {
    console.error('Error processing lead:', err.message);
    res.status(500).json({ success: false, error: 'Помилка обробки заявки' });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[LIKEMARK CLOUD] Server running on port ${PORT}`);
});




