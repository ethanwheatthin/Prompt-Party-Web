import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(endTime: number | null) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (!endTime) {
      setSecondsLeft(0);
      return;
    }

    function tick() {
      const remaining = Math.max(0, Math.ceil((endTime! - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    tick();
    intervalRef.current = setInterval(tick, 250);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTime]);

  const formatted = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return { secondsLeft, formatted };
}

export function useCountdown(durationMs: number, active: boolean, onComplete?: () => void) {
  const [endTime, setEndTime] = useState<number | null>(null);
  const callbackRef = useRef(onComplete);
  callbackRef.current = onComplete;

  const start = useCallback(() => {
    setEndTime(Date.now() + durationMs);
  }, [durationMs]);

  useEffect(() => {
    if (active) {
      setEndTime(Date.now() + durationMs);
    } else {
      setEndTime(null);
    }
  }, [active, durationMs]);

  const { secondsLeft, formatted } = useTimer(endTime);

  useEffect(() => {
    if (endTime && secondsLeft <= 0) {
      callbackRef.current?.();
    }
  }, [endTime, secondsLeft]);

  return { secondsLeft, formatted, start };
}
