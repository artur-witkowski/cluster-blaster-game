import { io } from 'socket.io-client';
import { gameInstance } from '../../components/gameCanvas/gameInstance';
import { EVENTS_TO_CLIENT, EVENTS_TO_SERVER } from './constants';
import { GAME_STATUSES, Vector2 } from '../types/shared';
import { useLobbyStore } from '../../stores/lobbyStore';
import { Player } from '../classes/player';

const socket = io(import.meta.env.VITE_WS_SERVER_URL, {
  transports: ['websocket', 'polling', 'flashsocket'],
});

socket.on('connect', () => {
  console.log('connected');
});

socket.on('disconnect', () => {
  window.location.reload();
});

/* ----- UPDATE PLAYER DATA ----- */
type PlayerPayload = {
  id: string;
  gameId: string;
  position: Vector2 | null;
  velocity: Vector2;
  direction: Vector2;
};
export const sendPlayerData = (playerPayload: PlayerPayload) => {
  socket.emit(EVENTS_TO_SERVER.PLAYER.UPDATE_DATA, playerPayload);
};

/* ----- CREATE NEW LOBBY ----- */
type NewLobbyPayload = {
  username: string;
};
export const createNewLobby = (newLobbyPayload: NewLobbyPayload) => {
  socket.emit(EVENTS_TO_SERVER.GAME.CREATE_NEW_LOBBY, newLobbyPayload);
};

/* ----- JOIN LOBBY ----- */
type JoinLobbyPayload = {
  gameId: string;
  username: string;
};
export const joinLobby = (joinLobbyPayload: JoinLobbyPayload) => {
  socket.emit(EVENTS_TO_SERVER.GAME.JOIN_EXISTING_LOBBY, joinLobbyPayload);
};

/* ----- START GAME ----- */
type StartGamePayload = {
  gameId: string;
};
export const startGame = (startGamePayload: StartGamePayload) => {
  socket.emit(EVENTS_TO_SERVER.GAME.START, startGamePayload);
};

/**
 * EVENTS FROM SERVER
 */

/* ----- NEW LOBBY CREATED ----- */
type NewLobbyCreatedPayload = {
  gameId: string;
};
socket.on(
  EVENTS_TO_CLIENT.GAME.NEW_LOBBY_CREATED,
  (data: NewLobbyCreatedPayload) => {
    const lobbyStoreState = useLobbyStore.getState();

    lobbyStoreState.addPlayerInLobby({
      id: socket.id,
      username: lobbyStoreState.username || 'Player',
      isMe: true,
    });
    lobbyStoreState.setGameId(data.gameId);
    lobbyStoreState.setGameStatus(GAME_STATUSES.LOBBY);
  }
);

/* ----- JOIN LOBBY SUCCESS ----- */
type JoinLobbySuccessPayload = {
  gameId: string;
  players: {
    id: string;
    username: string;
  }[];
};
socket.on(
  EVENTS_TO_CLIENT.GAME.JOIN_LOBBY_SUCCESS,
  (data: JoinLobbySuccessPayload) => {
    const lobbyStoreState = useLobbyStore.getState();

    lobbyStoreState.setGameId(data.gameId);
    lobbyStoreState.setGameStatus(GAME_STATUSES.LOBBY);
    lobbyStoreState.setPlayersInLobby(
      data.players.map((player) => ({
        id: player.id,
        username: player.username,
        isMe: player.id === socket.id,
      }))
    );
  }
);

/* ----- PLAYER JOINED ----- */
type PlayerJoinedPayload = {
  players: {
    id: string;
    username: string;
  }[];
};
socket.on(
  EVENTS_TO_CLIENT.GAME.PLAYER_JOINED_THE_LOBBY,
  (data: PlayerJoinedPayload) => {
    const lobbyStoreState = useLobbyStore.getState();

    lobbyStoreState.setPlayersInLobby(
      data.players.map((player) => ({
        id: player.id,
        username: player.username,
        isMe: player.id === socket.id,
      }))
    );
  }
);

/* ----- GAME STARTED ----- */
socket.on(EVENTS_TO_CLIENT.GAME.GAME_STARTED, () => {
  const lobbyStoreState = useLobbyStore.getState();

  lobbyStoreState.playersInLobby.forEach((player) => {
    if (player.isMe) {
      gameInstance.setMyPlayer(new Player(player.id, player.username));
    } else {
      gameInstance.addAllyPlayer(new Player(player.id, player.username));
    }
  });

  lobbyStoreState.setGameStatus(GAME_STATUSES.IN_PROGRESS);
});

/* ----- UPDATE GAME DATA ----- */
socket.on(EVENTS_TO_CLIENT.GAME.UPDATE_GAME_DATA, (data) => {
  gameInstance.handleUpdateFromServer(data);
});
