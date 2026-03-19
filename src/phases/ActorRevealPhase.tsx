import { useGameState } from '../context/GameStateContext';

export function ActorRevealPhase() {
  const { state } = useGameState();
  const players = state.roomState?.players ?? [];

  // The next actor will be determined when the backend sends round_started.
  // For the reveal screen, we show a transition message.
  // If we have a previous winning prompt, we can show context.
  const lastActor = state.winningPrompt
    ? players.find(p => p.id === state.winningPrompt!.actorId)
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-scale-in">
      <div className="text-white/50 text-2xl font-body">
        Round {state.roundNumber} Complete
      </div>

      {lastActor && (
        <div className="text-white/40 text-xl font-body">
          Great job, {lastActor.name}!
        </div>
      )}

      <div
        className="font-display font-bold text-primary-300 animate-pulse-slow"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
      >
        Next round starting...
      </div>
    </div>
  );
}
