'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="container">
            <div className="top-bar-left">
              <div className="top-bar-lang">
                <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                  <rect width="18" height="6.5" fill="#0057B7" />
                  <rect y="6.5" width="18" height="6.5" fill="#FFDD00" />
                </svg>
                <span>UA</span>
              </div>
            </div>

            <div className="top-bar-right">
              <a href="mailto:sales@likemark.cloud" className="top-bar-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>sales@likemark.cloud</span>
              </a>
              <a href="tel:+380800334812" className="top-bar-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+380 (800) 33-48-12</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="header-main">
          <div className="container">
            <Link href="/" className="header-logo" aria-label="LIKEMARK CLOUD Головна">
              <img
                src="/img/logo-header.png"
                alt="LIKEMARK CLOUD"
                className="logo-img"
                style={{ height: '36px', width: 'auto' }}
              />
            </Link>

            <nav className="header-nav" aria-label="Головна навігація сайту">
              <Link href="/servers" className="header-nav-link">Сервери</Link>
              <Link href="/migration" className="header-nav-link">Міграція</Link>
              <Link href="/cases/highload-black-friday" className="header-nav-link">Рішення</Link>
              <Link href="/contacts" className="header-nav-link">Контакти</Link>
            </nav>

            <div className="header-actions">
              <button
                type="button"
                className="btn-header-login"
                onClick={() => {
                  window.location.href = 'mailto:sales@likemark.cloud?subject=Запит%20на%20доступ%20до%20кабінету';
                }}
              >
                Вхід
              </button>
              <Link href="/#calc" className="btn-header-cta">
                Калькулятор
              </Link>
              <button
                type="button"
                className="header-burger-btn"
                aria-label="Відкрити меню"
                onClick={() => setDrawerOpen(true)}
              >
                <span className="burger-line"></span>
                <span className="burger-line"></span>
                <span className="burger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer-overlay ${drawerOpen ? 'active' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <nav className={`mobile-drawer ${drawerOpen ? 'active' : ''}`} aria-label="Мобільне меню">
        <div className="mobile-drawer-header">
          <Link href="/" className="header-logo" onClick={() => setDrawerOpen(false)}>
            <img src="/img/logo-header.png" alt="LIKEMARK CLOUD" style={{ height: '30px', width: 'auto' }} />
          </Link>
          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Закрити меню"
            onClick={() => setDrawerOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mobile-drawer-nav">
          <Link href="/servers" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Сервери</Link>
          <Link href="/migration" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Міграція</Link>
          <Link href="/cases/highload-black-friday" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Рішення</Link>
          <Link href="/contacts" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Контакти</Link>
        </div>

        <div className="mobile-drawer-footer">
          <div className="mobile-drawer-contacts">
            <a href="tel:+380800334812" className="mobile-drawer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+380 (800) 33-48-12</span>
            </a>
            <a href="mailto:sales@likemark.cloud" className="mobile-drawer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>sales@likemark.cloud</span>
            </a>
          </div>
          <Link href="/#calc" className="mobile-drawer-btn-cta" onClick={() => setDrawerOpen(false)}>
            Розрахувати сервер
          </Link>
        </div>
      </nav>
    </>
  );
}
