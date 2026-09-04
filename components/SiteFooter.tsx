import React from 'react';
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#051119',
        color: '#ffffff',
        padding: '64px 24px 32px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/img/logo-footer.png"
                alt="LIKEMARK CLOUD"
                style={{ width: '42px', height: '42px', borderRadius: '10px' }}
              />
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                LIKEMARK CLOUD
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '320px' }}>
              Український IaaS та PaaS хмарний провайдер корпоративного рівня. Безпечні ЦОД Tier III у Варшаві та Франкфурті.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
              Послуги та Рішення
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link href="/servers" style={{ color: '#94a3b8', fontSize: '14px' }}>Оренда віртуальних серверів (vServer)</Link></li>
              <li><Link href="/migration" style={{ color: '#94a3b8', fontSize: '14px' }}>Безкоштовна міграція інфраструктури</Link></li>
              <li><Link href="/cases/highload-black-friday" style={{ color: '#94a3b8', fontSize: '14px' }}>Highload інфраструктура для eCommerce</Link></li>
              <li><Link href="/cases/disaster-recovery-cloud" style={{ color: '#94a3b8', fontSize: '14px' }}>Disaster Recovery & Резервування</Link></li>
              <li><Link href="/cases/video-streaming-cdn" style={{ color: '#94a3b8', fontSize: '14px' }}>Video Streaming & CDN</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
              Контакти та Підтримка
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#94a3b8' }}>
              <div>
                Гаряча лінія (Україна):<br />
                <a href="tel:+380800334812" style={{ color: '#ffffff', fontWeight: 600 }}>+380 (800) 33-48-12</a>
              </div>
              <div>
                Відділ продажів:<br />
                <a href="mailto:sales@likemark.cloud" style={{ color: '#ffffff', fontWeight: 600 }}>sales@likemark.cloud</a>
              </div>
              <div>
                Технічна підтримка 24/7:<br />
                <a href="mailto:support@likemark.cloud" style={{ color: '#ffffff', fontWeight: 600 }}>support@likemark.cloud</a>
              </div>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
              Юридична інформація
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              ТОВ «ЛАЙКМАРК ЮКРЕЙН»<br />
              Код ЄДРПОУ: 45356074<br />
              КВЕД: 63.11 Оброблення даних, розміщення інформації на веб-вузлах<br />
              Дата державної реєстрації: 2023 рік
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} ТОВ «ЛАЙКМАРК ЮКРЕЙН». Всі права захищено.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ color: '#64748b' }}>Політика конфіденційності</Link>
            <Link href="/terms" style={{ color: '#64748b' }}>Умови надання послуг (Оферта)</Link>
            <Link href="/cookie-policy" style={{ color: '#64748b' }}>Політика Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
