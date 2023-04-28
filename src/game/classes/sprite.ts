import { DESTINATION_TILE_SIZE } from '../constants/game';
import { CollisionBox, Coords, Vector2 } from '../types/shared';
import { Renderable } from './renderable';

export abstract class Sprite extends Renderable {
  position: Vector2 = { x: 0, y: 0 } as Vector2;
  width: number;
  height: number;
  collisionBox: CollisionBox;
  /**
   * Rotation in radians
   */
  rotation: number;
  hasCollision: boolean = false;
  protected isDebugMode: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    collisionBox: CollisionBox | null = null,
    hasCollision: boolean = false,
    rotation: number = 0
  ) {
    super();
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
    this.rotation = rotation;
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

  setCoordsPosition(coords: Coords) {
    this.position.x = coords.x * DESTINATION_TILE_SIZE;
    this.position.y = coords.y * DESTINATION_TILE_SIZE;
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

  getDebugMode() {
    return this.isDebugMode;
  }
}
