'use client';

import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { MSWProvider } from '@/mocks/MSWProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </MSWProvider>
  );
}
