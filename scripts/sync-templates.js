/**
 * scripts/sync-templates.js
 *
 * Синхронізація еталонних шаблонів (templates/site-header.html, site-footer.html, site-modals.html)
 * в усі продакшн-сторінки public/*.html.
 *
 * Використання:
 *   node scripts/sync-templates.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// 1. Завантаження еталонних шаблонів
const headerTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'site-header.html'), 'utf8').trim();
const footerTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'site-footer.html'), 'utf8').trim();
const modalsTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'site-modals.html'), 'utf8').trim();

// 2. Рекурсивний пошук усіх .html файлів у public/
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(PUBLIC_DIR);
console.log(`Знайдено ${htmlFiles.length} HTML-сторінок для синхронізації...`);

let updatedCount = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(ROOT_DIR, filePath);
  // Пропускаємо panel.html (це окрема SPA панель керування)
  if (relPath.endsWith('panel.html')) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // А. Синхронізація <header class="site-header">
  const headerRegex = /<header\s+class="site-header"[\s\S]*?<\/header>/i;
  if (headerRegex.test(content)) {
    const currentHeader = content.match(headerRegex)[0];
    if (currentHeader.trim() !== headerTemplate) {
      content = content.replace(headerRegex, headerTemplate);
      changed = true;
    }
  }

  // Б. Перевірка підключення базових CSS файлів
  if (!content.includes('/css/site-header.css') && content.includes('</head>')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="/css/site-header.css">\n</head>');
    changed = true;
  }
  if (!content.includes('/css/site-footer.css') && content.includes('</head>')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="/css/site-footer.css">\n</head>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[OK] Оновлено: ${relPath}`);
    updatedCount++;
  }
}

console.log(`\nСинхронізацію завершено. Оновлено файлів: ${updatedCount} з ${htmlFiles.length}.`);
