import { CollisionBox, Vector2 } from '../types/shared';

export abstract class Sprite {
  position: Vector2 = { x: 0, y: 0 };
  width: number;
  height: number;
  collisionBox: CollisionBox;
  hasCollision: boolean = false;
  protected isDebugMode: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    collisionBox: CollisionBox | null = null,
    hasCollision: boolean = false
  ) {
    this.position.x = x;
    this.position.y = y;
    this.width = width;
    this.height = height;
    this.collisionBox = collisionBox || {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
    this.hasCollision = hasCollision;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderSprite(ctx);

    this.renderCollisionBox(ctx);
  }

  abstract renderSprite(ctx: CanvasRenderingContext2D): void;
  abstract update(lagOffset: number): void;

  renderCollisionBox(ctx: CanvasRenderingContext2D) {
    if (!this.isDebugMode || !this.hasCollision) return;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(
      this.position.x + this.collisionBox.x,
      this.position.y + this.collisionBox.y,
      this.collisionBox.width,
      this.collisionBox.height
    );
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
  }

  isCollidingWith(
    spriteNewPosition: Vector2,
    spriteCollisionBox: CollisionBox
  ): boolean {
    const spriteLeft = spriteNewPosition.x + spriteCollisionBox.x;
    const spriteRight = spriteLeft + spriteCollisionBox.width;
    const spriteTop = spriteNewPosition.y + spriteCollisionBox.y;
    const spriteBottom = spriteTop + spriteCollisionBox.height;

    const thisLeft = this.position.x + this.collisionBox.x;
    const thisRight = thisLeft + this.collisionBox.width;
    const thisTop = this.position.y + this.collisionBox.y;
    const thisBottom = thisTop + this.collisionBox.height;

    return (
      this.hasCollision &&
      spriteLeft < thisRight &&
      spriteRight > thisLeft &&
      spriteTop < thisBottom &&
      spriteBottom > thisTop
    );
  }

  toggleDebugMode() {
    this.isDebugMode = !this.isDebugMode;
  }
}
