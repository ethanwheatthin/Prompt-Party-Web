import { useGameState } from '../context/GameStateContext';

const CARD_COLORS = ['bg-white', 'bg-[#5ef8f8]', 'bg-white', 'bg-white', 'bg-[#5ef8f8]'];
const CARD_ROTATIONS = ['rotate-[-1deg]', 'rotate-[0.5deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[0deg]'];
const VOTE_COLORS = ['bg-[#ff66b2]', 'bg-[#006666]', 'bg-[#666600]', 'bg-[#ff66b2]', 'bg-[#006666]'];

export function VotingPhase() {
  const { state } = useGameState();
  const round = state.roundData;
  const players = state.roomState?.players ?? [];

  if (!round) return null;

  const eligibleVoters = players.filter(p => !p.isHost && p.id !== round.actorId).length;
  const totalVotes = round.voteResults.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="flex flex-col items-center h-full gap-6 animate-fade-in px-4 py-6 overflow-y-auto">
      {/* Topic header */}
      <div className="bg-[#fbfb62] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-4xl w-full rotate-[-0.5deg]">
        <div className="inline-block bg-[#006666] text-white border-[3px] border-black px-3 py-1 font-black text-xs uppercase mb-3">
          The Prompt
        </div>
        <div
          className="font-black italic uppercase tracking-[-0.05em] text-black leading-tight"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          {round.topic}
        </div>
      </div>

      {/* Prompt cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {round.prompts.map((prompt, i) => {
          const voteCount = round.voteResults.find(v => v.playerId === prompt.playerId)?.count ?? 0;
          const bgColor = CARD_COLORS[i % CARD_COLORS.length];
          const rotation = CARD_ROTATIONS[i % CARD_ROTATIONS.length];
          const voteBg = VOTE_COLORS[i % VOTE_COLORS.length];

          return (
            <div
              key={prompt.playerId}
              className={`${bgColor} border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 ${rotation} animate-slide-up transition-transform hover:rotate-0`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="inline-block bg-white border-[3px] border-black px-2 py-0.5 font-black text-xs uppercase mb-3">
                Player {String(i + 1).padStart(2, '0')}
              </div>
              <div className="font-bold text-lg text-black mb-4 min-h-[3rem]">
                {prompt.revealed ? `"${prompt.text}"` : '???'}
              </div>
              <div className="flex items-center justify-between">
                <div className={`${voteBg} text-white border-[3px] border-black px-4 py-1.5 font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all duration-75`}>
                  Vote
                </div>
                <div className="font-black text-2xl">{voteCount}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vote count */}
      <div className="text-black/50 text-xl font-bold">
        Votes: {totalVotes} / {eligibleVoters}
      </div>

      <div className="text-black/30 text-lg font-bold">
        Players are voting on their phones...
      </div>
    </div>
  );
}
