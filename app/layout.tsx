import React from 'react';
import '../styles/globals.css';
import '../styles/site-header.css';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import CookieBanner from '../components/CookieBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LIKEMARK CLOUD — Український хмарний IaaS та PaaS провайдер',
  description: 'Надійні хмарні сервери, оренда IaaS у Варшаві та Франкфурті, безкоштовна міграція та цілодобова підтримка для українського бізнесу.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'LIKEMARK CLOUD — Український хмарний IaaS провайдер',
    description: 'Оренда IaaS та PaaS у Варшаві та Франкфурті. SLA 99.98%, цілодобова підтримка.',
    url: 'https://likemark.cloud',
    siteName: 'LIKEMARK CLOUD',
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
