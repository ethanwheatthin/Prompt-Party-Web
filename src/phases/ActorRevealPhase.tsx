import { useGameState } from '../context/GameStateContext';

export function ActorRevealPhase() {
  const { state } = useGameState();
  const players = state.roomState?.players ?? [];

  const lastActor = state.winningPrompt
    ? players.find(p => p.id === state.winningPrompt!.actorId)
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-scale-in">
      <div className="bg-white border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <span className="font-black uppercase text-xl">Round {state.roundNumber} Complete</span>
      </div>

      {lastActor && (
        <div className="bg-[#fbfb62] border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[1deg]">
          <span className="font-black uppercase text-xl">Great job, {lastActor.name}!</span>
        </div>
      )}

      <div
        className="font-black italic uppercase tracking-[-0.05em] text-[#ff66b2] animate-pulse-slow"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
      >
        Next round starting...
      </div>
    </div>
  );
}
