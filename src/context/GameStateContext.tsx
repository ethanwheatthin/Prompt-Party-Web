import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import {
  GamePhase,
  type RoomState,
  type RoundData,
  type PlayerScore,
  type ServerMessage,
} from '../types/protocol';

// ── Constants ──

const PERFORMANCE_DURATION_MS = 60_000;
const LEADERBOARD_DURATION_MS = 8_000;
const ACTOR_REVEAL_DURATION_MS = 5_000;

// ── State shape ──

interface GameState {
  phase: GamePhase;
  serverUrl: string;
  token: string | null;
  hostPlayerId: string | null;
  roomState: RoomState | null;
  roundData: RoundData | null;
  winningPrompt: {
    promptPlayerId: string;
    promptText: string;
    votes: number;
    playerName: string;
    actorId: string;
    actorName: string;
    topic: string;
  } | null;
  scores: PlayerScore[];
  roundNumber: number;
  error: string | null;
}

const initialState: GameState = {
  phase: GamePhase.CONNECTING,
  serverUrl: '',
  token: null,
  hostPlayerId: null,
  roomState: null,
  roundData: null,
  winningPrompt: null,
  scores: [],
  roundNumber: 0,
  error: null,
};

// ── Actions ──

type Action =
  | { type: 'SET_CONNECTING'; serverUrl: string }
  | { type: 'AUTH_OK'; hostPlayerId: string; token: string; roomState: RoomState }
  | { type: 'ROOM_STATE_UPDATE'; roomState: RoomState }
  | { type: 'ROUND_STARTED'; roundData: RoundData }
  | { type: 'PROMPTS_UPDATE'; roundData: RoundData }
  | { type: 'VOTING_STARTED'; roundData: RoundData }
  | { type: 'VOTE_UPDATE'; roundData: RoundData }
  | { type: 'PROMPT_SELECTED'; payload: GameState['winningPrompt'] }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'UPDATE_SCORES'; scores: PlayerScore[] }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, phase: GamePhase.CONNECTING, serverUrl: action.serverUrl, error: null };

    case 'AUTH_OK':
      return {
        ...state,
        phase: GamePhase.LOBBY,
        token: action.token,
        hostPlayerId: action.hostPlayerId,
        roomState: action.roomState,
        error: null,
      };

    case 'ROOM_STATE_UPDATE':
      return { ...state, roomState: action.roomState };

    case 'ROUND_STARTED':
      return {
        ...state,
        phase: GamePhase.PROMPT_SUBMISSION,
        roundData: action.roundData,
        winningPrompt: null,
        roundNumber: state.roundNumber + 1,
      };

    case 'PROMPTS_UPDATE':
      return { ...state, roundData: action.roundData };

    case 'VOTING_STARTED':
      return { ...state, phase: GamePhase.VOTING, roundData: action.roundData };

    case 'VOTE_UPDATE':
      return { ...state, roundData: action.roundData };

    case 'PROMPT_SELECTED':
      return { ...state, phase: GamePhase.PERFORMANCE, winningPrompt: action.payload };

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'UPDATE_SCORES':
      return { ...state, scores: action.scores };

    case 'SET_ERROR':
      return { ...state, error: action.error };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ── Context ──

interface GameContextValue {
  state: GameState;
  createAndJoinRoom: (serverUrl: string, hostName: string) => Promise<void>;
  startGame: () => void;
  startNextRound: () => void;
  skipPhase: () => void;
  endGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider');
  return ctx;
}

// ── Provider ──

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const wsRef = useRef<WebSocket | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPhaseTimer = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  // Use a ref to always access latest state in callbacks without re-binding
  const stateRef = useRef(state);
  stateRef.current = state;

  const send = useCallback((msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // ── Score calculation ──

  const updateScoresAfterRound = useCallback((winnerPlayerId: string) => {
    const current = stateRef.current;
    const players = current.roomState?.players.filter(p => !p.isHost) ?? [];
    const prev = current.scores;

    const updated: PlayerScore[] = players.map(p => {
      const existing = prev.find(s => s.playerId === p.id);
      const oldScore = existing?.score ?? 0;
      const delta = p.id === winnerPlayerId ? 100 : 0;
      return { playerId: p.id, name: p.name, score: oldScore + delta, delta };
    });

    updated.sort((a, b) => b.score - a.score);
    dispatch({ type: 'UPDATE_SCORES', scores: updated });
  }, []);

  // ── Phase progression (client-side timers) ──

  const advanceToLeaderboard = useCallback(() => {
    clearPhaseTimer();
    dispatch({ type: 'SET_PHASE', phase: GamePhase.LEADERBOARD });

    phaseTimerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_PHASE', phase: GamePhase.ACTOR_REVEAL });

      phaseTimerRef.current = setTimeout(() => {
        // Auto-start next round
        send({ type: 'host_action', payload: { action: 'start_round' } });
      }, ACTOR_REVEAL_DURATION_MS);
    }, LEADERBOARD_DURATION_MS);
  }, [clearPhaseTimer, send]);

  // ── WebSocket message handler ──

  const handleMessage = useCallback((msg: ServerMessage) => {
    switch (msg.type) {
      case 'auth_ok':
        // Handled in createAndJoinRoom
        break;

      case 'room_state':
        dispatch({ type: 'ROOM_STATE_UPDATE', roomState: msg.payload });
        break;

      case 'round_started': {
        const rd: RoundData = {
          roundId: msg.payload.roundId,
          actorId: msg.payload.actorId,
          topic: msg.payload.topic,
          startedAt: msg.payload.startedAt,
          minCutoffAt: msg.payload.minCutoffAt,
          maxEndAt: msg.payload.maxEndAt,
          prompts: [],
          allPromptsSubmitted: false,
          voteResults: [],
        };
        dispatch({ type: 'ROUND_STARTED', roundData: rd });
        break;
      }

      case 'prompts_update':
        dispatch({ type: 'PROMPTS_UPDATE', roundData: msg.payload });
        break;

      case 'voting_started':
        dispatch({ type: 'VOTING_STARTED', roundData: msg.payload });
        break;

      case 'vote_update':
        dispatch({ type: 'VOTE_UPDATE', roundData: msg.payload });
        break;

      case 'prompt_selected': {
        clearPhaseTimer();
        dispatch({ type: 'PROMPT_SELECTED', payload: msg.payload });
        updateScoresAfterRound(msg.payload.promptPlayerId);

        // Performance phase timer -> leaderboard
        phaseTimerRef.current = setTimeout(() => {
          advanceToLeaderboard();
        }, PERFORMANCE_DURATION_MS);
        break;
      }

      case 'error':
        dispatch({ type: 'SET_ERROR', error: msg.payload.error });
        break;

      case 'auth_error':
        dispatch({ type: 'SET_ERROR', error: msg.payload.error });
        break;
    }
  }, [clearPhaseTimer, updateScoresAfterRound, advanceToLeaderboard]);

  // ── Public actions ──

  const createAndJoinRoom = useCallback(async (serverUrl: string, hostName: string) => {
    dispatch({ type: 'SET_CONNECTING', serverUrl });

    // Normalize URL: strip trailing slash
    const base = serverUrl.replace(/\/+$/, '');

    // 1. Create the room via REST
    const res = await fetch(`${base}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Failed to create room' }));
      dispatch({ type: 'SET_ERROR', error: body.error ?? 'Failed to create room' });
      return;
    }

    const data = await res.json();
    const token: string = data.token;

    // 2. Open WebSocket
    const wsUrl = base.replace(/^http/, 'ws') + '/ws';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', payload: { token } }));
    };

    ws.onmessage = (ev) => {
      try {
        const msg: ServerMessage = JSON.parse(ev.data);

        // Handle initial auth_ok specially to set state
        if (msg.type === 'auth_ok') {
          dispatch({
            type: 'AUTH_OK',
            hostPlayerId: msg.payload.playerId,
            token,
            roomState: msg.payload.roomState,
          });
          return;
        }

        handleMessage(msg);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    ws.onerror = () => {
      dispatch({ type: 'SET_ERROR', error: 'WebSocket connection failed' });
    };
  }, [handleMessage]);

  const startGame = useCallback(() => {
    send({ type: 'host_action', payload: { action: 'start_round' } });
  }, [send]);

  const startNextRound = useCallback(() => {
    clearPhaseTimer();
    send({ type: 'host_action', payload: { action: 'start_round' } });
  }, [send, clearPhaseTimer]);

  const skipPhase = useCallback(() => {
    clearPhaseTimer();
    const current = stateRef.current.phase;

    switch (current) {
      case GamePhase.PROMPT_SUBMISSION:
        // Can't skip — waiting on players
        break;
      case GamePhase.VOTING:
        // Can't skip — waiting on players
        break;
      case GamePhase.PERFORMANCE:
        advanceToLeaderboard();
        break;
      case GamePhase.LEADERBOARD:
        dispatch({ type: 'SET_PHASE', phase: GamePhase.ACTOR_REVEAL });
        phaseTimerRef.current = setTimeout(() => {
          send({ type: 'host_action', payload: { action: 'start_round' } });
        }, ACTOR_REVEAL_DURATION_MS);
        break;
      case GamePhase.ACTOR_REVEAL:
        send({ type: 'host_action', payload: { action: 'start_round' } });
        break;
    }
  }, [clearPhaseTimer, advanceToLeaderboard, send]);

  const endGame = useCallback(() => {
    clearPhaseTimer();
    wsRef.current?.close();
    wsRef.current = null;
    dispatch({ type: 'RESET' });
  }, [clearPhaseTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPhaseTimer();
      wsRef.current?.close();
    };
  }, [clearPhaseTimer]);

  const value: GameContextValue = {
    state,
    createAndJoinRoom,
    startGame,
    startNextRound,
    skipPhase,
    endGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
