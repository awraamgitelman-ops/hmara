'use client';

import React, { useState } from 'react';

export default function CloudCalculator() {
  const [cpu, setCpu] = useState(4);
  const [ram, setRam] = useState(8);
  const [disk, setDisk] = useState(120);
  const [osPrice, setOsPrice] = useState(0);
  const [isOrdered, setIsOrdered] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Тарифікація: CPU 180 ₴/ядро, RAM 75 ₴/GB, NVMe 2.5 ₴/GB
  const totalPrice = Math.round(cpu * 180 + ram * 75 + disk * 2.5 + osPrice);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          tariff: `Конфігуратор: ${cpu} vCPU / ${ram} GB RAM / ${disk} GB NVMe (${totalPrice} ₴/міс)`,
          source: 'Калькулятор на головній сторінці',
        }),
      });
      setIsOrdered(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="calc"
      style={{
        padding: '80px 24px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#092433', marginBottom: '12px' }}>
            Калькулятор хмарних серверів
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            Гнучке налаштування ресурсів для вашого проєкту у Варшаві чи Франкфурті
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 8px 30px rgba(9, 36, 51, 0.06)',
            border: '1px solid rgba(9, 36, 51, 0.08)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                  <span>Процесор (vCPU):</span>
                  <span style={{ color: '#eb4247' }}>{cpu} {cpu === 1 ? 'ядро' : cpu < 5 ? 'ядра' : 'ядер'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  value={cpu}
                  onChange={(e) => setCpu(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#eb4247' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                  <span>Оперативна пам&apos;ять (RAM):</span>
                  <span style={{ color: '#eb4247' }}>{ram} GB</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="128"
                  step="2"
                  value={ram}
                  onChange={(e) => setRam(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#eb4247' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                  <span>NVMe SSD сховище:</span>
                  <span style={{ color: '#eb4247' }}>{disk} GB</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={disk}
                  onChange={(e) => setDisk(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#eb4247' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Операційна система:</label>
                <select
                  value={osPrice}
                  onChange={(e) => setOsPrice(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                >
                  <option value={0}>Linux (Ubuntu / Debian / AlmaLinux) — Безкоштовно</option>
                  <option value={350}>Windows Server 2022 (+350 ₴/міс)</option>
                </select>
              </div>
            </div>

            {/* Summary Box */}
            <div
              style={{
                backgroundColor: '#092433',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Орієнтовна вартість:
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#00e599', margin: '8px 0 16px 0' }}>
                  {totalPrice.toLocaleString('uk-UA')} ₴
                  <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 500 }}> / місяць</span>
                </div>

                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  ✓ Канал зв&apos;язку 1 Гбіт/с без ліміту трафіку<br />
                  ✓ Dedicated IPv4 адреса включена<br />
                  ✓ Безкоштовний бекап та цілодобовий моніторинг
                </div>
              </div>

              {isOrdered ? (
                <div style={{ backgroundColor: 'rgba(0, 229, 153, 0.15)', padding: '16px', borderRadius: '8px', color: '#00e599', textAlign: 'center', marginTop: '24px' }}>
                  ✓ Заявку прийнято! Інженер зв&apos;яжеться з вами протягом 15 хвилин.
                </div>
              ) : (
                <form onSubmit={handleOrder} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="tel"
                    placeholder="+380 (XX) XXX-XX-XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: '#eb4247',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d9383d')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#eb4247')}
                  >
                    {loading ? 'Надсилаємо...' : 'Замовити конфігурацію'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
