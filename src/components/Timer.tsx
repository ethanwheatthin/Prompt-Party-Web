import { useTimer } from '../hooks/useTimer';

interface TimerProps {
  endTime: number;
  label?: string;
  className?: string;
}

export function Timer({ endTime, label, className = '' }: TimerProps) {
  const { secondsLeft, formatted } = useTimer(endTime);
  const urgent = secondsLeft <= 10;

  return (
    <div className={`text-center ${className}`}>
      {label && <div className="text-lg text-white/60 mb-1">{label}</div>}
      <div
        className={`font-display font-bold transition-colors duration-300 ${
          urgent ? 'text-red-400 animate-pulse-slow' : 'text-white'
        }`}
        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
      >
        {formatted}
      </div>
    </div>
  );
}
