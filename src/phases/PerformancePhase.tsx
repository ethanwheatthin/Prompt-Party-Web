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
      <div className="text-accent-400 text-2xl font-body">
        {prompt.actorName}, perform this:
      </div>

      <div
        className="font-display font-bold text-white text-center max-w-5xl leading-tight"
        style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
      >
        "{prompt.promptText}"
      </div>

      <div className="text-white/40 text-xl font-body">
        Topic: {prompt.topic}
      </div>

      <div className="mt-4">
        <div className="text-white/50 text-lg font-body mb-1 text-center">Time</div>
        <div
          className="font-display font-bold text-white"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {formatted}
        </div>
      </div>

      <div className="text-white/30 text-lg font-body mt-4">
        Written by {prompt.playerName} &middot; {prompt.votes} vote{prompt.votes !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
