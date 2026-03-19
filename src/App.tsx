import { useGameState } from './context/GameStateContext';
import { GamePhase } from './types/protocol';
import { PhaseTransition } from './components/PhaseTransition';
import { HostControls } from './components/HostControls';
import { LobbyPhase } from './phases/LobbyPhase';
import { PromptPhase } from './phases/PromptPhase';
import { VotingPhase } from './phases/VotingPhase';
import { PerformancePhase } from './phases/PerformancePhase';
import { LeaderboardPhase } from './phases/LeaderboardPhase';
import { ActorRevealPhase } from './phases/ActorRevealPhase';

const phaseComponents: Record<GamePhase, React.FC> = {
  [GamePhase.CONNECTING]: LobbyPhase,
  [GamePhase.LOBBY]: LobbyPhase,
  [GamePhase.PROMPT_SUBMISSION]: PromptPhase,
  [GamePhase.VOTING]: VotingPhase,
  [GamePhase.PERFORMANCE]: PerformancePhase,
  [GamePhase.LEADERBOARD]: LeaderboardPhase,
  [GamePhase.ACTOR_REVEAL]: ActorRevealPhase,
};

export default function App() {
  const { state } = useGameState();
  const PhaseComponent = phaseComponents[state.phase];

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col">
      <PhaseTransition phaseKey={state.phase}>
        <PhaseComponent />
      </PhaseTransition>
      <HostControls />
    </div>
  );
}
