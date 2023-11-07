import { io } from 'socket.io-client';
import { EVENTS_TO_CLIENT, EVENTS_TO_SERVER } from './constants';
import { gameInstance } from '../../components/gameCanvas/gameInstance';

const WS_URL = 'http://localhost:5005/';
const socket = io(WS_URL);

socket.on('connect', () => {
  console.log('connected');
});

type PlayerPayload = {
  id: string;
  x: number;
  y: number;
};

export const sendPlayerData = (playerPayload: PlayerPayload) => {
  socket.emit(EVENTS_TO_SERVER.PLAYER.UPDATE_DATA, playerPayload);
};

socket.on(EVENTS_TO_CLIENT.GAME.UPDATE_GAME_DATA, (data) => {
  gameInstance.handleUpdateFromServer(data);
});
