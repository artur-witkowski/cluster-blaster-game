import { Vector2 } from '../types/shared';

export abstract class Sprite {
  position: Vector2 = { x: 0, y: 0 };
  width: number;
  height: number;
  protected isDebugMode: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.position.x = x;
    this.position.y = y;
    this.width = width;
    this.height = height;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderSprite(ctx);

    this.renderCollisionBox(ctx);
  }

  abstract renderSprite(ctx: CanvasRenderingContext2D): void;
  abstract update(lagOffset: number): void;

  renderCollisionBox(ctx: CanvasRenderingContext2D) {
    if (!this.isDebugMode) return;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
  }

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode;
  }
}
