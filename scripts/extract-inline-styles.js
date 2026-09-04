/**
 * scripts/extract-inline-styles.js
 *
 * Вилучає 1.27 МБ інлайн-стилів (<style>) із index.html, servers.html, migration.html
 * і зберігає їх у кэшований файл public/css/legacy-bundle.css.
 *
 * Це прискорює завантаження сайту клієнтами та зменшує розмір кожного HTML-файлу
 * на 1.275 МБ.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BUNDLE_CSS_PATH = path.join(PUBLIC_DIR, 'css', 'legacy-bundle.css');

const TARGET_FILES = [
  path.join(PUBLIC_DIR, 'index.html'),
  path.join(PUBLIC_DIR, 'servers.html'),
  path.join(PUBLIC_DIR, 'migration.html'),
];

console.log('Початок оптимізації стилів...');

// 1. Зчитуємо стилі з index.html
const indexContent = fs.readFileSync(TARGET_FILES[0], 'utf8');
const bodyIdx = indexContent.indexOf('<body');
if (bodyIdx === -1) {
  console.error('Не знайдено тег <body у public/index.html');
  process.exit(1);
}

const headChunk = indexContent.slice(0, bodyIdx);
const styleMatches = headChunk.match(/<style[\s\S]*?<\/style>/gi) || [];

console.log(`Знайдено ${styleMatches.length} тегів <style> у <head>...`);

if (styleMatches.length > 0) {
  // Витягуємо весь CSS вміст
  let combinedCss = '/* ==========================================================================\n' +
                    '   LEGACY NUXT / SINGLEFILE BUNDLED STYLES (EXTRACTED)\n' +
                    '   LIKEMARK CLOUD — ТОВ «ЛАЙКМАРК ЮКРЕЙН»\n' +
                    '   ========================================================================== */\n\n';

  for (const styleTag of styleMatches) {
    const cssContent = styleTag.replace(/^<style[^>]*>/i, '').replace(/<\/style>$/i, '');
    combinedCss += cssContent + '\n\n';
  }

  // Записуємо legacy-bundle.css, якщо ще не створено або оновлюємо
  fs.writeFileSync(BUNDLE_CSS_PATH, combinedCss, 'utf8');
  console.log(`[OK] Створено ${BUNDLE_CSS_PATH} (${(combinedCss.length / 1024).toFixed(1)} KB)`);

  // 2. Очищуємо кожен цільовий файл від 99 тегів <style>
  for (const filePath of TARGET_FILES) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    const bIdx = content.indexOf('<body');
    if (bIdx === -1) continue;

    let beforeBody = content.slice(0, bIdx);
    const afterBody = content.slice(bIdx);

    const countBefore = (beforeBody.match(/<style[\s\S]*?<\/style>/gi) || []).length;
    if (countBefore === 0) {
      console.log(`[-] ${path.basename(filePath)} вже оптимізовано.`);
      continue;
    }

    // Видаляємо всі <style>...</style> перед <body
    beforeBody = beforeBody.replace(/<style[\s\S]*?<\/style>\s*/gi, '');

    // Додаємо лінк на legacy-bundle.css, якщо ще немає
    if (!beforeBody.includes('/css/legacy-bundle.css')) {
      beforeBody = '<link rel="stylesheet" href="/css/legacy-bundle.css">\n' + beforeBody;
    }

    const newContent = beforeBody + afterBody;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`[OK] Оптимізовано ${path.basename(filePath)}: видалено ${countBefore} блоків <style>, збережено.`);
  }
} else {
  console.log('Теги <style> у <head> не знайдено або вони вже вилучені.');
}

console.log('Оптимізацію стилів завершено успішно.');
