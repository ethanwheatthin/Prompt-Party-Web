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
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
      <div className="text-white/50 text-2xl font-body">
        Round {state.roundNumber}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-white/60 text-xl font-body">Topic</div>
        <div
          className="font-display font-bold text-primary-300 text-center max-w-4xl"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
        >
          {round.topic}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="text-accent-400 text-xl font-body">Actor</div>
        <div className="font-display font-bold text-accent-400 text-4xl">
          {actor?.name ?? 'Unknown'}
        </div>
      </div>

      <Timer endTime={round.maxEndAt} label="Time Remaining" />

      <div className="flex flex-col items-center gap-2">
        <div className="text-white/60 text-xl font-body">Prompts Submitted</div>
        <div className="font-display font-bold text-5xl text-white">
          {submittedCount}
          <span className="text-white/40"> / {nonActorCount}</span>
        </div>
      </div>

      <div className="text-white/30 text-lg font-body">
        Waiting for players to submit prompts on their phones...
      </div>
    </div>
  );
}
