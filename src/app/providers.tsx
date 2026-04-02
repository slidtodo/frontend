'use client';

import { ReactQueryProvider } from '@/shared/providers/ReactQueryProvider';
import { MSWProvider } from '@/shared/mocks/MSWProvider';
import ToastContainer from '@/shared/components/Toast/ToastContainer';
import { Modal } from '@/shared/components/Modal';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ReactQueryProvider>
        {children}
        <ToastContainer />
        <Modal />
      </ReactQueryProvider>
    </MSWProvider>
  );
}
