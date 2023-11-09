import { Game as GameWithServer } from '../../game-with-server/classes/game';
import { Player } from '../../game-with-server/classes/player';

const myPlayer = new Player(Math.random().toString());
export const gameInstance = new GameWithServer();
gameInstance.setMyPlayer(myPlayer);