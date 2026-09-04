import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

let cachedHeader: string | null = null;
let cachedFooter: string | null = null;
let cachedModals: string | null = null;
let cachedScripts: string | null = null;

function loadTemplates() {
  const root = process.cwd();
  if (!cachedHeader) cachedHeader = fs.readFileSync(path.join(root, 'templates', 'site-header.html'), 'utf8');
  if (!cachedFooter) cachedFooter = fs.readFileSync(path.join(root, 'templates', 'site-footer.html'), 'utf8');
  if (!cachedModals) cachedModals = fs.readFileSync(path.join(root, 'templates', 'site-modals.html'), 'utf8');
  if (!cachedScripts) cachedScripts = fs.readFileSync(path.join(root, 'templates', 'site-scripts.html'), 'utf8');
}

export function renderPage(filePathRelative: string, activeRoute: string = '') {
  loadTemplates();
  const fullPath = path.join(process.cwd(), filePathRelative);
  let html = fs.readFileSync(fullPath, 'utf8');

  // Build active header
  let headerHtml = cachedHeader!;
  if (activeRoute) {
    const linkRegex = new RegExp('(href="\\/' + activeRoute + '"[^>]*class="[^"]*header-nav-link)([^"]*")', 'g');
    headerHtml = headerHtml.replace(linkRegex, '$1 active$2');
  }

  // Ensure stylesheet links in <head>
  if (!html.includes('/css/site-theme.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/css/site-theme.css">\n</head>');
  }
  if (!html.includes('/css/site-header.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/css/site-header.css">\n</head>');
  }
  if (!html.includes('/css/site-footer.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/css/site-footer.css">\n</head>');
  }

  // Replace header in html
  const headerStart = html.indexOf('<header class="site-header">');
  if (headerStart !== -1) {
    const mainStart = html.indexOf('<main', headerStart);
    if (mainStart !== -1) {
      html = html.substring(0, headerStart) + headerHtml + '\n  ' + html.substring(mainStart);
    }
  }

  // Replace footer in html
  let footerStart = html.indexOf('<div class=footer data-v-a4670568>');
  if (footerStart === -1) {
    footerStart = html.indexOf('<div class="footer');
  }
  if (footerStart === -1) {
    footerStart = html.indexOf('<div class=footer');
  }
  if (footerStart === -1) {
    footerStart = html.indexOf('<footer');
  }

  let footerEnd = html.indexOf('<div id="auth-modal"', footerStart !== -1 ? footerStart : 0);
  if (footerEnd === -1) {
    footerEnd = html.indexOf('<!-- ====================', footerStart !== -1 ? footerStart : 0);
  }
  if (footerEnd === -1) {
    const closingFooter = html.indexOf('</footer>', footerStart !== -1 ? footerStart : 0);
    if (closingFooter !== -1) footerEnd = closingFooter + 9;
  }
  if (footerEnd === -1) {
    footerEnd = html.indexOf('</body>', footerStart !== -1 ? footerStart : 0);
  }

  if (footerStart !== -1 && footerEnd !== -1 && footerEnd > footerStart) {
    html = html.substring(0, footerStart) + cachedFooter! + '\n\n' + html.substring(footerEnd);
  } else if (footerEnd !== -1) {
    html = html.substring(0, footerEnd) + cachedFooter! + '\n\n' + html.substring(footerEnd);
  }

  // Ensure modals and scripts exist
  if (!html.includes('id="auth-modal"')) {
    const bodyClose = html.indexOf('</body>');
    if (bodyClose !== -1) {
      html = html.substring(0, bodyClose) + '\n' + cachedModals! + '\n' + cachedScripts! + '\n' + html.substring(bodyClose);
    }
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
