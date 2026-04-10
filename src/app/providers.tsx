'use client';

import { ReactQueryProvider } from '@/shared/providers/ReactQueryProvider';
import { MSWProvider } from '@/shared/mocks/MSWProvider';
import ToastContainer from '@/shared/components/Toast/ToastContainer';
import { Modal } from '@/shared/components/Modal';
import { LanguageProvider } from '@/shared/contexts/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ReactQueryProvider>
        <LanguageProvider>
          {children}
          <Modal />
          <ToastContainer />
        </LanguageProvider>
      </ReactQueryProvider>
    </MSWProvider>
  );
}
