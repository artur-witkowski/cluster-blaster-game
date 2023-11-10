import { create } from 'zustand';
import { GAME_STATUSES } from '../game-with-server/types/shared';

type PlayerInLobby = {
  id: string;
  username: string;
  isMe?: boolean;
};

type LobbyStore = {
  username: string | null;
  setUsername: (username: string | null) => void;
  gameId: string | null;
  setGameId: (gameId: string | null) => void;
  gameStatus: keyof typeof GAME_STATUSES | null;
  setGameStatus: (gameStatus: keyof typeof GAME_STATUSES | null) => void;
  playersInLobby: PlayerInLobby[];
  addPlayerInLobby: (player: PlayerInLobby) => void;
  removePlayerInLobby: (playerId: string) => void;
  setPlayersInLobby: (players: PlayerInLobby[]) => void;
};

const initialState = {
  username: null,
  gameId: null,
  gameStatus: null,
  playersInLobby: [],
};

export const useLobbyStore = create<LobbyStore>()((set) => ({
  ...initialState,
  setUsername: (username) => set({ username }),
  setGameId: (gameId) => set({ gameId }),
  setGameStatus: (gameStatus) => set({ gameStatus }),
  addPlayerInLobby: (player) =>
    set((state) => ({
      playersInLobby: [...state.playersInLobby, player],
    })),
  removePlayerInLobby: (playerId) =>
    set((state) => ({
      playersInLobby: state.playersInLobby.filter(
        (player) => player.id !== playerId
      ),
    })),
  setPlayersInLobby: (players) => set({ playersInLobby: players }),
}));
