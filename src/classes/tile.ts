import { DESTINATION_TILE_SIZE, ORIGINAL_TILE_SIZE } from '../constants/game';
import { Vector2 } from '../types/shared';
import { Sprite } from './sprite';

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
    imageSrc: string,
    hasCollision: boolean = false,
    width: number = DESTINATION_TILE_SIZE,
    height: number = DESTINATION_TILE_SIZE
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
      this.cropPosition.x * ORIGINAL_TILE_SIZE,
      this.cropPosition.y * ORIGINAL_TILE_SIZE,
      ORIGINAL_TILE_SIZE,
      ORIGINAL_TILE_SIZE,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {}
}
