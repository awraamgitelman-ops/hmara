import React from 'react';
import Link from 'next/link';
import CloudCalculator from '../components/CloudCalculator';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #092433 0%, #0d344a 100%)',
          color: '#ffffff',
          padding: '100px 24px 80px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '13px',
              marginBottom: '24px',
              color: '#38bdf8',
            }}
          >
            <span>🇪🇺 Варшава (Польща) & Франкфурт (Німеччина) • SLA 99.98%</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            Хмарні сервери та IaaS-інфраструктура для бізнесу
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: '#94a3b8',
              maxWidth: '720px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
            }}
          >
            Оренда продуктивних NVMe серверів у європейських дата-центрах Tier III. Безкоштовне перенесення та налаштування проєктів інженерами LIKEMARK 24/7.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/#calc"
              style={{
                backgroundColor: '#eb4247',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                transition: 'background 0.2s',
              }}
            >
              Підібрати конфігурацію
            </Link>
            <Link
              href="/migration"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'background 0.2s',
              }}
            >
              Безкоштовна міграція
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <CloudCalculator />

      {/* Solutions / Features */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#092433', marginBottom: '12px' }}>
            Готові хмарні рішення
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            Оптимізовані архітектури для різних завдань вашого бізнесу
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          <div style={{ padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>
              Highload eCommerce
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              Масштабовані кластери під пікові навантаження Чорної П&apos;ятниці та сезонних розпродажів.
            </p>
            <Link href="/cases/highload-black-friday" style={{ color: '#eb4247', fontWeight: 600, fontSize: '14px' }}>
              Читати кейс →
            </Link>
          </div>

          <div style={{ padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>
              Disaster Recovery
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              Резервування інфраструктури з миттєвим перемиканням у разі аварії основного майданчика.
            </p>
            <Link href="/cases/disaster-recovery-cloud" style={{ color: '#eb4247', fontWeight: 600, fontSize: '14px' }}>
              Читати кейс →
            </Link>
          </div>

          <div style={{ padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#092433', marginBottom: '12px' }}>
              Video Streaming & CDN
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
              Низька затримка доставки важкого медіа-контенту через розподілену мережу вузлів.
            </p>
            <Link href="/cases/video-streaming-cdn" style={{ color: '#eb4247', fontWeight: 600, fontSize: '14px' }}>
              Читати кейс →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
