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
      {label && (
        <div className="font-black uppercase text-xs tracking-wide text-black/50 mb-1">{label}</div>
      )}
      <div
        className={`${urgent ? 'bg-[#ff66b2] animate-pulse-slow' : 'bg-[#5ef8f8]'} border-[3px] border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transition-colors duration-300`}
      >
        <div
          className="font-black italic text-black"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
        >
          {formatted}
        </div>
      </div>
    </div>
  );
}
