import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CaseItem {
  title: string;
  category: string;
  summary: string;
  content: string;
}

const casesData: Record<string, CaseItem> = {
  'highload-black-friday': {
    title: 'Highload eCommerce: Підготовка до Чорної П’ятниці та сезонних розпродажів',
    category: 'eCommerce / Highload',
    summary: 'Як маркетплейс витримав х15 сплеск трафіку без відмов завдяки автоматичному масштабуванню LIKEMARK CLOUD.',
    content: `
      <h2>Виклик</h2>
      <p>Перед сезоном розпродажів Black Friday інтернет-магазин очікував пікове зростання одночасних користувачів з 2 000 до 35 000+. Попередня локальна інфраструктура не дозволяла швидко збільшити обчислювальні ресурси без простоїв.</p>
      
      <h2>Рішення</h2>
      <p>Інженери LIKEMARK CLOUD перенесли бази даних PostgreSQL на реплікований кластер NVMe у Франкфурті та налаштували автоматичне горизонтальне масштабування веб-вузлів.</p>

      <h2>Результат</h2>
      <ul>
        <li>100% доступність (Uptime 100%) протягом 7 днів розпродажу.</li>
        <li>Час відповіді бекенду скоротився з 450 мс до 65 мс.</li>
        <li>Оптимізація витрат: оплата додаткових серверів лише за години пікового навантаження.</li>
      </ul>
    `,
  },
  'disaster-recovery-cloud': {
    title: 'Disaster Recovery: Забезпечення безперервності роботи фінансового сервісу',
    category: 'Fintech / Security',
    summary: 'Автоматичне перемикання трафіку між Варшавою та Франкфуртом за 20 секунд у разі критичних інцидентів.',
    content: `
      <h2>Виклик</h2>
      <p>Фінтех-компанія потребувала відповідності міжнародним стандартам безпеки з нульовою втратою транзакційних даних у разі виходу з ладу будь-якого вузла.</p>

      <h2>Рішення</h2>
      <p>Розгортання мультизональної Disaster Recovery конфігурації між ЦОД Tier III Варшава та Франкфурт з безперервною асинхронною синхронізацією даних.</p>

      <h2>Результат</h2>
      <ul>
        <li>RPO (Recovery Point Objective) &lt; 1 секунди.</li>
        <li>RTO (Recovery Time Objective) &lt; 20 секунд.</li>
        <li>Повна незалежність від локальних збоїв інфраструктури.</li>
      </ul>
    `,
  },
  'video-streaming-cdn': {
    title: 'Video Streaming & CDN: Оптимізація трансляцій для освітньої платформи',
    category: 'Streaming / CDN',
    summary: 'Доставка 4K потокового відео 150 000+ глядачів без буферизації та з оптимізацією витрат на трафік.',
    content: `
      <h2>Виклик</h2>
      <p>Високі витрати на пропускну здатність та скарги користувачів на затримки під час одночасних онлайн-лекцій.</p>

      <h2>Рішення</h2>
      <p>Підключення виділених портів 10 Гбіт/с у LIKEMARK CLOUD та інтеграція географічно розподіленого кешування контенту.</p>

      <h2>Результат</h2>
      <ul>
        <li>Зниження затримки відтворення до мінімальних 1.2 с.</li>
        <li>Економія на трафіку понад 40% завдяки ефективному кешуванню.</li>
      </ul>
    `,
  },
  'infrastructure-cost-optimization': {
    title: 'Оптимізація витрат на ІТ-інфраструктуру для SaaS-компанії',
    category: 'SaaS / DevOps',
    summary: 'Скорочення хмарного бюджету на 35% при покращенні стабільності та продуктивності сервісу.',
    content: `
      <h2>Виклик</h2>
      <p>Неконтрольоване зростання витрат у закордонного гіперскейлера за рахунок складного прайсингу за кожен гігабайт трафіку та IOPS.</p>

      <h2>Рішення</h2>
      <p>Міграція базових стеків на прозорі фіксовані тарифи LIKEMARK CLOUD без прихованих платежів за внутрішній трафік.</p>

      <h2>Результат</h2>
      <ul>
        <li>Зниження щомісячного рахунку на 35%.</li>
        <li>Прямий контакт з інженерами техпідтримки українською мовою.</li>
      </ul>
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(casesData).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = casesData[params.slug];
  if (!item) return { title: 'Кейс не знайдено — LIKEMARK CLOUD' };
  return {
    title: `${item.title} — Кейси LIKEMARK CLOUD`,
    description: item.summary,
  };
}

export default function CaseDetailPage({ params }: { params: { slug: string } }) {
  const item = casesData[params.slug];
  if (!item) notFound();

  return (
    <article style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.8 }}>
      <div style={{ marginBottom: '24px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#eb4247',
            letterSpacing: '0.05em',
          }}
        >
          {item.category}
        </span>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, color: '#092433', marginTop: '8px', lineHeight: 1.25 }}>
          {item.title}
        </h1>
        <p style={{ fontSize: '17px', color: '#64748b', marginTop: '12px', fontWeight: 500 }}>
          {item.summary}
        </p>
      </div>

      <div
        style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px' }}
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', marginTop: '48px', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: '#eb4247', fontWeight: 600 }}>
          ← На головну
        </Link>
        <Link href="/#calc" style={{ color: '#092433', fontWeight: 600 }}>
          Розрахувати сервер →
        </Link>
      </div>
    </article>
  );
}
