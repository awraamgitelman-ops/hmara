import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Політика конфіденційності — LIKEMARK CLOUD',
  description: 'Порядок обробки та захисту персональних даних користувачів сервісу LIKEMARK CLOUD.',
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#092433', marginBottom: '20px' }}>
        Політика конфіденційності
      </h1>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        ТОВ «ЛАЙКМАРК ЮКРЕЙН» (код ЄДРПОУ 45356074)
      </p>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '10px' }}>1. Загальні положення</h2>
        <p>Ця Політика визначає порядок обробки персональних даних клієнтів при використанні хмарних послуг LIKEMARK CLOUD відповідно до Закону України «Про захист персональних даних» та норм GDPR.</p>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '10px' }}>2. Збір та використання даних</h2>
        <p>Ми збираємо лише ті дані, які необхідні для надання доступу до віртуальних серверів, виставлення рахунків та забезпечення технічної підтримки (ім’я, телефон, email, реквізити юридичної особи).</p>
      </section>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '40px' }}>
        <Link href="/" style={{ color: '#eb4247', fontWeight: 600 }}>
          ← Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
