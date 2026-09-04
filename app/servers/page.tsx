import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Оренда виділених та хмарних серверів (IaaS) — LIKEMARK CLOUD',
  description: 'Потужні віртуальні сервери у Варшаві та Франкфурті. Процесори AMD EPYC, швидкісні NVMe диски, SLA 99.98%.',
};

export default function ServersPage() {
  const plans = [
    { name: 'Cloud Start', cpu: '2 vCPU', ram: '4 GB RAM', disk: '50 GB NVMe', price: '650 ₴/міс' },
    { name: 'Cloud Business', cpu: '4 vCPU', ram: '8 GB RAM', disk: '100 GB NVMe', price: '1 290 ₴/міс', popular: true },
    { name: 'Cloud Pro', cpu: '8 vCPU', ram: '16 GB RAM', disk: '200 GB NVMe', price: '2 450 ₴/міс' },
    { name: 'Cloud Enterprise', cpu: '16 vCPU', ram: '32 GB RAM', disk: '400 GB NVMe', price: '4 800 ₴/міс' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#092433', marginBottom: '16px' }}>
          Оренда хмарних серверів у Європі
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
          Дата-центри Tier III у Варшаві (Польща) та Франкфурті (Німеччина). Підтримка 24/7 та миттєва активація.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '64px' }}>
        {plans.map((p, idx) => (
          <div
            key={idx}
            style={{
              padding: '32px',
              borderRadius: '16px',
              border: p.popular ? '2px solid #eb4247' : '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {p.popular && (
              <span
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#eb4247',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                }}
              >
                Популярний
              </span>
            )}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '16px' }}>{p.name}</h3>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#092433', marginBottom: '20px' }}>
                {p.price}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#475569' }}>
                <li>✓ {p.cpu}</li>
                <li>✓ {p.ram}</li>
                <li>✓ {p.disk}</li>
                <li>✓ Порт 1 Гбіт/с безліміт</li>
                <li>✓ 1x IPv4 + /64 IPv6</li>
              </ul>
            </div>
            <Link
              href="/#calc"
              style={{
                textAlign: 'center',
                backgroundColor: p.popular ? '#eb4247' : '#092433',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Замовити сервер
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
