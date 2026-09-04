'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('likemark_cookie_accepted');
      if (accepted !== 'true') {
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('likemark_cookie_accepted', 'true');
    } catch (e) {}
    setVisible(false);
  };

  const handleClose = () => {
    try {
      localStorage.setItem('likemark_cookie_accepted', 'true');
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        maxWidth: '480px',
        width: 'calc(100vw - 48px)',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 12px 36px rgba(9, 36, 51, 0.16)',
        border: '1px solid rgba(9, 36, 51, 0.08)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: 'fadeIn 0.25s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h5 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#092433' }}>
          Ми використовуємо файли Cookies
        </h5>
        <button
          onClick={handleClose}
          aria-label="Закрити сповіщення"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            color: 'rgba(9, 36, 51, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <p style={{ margin: 0, fontSize: '13px', color: 'rgba(9, 36, 51, 0.75)', lineHeight: 1.5 }}>
        Продовжуючи користуватися сайтом, ви погоджуєтеся{' '}
        <Link href="/cookie-policy" style={{ color: '#092433', textDecoration: 'underline' }}>
          на обробку обов&apos;язкових файлів cookie
        </Link>
        . Детальніше — в{' '}
        <Link href="/cookie-policy" style={{ color: '#092433', textDecoration: 'underline' }}>
          Політиці конфіденційності
        </Link>
        .
      </p>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: '#092433',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#163b4f')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#092433')}
        >
          Прийняти
        </button>
        <Link
          href="/cookie-policy"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(9, 36, 51, 0.16)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#092433',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(9, 36, 51, 0.04)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
}
