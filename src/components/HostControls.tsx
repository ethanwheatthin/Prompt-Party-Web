import { useGameState } from '../context/GameStateContext';
import { GamePhase } from '../types/protocol';

const skippablePhases = new Set([
  GamePhase.PERFORMANCE,
  GamePhase.LEADERBOARD,
  GamePhase.ACTOR_REVEAL,
]);

export function HostControls() {
  const { state, skipPhase, endGame } = useGameState();
  const canSkip = skippablePhases.has(state.phase);

  if (state.phase === GamePhase.LOBBY || state.phase === GamePhase.CONNECTING) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 flex gap-3 z-50">
      {canSkip && (
        <button
          onClick={skipPhase}
          className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-display font-medium text-sm backdrop-blur transition-colors"
        >
          Skip
        </button>
      )}
      <button
        onClick={endGame}
        className="px-5 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-display font-medium text-sm backdrop-blur transition-colors"
      >
        End Game
      </button>
    </div>
  );
}
