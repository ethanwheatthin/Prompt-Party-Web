import { useGameState } from '../context/GameStateContext';
import { Timer } from '../components/Timer';

export function PromptPhase() {
  const { state } = useGameState();
  const round = state.roundData;
  const players = state.roomState?.players ?? [];

  if (!round) return null;

  const actor = players.find(p => p.id === round.actorId);
  const nonActorCount = players.filter(p => !p.isHost && p.id !== round.actorId).length;
  const submittedCount = round.prompts.length;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in px-4">
      {/* Topic sticker */}
      <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-4xl w-full rotate-[-0.5deg]">
        <div className="inline-block bg-[#5ef8f8] border-[3px] border-black px-3 py-1 font-black text-xs uppercase mb-3">
          Round {state.roundNumber}: Fill in the Blank
        </div>
        <div
          className="font-black italic uppercase tracking-[-0.05em] text-black leading-tight"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
        >
          {round.topic}
        </div>
      </div>

      {/* Actor badge */}
      <div className="bg-[#ff66b2] border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[1deg]">
        <span className="font-black uppercase text-sm">Actor: </span>
        <span className="font-black uppercase text-xl">{actor?.name ?? 'Unknown'}</span>
      </div>

      <Timer endTime={round.maxEndAt} label="Time Remaining" />

      {/* Info boxes row */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-[#5ef8f8] border-[3px] border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-black text-xs uppercase text-center">Prompts Submitted</div>
          <div className="font-black text-3xl text-center">
            {submittedCount}<span className="text-black/40"> / {nonActorCount}</span>
          </div>
        </div>
        <div className="bg-[#fbfb62] border-[3px] border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="font-black text-xs uppercase text-center">Winner Gets</div>
          <div className="font-black text-3xl text-center">+50pts</div>
        </div>
      </div>

      <div className="text-black/40 text-lg font-bold">
        Waiting for players to submit prompts on their phones...
      </div>
    </div>
  );
}
