import { Vector2 } from '../types/shared';
import { Sprite } from './sprite';

export const TILE_SIZE = 50;

export class Tile extends Sprite {
  cropPosition: Vector2;
  width: number;
  height: number;
  image: HTMLImageElement;
  hasCollision: boolean = false;

  constructor(
    x: number,
    y: number,
    cropPositionX: number,
    cropPositionY: number,
    width: number,
    height: number,
    imageSrc: string,
    hasCollision: boolean = false
  ) {
    super(x, y, width, height);
    this.cropPosition = { x: cropPositionX, y: cropPositionY };
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageSrc;
    this.hasCollision = hasCollision;
  }

  renderSprite(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.cropPosition.x * this.width,
      this.cropPosition.y * this.height,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  update() {}
}
