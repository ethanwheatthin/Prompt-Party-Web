import { useGameState } from '../context/GameStateContext';

export function LeaderboardPhase() {
  const { state } = useGameState();
  const scores = state.scores;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in px-4">
      {/* Party Results header */}
      <div className="bg-[#fbfb62] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-10 py-4 rotate-[-1deg]">
        <h2 className="font-black italic uppercase tracking-[-0.05em] text-[#ff66b2]" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          Party Results
        </h2>
      </div>

      {/* Rankings container */}
      <div className="bg-[#5ef8f8] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-3xl rotate-[0.5deg]">
        <h3 className="font-black italic text-xl uppercase mb-4">Rankings</h3>

        <div className="flex flex-col gap-3">
          {scores.map((entry, i) => (
            <div
              key={entry.playerId}
              className="bg-white border-[3px] border-black px-6 py-4 flex items-center justify-between animate-slide-up shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`font-black text-3xl ${
                  i === 0 ? 'text-[#ff66b2]' : i === 1 ? 'text-black/60' : i === 2 ? 'text-amber-700' : 'text-black/30'
                }`}>
                  {i + 1}
                </div>
                <div className="font-black text-2xl uppercase">{entry.name}</div>
              </div>
              <div className="flex items-center gap-4">
                {entry.delta > 0 && (
                  <div className="bg-green-500 border-[3px] border-black px-3 py-1 font-black text-sm text-black">
                    +{entry.delta}
                  </div>
                )}
                <div className="font-black text-3xl">{entry.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {scores.length === 0 && (
        <div className="text-black/40 text-xl font-bold">No scores yet</div>
      )}
    </div>
  );
}
