import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Безкоштовна міграція інфраструктури в хмару — LIKEMARK CLOUD',
  description: 'Перенесення сайтів, баз даних та інфраструктури без зупинки роботи бізнесу. Досвідчені DevOps інженери.',
};

export default function MigrationPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.7 }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#092433', marginBottom: '16px' }}>
          Безкоштовна міграція у хмару LIKEMARK
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b' }}>
          Перенесемо ваші дані з будь-якого іншого хостингу чи локальних серверів без простоїв (Zero Downtime).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#092433', marginBottom: '8px' }}>1. Аудит інфраструктури</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Аналізуємо поточні сервіси, бази даних та навантаження для підбору оптимальних параметрів хмари.
          </p>
        </div>
        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#092433', marginBottom: '8px' }}>2. Тестове розгортання</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Переносимо копію даних на новий сервер LIKEMARK та перевіряємо працездатність без перемикання DNS.
          </p>
        </div>
        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#092433', marginBottom: '8px' }}>3. Фінальне перемикання</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Синхронізуємо останні зміни та оновлюємо DNS у зручний для вас час (наприклад, уночі).
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', backgroundColor: '#092433', color: '#ffffff', padding: '40px', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
          Бажаєте запланувати міграцію?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '24px' }}>
          Зв&apos;яжіться з нашими інженерами — консультація та оцінка проєкту безкоштовні.
        </p>
        <Link
          href="/#calc"
          style={{
            backgroundColor: '#eb4247',
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          Замовити консультацію
        </Link>
      </div>
    </div>
  );
}
