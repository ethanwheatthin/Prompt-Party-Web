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
          className="px-5 py-2 bg-white text-black border-[3px] border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all duration-75"
        >
          Skip
        </button>
      )}
      <button
        onClick={endGame}
        className="px-5 py-2 bg-[#ff66b2] text-black border-[3px] border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all duration-75"
      >
        End Game
      </button>
    </div>
  );
}
