import { Modal } from '@/shared/components/Modal';
import type { Viewport } from 'next';
import './globals.css';
import Providers from './providers';
import ToastContainer from '@/shared/components/Toast/ToastContainer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {process.env.NODE_ENV === 'development' ? (
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      ) : null}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
