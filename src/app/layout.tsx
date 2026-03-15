import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tradeflow.co.uk'),
  title: {
    default: 'TradeFlow — UK Field Service Software | Job Management for Trades',
    template: '%s | TradeFlow',
  },
  description:
    'Complete field service platform for UK plumbers, electricians and HVAC engineers. Job management, CIS tax compliance, digital certificates, engineer scheduling, and fleet tracking. From £39/user/month.',
  keywords: [
    'field service software UK',
    'job management software',
    'plumber software UK',
    'electrician software UK',
    'HVAC software UK',
    'Gas Safe certificate software',
    'NICEIC certificate app',
    'CIS tax compliance',
    'engineer scheduling',
    'fleet tracking UK',
    'digital certificates',
    'F-Gas compliance',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://tradeflow.co.uk',
    siteName: 'TradeFlow',
    title: 'TradeFlow — UK Field Service Platform for Plumbing, Electrical & HVAC',
    description:
      'Complete job management platform with CIS compliance, digital certificates, engineer scheduling, and fleet tracking for UK trades.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TradeFlow field service software' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeFlow — Field Service Software Built for UK Trades',
    description: 'Job management, CIS compliance, digital certificates. Built for plumbers, electricians, HVAC engineers.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://tradeflow.co.uk' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${dmSans.variable} ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B5E20" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TradeFlow" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'TradeFlow',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web, iOS, Android',
              description: 'Field service management platform for UK plumbers, electricians, and HVAC engineers. Job management, CIS compliance, digital certificates.',
              url: 'https://tradeflow.co.uk',
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '39',
                highPrice: '99',
                priceCurrency: 'GBP',
                offerCount: 3,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Data & Digital Ltd',
                url: 'https://datandigital.co.uk',
              },
            }),
          }}
        />
      </head>
      <body className="font-[var(--font-inter)] bg-[#FAFAF5] text-slate-800 antialiased">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
