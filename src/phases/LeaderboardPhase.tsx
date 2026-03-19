import { useGameState } from '../context/GameStateContext';

export function LeaderboardPhase() {
  const { state } = useGameState();
  const scores = state.scores;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
      <div
        className="font-display font-bold text-primary-300"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
      >
        Leaderboard
      </div>

      <div className="w-full max-w-3xl px-8 flex flex-col gap-3">
        {scores.map((entry, i) => (
          <div
            key={entry.playerId}
            className="flex items-center justify-between bg-white/10 rounded-2xl px-8 py-5 animate-slide-up"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-center gap-6">
              <div
                className={`font-display font-bold text-4xl ${
                  i === 0
                    ? 'text-accent-400'
                    : i === 1
                      ? 'text-gray-300'
                      : i === 2
                        ? 'text-amber-700'
                        : 'text-white/40'
                }`}
              >
                #{i + 1}
              </div>
              <div className="font-display font-semibold text-3xl text-white">
                {entry.name}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {entry.delta > 0 && (
                <div className="text-green-400 font-display font-bold text-2xl">
                  +{entry.delta}
                </div>
              )}
              <div className="font-display font-bold text-4xl text-white">
                {entry.score}
              </div>
            </div>
          </div>
        ))}
      </div>

      {scores.length === 0 && (
        <div className="text-white/40 text-xl font-body">No scores yet</div>
      )}
    </div>
  );
}
