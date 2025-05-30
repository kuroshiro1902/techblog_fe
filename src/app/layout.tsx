import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header/header';
import { Toaster } from '@/components/ui/toaster';
import UserIdentify from '@/routes/UserIdentify';
import { LoadingOverlay } from '@/components/layout/loading';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Suspense } from 'react';
import Footer from '@/components/layout/footer/footer';

dayjs.extend(utc);
dayjs.extend(timezone);

const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
  title: 'Tech Blog',
  description: 'Nền tảng chia sẻ kiến thức công nghệ trực tuyến.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <body className={inter.className + 'min-w-[320px]'} style={{ overflow: 'auto' }}>
        <LoadingOverlay width={90} height={90} />
        <UserIdentify />
        <Toaster />
        <Header />
        <Suspense fallback={<LoadingOverlay width={90} height={90} />}>{children}</Suspense>
        <Footer />
      </body>
    </html>
  );
}
