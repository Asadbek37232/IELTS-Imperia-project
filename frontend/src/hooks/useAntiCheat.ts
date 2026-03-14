import { useEffect, useRef } from 'react';
import { studentApi } from '../services/api';

export function useAntiCheat(testSessionId: string | null, enabled: boolean) {
  const lastSwitch = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !testSessionId) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        const now = Date.now();
        // Debounce: don't fire twice within 2 seconds
        if (now - lastSwitch.current < 2000) return;
        lastSwitch.current = now;

        try {
          await studentApi.reportTabSwitch(testSessionId);
        } catch {
          // Silent fail — doesn't interrupt the student experience
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [testSessionId, enabled]);
}
