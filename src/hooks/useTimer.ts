import { useState, useEffect, useRef, useCallback } from 'react';

const GAME_DURATION = 360; // 6 minutes

export function useTimer() {
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) { setIsRunning(false); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeRemaining]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => { setIsRunning(false); setTimeRemaining(GAME_DURATION); }, []);

  return { timeRemaining, isRunning, start, pause, reset, isExpired: timeRemaining <= 0 };
}
