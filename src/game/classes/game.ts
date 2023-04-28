import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DESTINATION_TILE_SIZE,
  FPS_LIMIT,
} from '../constants/game';
import { KEYS } from '../constants/keyboard';
import { Player } from './player';
import { Stage } from './stage';
import { Renderable } from './renderable';

export class Game {
  keyPressed: Set<(typeof KEYS)[keyof typeof KEYS]> = new Set();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lag: number;
  private frameDuration: number;
  private startTime: number;
  private currentTime: number;
  private elapsedTime: number;
  private stage: Stage;
  private player: Player;
  private renderables: Renderable[] = [];
  private animationFrame: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.lag = 0;
    this.frameDuration = 1000 / FPS_LIMIT;
    this.startTime = Date.now();
    this.currentTime = 0;
    this.elapsedTime = 0;
    this.player = new Player(
      this,
      CANVAS_WIDTH / 2 - DESTINATION_TILE_SIZE / 2,
      CANVAS_HEIGHT / 2 - DESTINATION_TILE_SIZE / 2
    );
    this.stage = Stage.getThreeHorizontalRoomsStage(this.player);

    this.start();
  }

  start() {
    this.ctx.imageSmoothingEnabled = false;

    this.renderables.push(this.stage);
    this.renderables.push(this.player);
    this.renderables.push(this.stage.backdropRoomChangeAnimation);

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

  getStage() {
    return this.stage;
  }

  private loop() {
    this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));
    this.currentTime = Date.now();
    this.elapsedTime = this.currentTime - this.startTime;
    this.startTime = this.currentTime;
    this.lag += this.elapsedTime;

    while (this.lag >= this.frameDuration) {
      this.update();
      this.lag -= this.frameDuration;
    }

    this.render();
  }

  private update() {
    this.renderables.forEach((renderItem) => {
      this.ctx.save();
      if ('update' in renderItem && typeof renderItem.update === 'function') {
        renderItem.update(this.lag);
      }
      this.ctx.restore();
    });
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderables.forEach((sprite) => {
      sprite.render(this.ctx);
    });
  }

  private addPressedKey(key: (typeof KEYS)[keyof typeof KEYS]) {
    this.keyPressed.add(key);
  }

  private removePressedKey(key: (typeof KEYS)[keyof typeof KEYS]) {
    this.keyPressed.delete(key);
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
      case 'c':
        this.player.toggleDebugMode();
        this.stage
          .getCurrentRoom()
          ?.map.items.forEach((item) => item.toggleDebugMode());
        this.stage
          .getCurrentRoom()
          ?.map.tiles.forEach((tile) => tile.toggleDebugMode());
        break;
      case 'r':
        this.player = new Player(
          this,
          CANVAS_WIDTH / 2 - DESTINATION_TILE_SIZE / 2,
          CANVAS_HEIGHT / 2 - DESTINATION_TILE_SIZE / 2
        );
        this.stage = Stage.getThreeHorizontalRoomsStage(this.player);
        this.renderables = [];
        this.start();
        if (this.player.getDebugMode()) this.player.toggleDebugMode();
        break;
      case 'l':
        this.stop();
        break;
    }
  };

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
}
