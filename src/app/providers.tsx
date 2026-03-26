'use client';

import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { MSWProvider } from '@/mocks/MSWProvider';
import ToastContainer from '@/shared/components/Toast/ToastContainer';
import { Modal } from '@/shared/components/Modal';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <ToastContainer />
      <Modal />
    </MSWProvider>
  );
}
