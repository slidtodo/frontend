import { useEffect, useState } from 'react';
import { useInterval } from './useInterval';
import { getRelativeTime } from '@/shared/utils/utils';

export function useRelativeTime(savedAt: string | null, active: boolean): string | null {
  const [now, setNow] = useState<number>(() => Date.now());

  // active가 true가 될 때 now 즉시 리셋
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (active) setNow(Date.now());
  }, [active]);

  useInterval(() => setNow(Date.now()), savedAt && active ? 1000 : null);

  if (!savedAt) return null;

  return getRelativeTime(savedAt);
}
