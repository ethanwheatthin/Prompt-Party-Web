import { useGameState } from '../context/GameStateContext';
import { useCountdown } from '../hooks/useTimer';
import { GamePhase } from '../types/protocol';

const PERFORMANCE_SECONDS = 60;

export function PerformancePhase() {
  const { state } = useGameState();
  const prompt = state.winningPrompt;

  const { formatted } = useCountdown(
    PERFORMANCE_SECONDS * 1000,
    state.phase === GamePhase.PERFORMANCE,
  );

  if (!prompt) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 animate-fade-in">
      {/* Actor name badge */}
      <div className="bg-[#5ef8f8] border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[1deg]">
        <span className="font-black uppercase text-xl">{prompt.actorName}, perform this:</span>
      </div>

      {/* The prompt - big and bold */}
      <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-5xl rotate-[-0.5deg]">
        <div
          className="font-black italic uppercase tracking-[-0.05em] text-black text-center leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          "{prompt.promptText}"
        </div>
      </div>

      {/* Topic */}
      <div className="bg-[#fbfb62] border-[3px] border-black px-4 py-1 font-bold text-black/70">
        Topic: {prompt.topic}
      </div>

      {/* Timer */}
      <div className="bg-[#5ef8f8] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-8 py-4 rotate-[0.5deg]">
        <div className="font-black uppercase text-xs text-center mb-1">Time</div>
        <div
          className="font-black italic text-black text-center"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {formatted}
        </div>
      </div>

      <div className="text-black/30 text-lg font-bold mt-2">
        Written by {prompt.playerName} &middot; {prompt.votes} vote{prompt.votes !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
