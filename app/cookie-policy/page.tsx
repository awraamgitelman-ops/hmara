import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Політика використання файлів cookie — LIKEMARK CLOUD',
  description: 'Інформація про типи файлів cookie, які використовує сервіс LIKEMARK CLOUD, мету їх збору та управління ними.',
};

export default function CookiePolicyPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#092433', marginBottom: '24px' }}>
        Політика використання файлів cookie
      </h1>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        Останнє оновлення: 2026 рік • ТОВ «ЛАЙКМАРК ЮКРЕЙН» (код ЄДРПОУ 45356074)
      </p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>
          1. Що таке файли cookie?
        </h2>
        <p>
          Файли cookie — це невеликі текстові файли, які зберігаються у вашому браузері під час відвідування веб-сайту. Вони допомагають зберігати налаштування сесії, забезпечувати безпеку та покращувати взаємодію з інтерфейсом.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>
          2. Які типи cookie ми використовуємо?
        </h2>
        <ul>
          <li><strong>Обов&apos;язкові технічні:</strong> необхідні для коректної навігації, роботи панелі та авторизації.</li>
          <li><strong>Аналітичні:</strong> знеособлені дані для моніторингу навантаження та стабільності роботи платформи.</li>
          <li><strong>Функціональні:</strong> збереження мовних налаштувань (UA) та обраних конфігурацій серверів.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>
          3. Як керувати файлами cookie?
        </h2>
        <p>
          Ви можете вимкнути або видалити файли cookie у налаштуваннях вашого браузера у будь-який момент. Зверніть увагу, що відключення обов&apos;язкових технічних cookies може вплинути на працездатність особистого кабінету.
        </p>
      </section>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '40px' }}>
        <Link href="/" style={{ color: '#eb4247', fontWeight: 600 }}>
          ← Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
