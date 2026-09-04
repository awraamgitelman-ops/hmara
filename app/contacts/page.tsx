import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Контакти та реквізити — LIKEMARK CLOUD',
  description: 'Офіційні контакти, гаряча лінія, юридичні реквізити ТОВ «ЛАЙКМАРК ЮКРЕЙН» та розташування дата-центрів.',
};

export default function ContactsPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#092433', marginBottom: '16px' }}>
        Контакти та офіційна інформація
      </h1>
      <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '40px' }}>
        Зв&apos;яжіться з нашою командою для отримання технічної консультації або розрахунку кастомної інфраструктури.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px' }}>
        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>Відділ продажів</h3>
          <p style={{ margin: 0, fontSize: '15px' }}>
            Email: <a href="mailto:sales@likemark.cloud" style={{ color: '#eb4247', fontWeight: 600 }}>sales@likemark.cloud</a><br />
            Тел: <a href="tel:+380800334812" style={{ color: '#092433', fontWeight: 600 }}>+380 (800) 33-48-12</a><br />
            Графік: Пн-Пт 09:00 - 19:00
          </p>
        </div>

        <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>Технічна підтримка (NOC)</h3>
          <p style={{ margin: 0, fontSize: '15px' }}>
            Email: <a href="mailto:support@likemark.cloud" style={{ color: '#eb4247', fontWeight: 600 }}>support@likemark.cloud</a><br />
            Черговий інженер: 24/7/365<br />
            SLA реакції: до 15 хвилин
          </p>
        </div>
      </div>

      <div style={{ padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#092433', marginBottom: '16px' }}>Юридичні реквізити</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.8 }}>
          <strong>Повне найменування:</strong> ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «ЛАЙКМАРК ЮКРЕЙН»<br />
          <strong>Код ЄДРПОУ:</strong> 45356074<br />
          <strong>Основний вид діяльності (КВЕД):</strong> 63.11 Оброблення даних, розміщення інформації на веб-вузлах і пов&apos;язана з ними діяльність<br />
          <strong>Дата державної реєстрації:</strong> 2023 рік
        </p>
      </div>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '48px' }}>
        <Link href="/" style={{ color: '#eb4247', fontWeight: 600 }}>
          ← Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
