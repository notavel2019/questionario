'use client';

import { useCallback, useEffect, useState } from 'react';
import { authFetch } from '@/lib/client-api';

export type UsageStatus = {
  used: number;
  limit: number;
  isPaid: boolean;
  resetAt: string;
};

export function useUsage() {
  const [usage, setUsage] = useState<UsageStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await authFetch('/api/usage');
      if (res.ok) {
        setUsage(await res.json());
      }
    } catch {
      // silencioso — a UI simplesmente não mostra o contador
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { usage, refresh };
}
