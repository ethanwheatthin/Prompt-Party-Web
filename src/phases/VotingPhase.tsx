import { useGameState } from '../context/GameStateContext';

export function VotingPhase() {
  const { state } = useGameState();
  const round = state.roundData;
  const players = state.roomState?.players ?? [];

  if (!round) return null;

  const eligibleVoters = players.filter(p => !p.isHost && p.id !== round.actorId).length;
  const totalVotes = round.voteResults.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
      <div
        className="font-display font-bold text-primary-300"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        Vote for the Best Prompt!
      </div>

      <div className="grid gap-4 w-full max-w-4xl px-8">
        {round.prompts.map((prompt, i) => {
          const voteCount = round.voteResults.find(v => v.playerId === prompt.playerId)?.count ?? 0;

          return (
            <div
              key={prompt.playerId}
              className="bg-white/10 rounded-2xl p-6 flex items-center justify-between animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-2xl text-white">
                {prompt.revealed ? `"${prompt.text}"` : '???'}
              </div>
              <div className="font-display font-bold text-3xl text-primary-400 ml-6 shrink-0">
                {voteCount}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-white/50 text-xl font-body">
        Votes: {totalVotes} / {eligibleVoters}
      </div>

      <div className="text-white/30 text-lg font-body">
        Players are voting on their phones...
      </div>
    </div>
  );
}
