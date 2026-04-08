'use client';

import { useBreakpoint } from '@/shared/hooks/useBreakPoint';

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';

  return (
    <div
      className={isMobile ? '-mx-[15px] -mt-8 -mb-8' : undefined}
    >
      {children}
    </div>
  );
}
