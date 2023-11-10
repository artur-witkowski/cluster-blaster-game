import { io } from 'socket.io-client';
import { EVENTS_TO_CLIENT, EVENTS_TO_SERVER } from './constants';
import { gameInstance } from '../../components/gameCanvas/gameInstance';
import { Vector2 } from '../types/shared';

const socket = io(import.meta.env.VITE_WS_SERVER_URL, {
  secure: true,
  transports: ['websocket', 'polling', 'flashsocket'],
});

socket.on('connect', () => {
  console.log('connected');
});

type PlayerPayload = {
  id: string;
  position: Vector2 | null;
  velocity: Vector2;
  direction: Vector2;
};

export const sendPlayerData = (playerPayload: PlayerPayload) => {
  socket.emit(EVENTS_TO_SERVER.PLAYER.UPDATE_DATA, playerPayload);
};

socket.on(EVENTS_TO_CLIENT.GAME.UPDATE_GAME_DATA, (data) => {
  gameInstance.handleUpdateFromServer(data);
});
