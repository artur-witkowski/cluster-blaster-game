import { CANVAS_HEIGHT, CANVAS_WIDTH, FPS_LIMIT } from '../constants/game';
import { KEYS } from '../constants/keyboard';
import { Player } from './player';
import { Sprite } from './sprite';
import { Map } from './map';

export class Game {
  keyPressed: Set<(typeof KEYS)[keyof typeof KEYS]> = new Set();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lag: number;
  private frameDuration: number;
  private startTime: number;
  private currentTime: number;
  private elapsedTime: number;
  private map: Map;
  private player: Player;
  private sprites: Sprite[] = [];
  private animationFrame: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.lag = 0;
    this.frameDuration = 1000 / FPS_LIMIT;
    this.startTime = Date.now();
    this.currentTime = 0;
    this.elapsedTime = 0;
    this.map = new Map(CANVAS_WIDTH, CANVAS_HEIGHT);
    this.player = new Player(this.map, this, 100, 100);

    this.start();
  }

  start() {
    this.ctx.imageSmoothingEnabled = false;

    this.map.setDefaultMap();

    this.sprites.push(this.map);
    this.sprites.push(this.player);

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
    this.sprites.forEach((sprite) => {
      this.ctx.save();
      sprite.update(this.lag);
      this.ctx.restore();
    });
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sprites.forEach((sprite) => {
      this.ctx.save();
      sprite.render(this.ctx);
      this.ctx.restore();
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
        this.map.items.forEach((item) => item.toggleDebugMode());
        this.map.tiles.forEach((tile) => tile.toggleDebugMode());
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
