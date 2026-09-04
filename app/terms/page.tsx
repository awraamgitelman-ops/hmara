import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Умови надання послуг (Публічна оферта) — LIKEMARK CLOUD',
  description: 'Договір публічної оферти на надання хмарних послуг та оренди серверів ТОВ «ЛАЙКМАРК ЮКРЕЙН».',
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#092433', marginBottom: '20px' }}>
        Умови надання послуг (Публічна оферта)
      </h1>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        ТОВ «ЛАЙКМАРК ЮКРЕЙН» (код ЄДРПОУ 45356074)
      </p>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '10px' }}>1. Предмет договору</h2>
        <p>Виконавець (ТОВ «ЛАЙКМАРК ЮКРЕЙН») надає Замовнику послуги з оренди обчислювальних ресурсів, дискового простору та супутніх хмарних сервісів у дата-центрах Європи відповідно до обраного тарифного плану.</p>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '10px' }}>2. Рівень обслуговування (SLA)</h2>
        <p>Виконавець гарантує доступність хмарних вузлів на рівні не нижче 99.98% на рік. Технічна підтримка здійснюється цілодобово 24/7.</p>
      </section>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '40px' }}>
        <Link href="/" style={{ color: '#eb4247', fontWeight: 600 }}>
          ← Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
