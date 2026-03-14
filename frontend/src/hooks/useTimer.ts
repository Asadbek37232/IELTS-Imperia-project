import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(deadlineISO: string, onExpire: () => void) {
  const getRemaining = useCallback(() => {
    const diff = new Date(deadlineISO).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [deadlineISO]);

  const [seconds, setSeconds] = useState(getRemaining);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemaining();
      setSeconds(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onExpireRef.current();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getRemaining]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isWarning = seconds <= 60;
  const isCritical = seconds <= 30;

  return {
    seconds,
    display: `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
    isWarning,
    isCritical,
  };
}
