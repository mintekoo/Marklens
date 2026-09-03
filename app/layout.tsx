import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Marklens',
    template: '%s · Marklens',
  },
  description:
    'Cryptocurrency market dashboard with live prices, OHLC charts, trending assets, and coin details powered by the CoinGecko Demo REST API.',
  applicationName: 'Marklens',
  openGraph: {
    title: 'Marklens',
    description:
      'Cryptocurrency market dashboard with live prices, OHLC charts, trending assets, and coin details.',
    type: 'website',
    siteName: 'Marklens',
  },
  twitter: {
    card: 'summary',
    title: 'Marklens',
    description:
      'Cryptocurrency market dashboard with live prices, OHLC charts, trending assets, and coin details.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
