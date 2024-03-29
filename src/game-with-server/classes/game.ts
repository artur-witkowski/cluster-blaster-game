import { useLobbyStore } from '../../stores/lobbyStore';
import { FRAME_DURATION } from '../constants/game';
import { KEYS } from '../constants/keyboard';
import { sendPlayerData } from '../server/server';
import { Vector2 } from '../types/shared';
import { Player } from './player';

export class Game {
  keyPressed: Set<(typeof KEYS)[keyof typeof KEYS]> = new Set();
  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | undefined;
  private animationFrame: number = 0;

  private lastUpdateTimestamp: number;
  private lag: number = 0;

  private myPlayer: Player | null = null;
  private allyPlayers: Player[] = [];

  constructor() {
    this.lastUpdateTimestamp = Date.now();
  }

  start() {
    if (!this.ctx) {
      throw Error('Canvas context not set');
    }

    this.ctx.imageSmoothingEnabled = false;

    window.addEventListener('keydown', this.handleKeyboardKeydown);
    window.addEventListener('keyup', this.handleKeyboardKeyup);

    console.log('Game started!');

    return this.loop();
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('keyup', this.handleKeyboardKeyup);
    window.removeEventListener('keydown', this.handleKeyboardKeydown);
    console.log('Game stopped');
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  private loop() {
    this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));

    const currentTime = Date.now();
    const elapsedTime = currentTime - this.lastUpdateTimestamp;
    this.lastUpdateTimestamp = currentTime;
    this.lag += elapsedTime;

    while (this.lag >= FRAME_DURATION) {
      this.update();
      this.lag -= FRAME_DURATION;
      const myPlayerVelocity = this.myPlayer?.getVelocity();
      if (
        this.myPlayer &&
        myPlayerVelocity &&
        (myPlayerVelocity.x !== 0 || myPlayerVelocity.y !== 0)
      ) {
        sendPlayerData({
          id: this.myPlayer?.id || '',
          gameId: useLobbyStore.getState().gameId || '',
          position: this.myPlayer.getPosition(),
          velocity: this.myPlayer.getVelocity(),
          direction: this.myPlayer.getDirection(),
        });
      }
    }

    this.render();
  }

  private update() {
    this.myPlayer?.update(this.keyPressed);
    this.allyPlayers.forEach((player) => {
      player.update();
    });
  }

  private render() {
    if (!this.ctx || !this.canvas) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.allyPlayers.forEach((player) => {
      player.render(this.ctx!);
    });
    this.myPlayer?.render(this.ctx);
  }

  private handleKeyboardKeydown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'down':
      case 'arrowdown':
      case 's':
        this.addPressedKey(KEYS.DOWN);
        break;
      case 'up':
      case 'arrowup':
      case 'w':
        this.addPressedKey(KEYS.UP);
        break;
      case 'left':
      case 'arrowleft':
      case 'a':
        this.addPressedKey(KEYS.LEFT);
        break;
      case 'right':
      case 'arrowright':
      case 'd':
        this.addPressedKey(KEYS.RIGHT);
        break;
    }
  };

  private addPressedKey(key: (typeof KEYS)[keyof typeof KEYS]) {
    this.keyPressed.add(key);
  }

  private removePressedKey(key: (typeof KEYS)[keyof typeof KEYS]) {
    this.keyPressed.delete(key);
  }

  private handleKeyboardKeyup = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'down':
      case 'arrowdown':
      case 's':
        this.removePressedKey(KEYS.DOWN);
        break;
      case 'up':
      case 'arrowup':
      case 'w':
        this.removePressedKey(KEYS.UP);
        break;
      case 'left':
      case 'arrowleft':
      case 'a':
        this.removePressedKey(KEYS.LEFT);
        break;
      case 'right':
      case 'arrowright':
      case 'd':
        this.removePressedKey(KEYS.RIGHT);
        break;
    }
  };

  addAllyPlayer(player: Player) {
    this.allyPlayers.push(player);
  }

  getAllyPlayers() {
    return this.allyPlayers;
  }

  setMyPlayer(player: Player) {
    this.myPlayer = player;
  }

  getMyPlayer() {
    return this.myPlayer;
  }

  handleUpdateFromServer(data: {
    players: {
      id: string;
      username: string;
      position: Vector2;
      velocity: Vector2;
      direction: Vector2;
    }[];
  }) {
    data.players.forEach((playerData) => {
      const player = this.allyPlayers.find((p) => p.id === playerData.id);
      if (player) {
        player.setPlayerDataFromServer({
          position: playerData.position,
          velocity: playerData.velocity,
          direction: playerData.direction,
        });
      }
    });

    this.allyPlayers = this.allyPlayers.filter((player) =>
      data.players.find((p) => p.id === player.id)
    );
  }
}
