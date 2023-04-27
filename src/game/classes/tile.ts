import { DESTINATION_TILE_SIZE, ORIGINAL_TILE_SIZE } from '../constants/game';
import { CollisionBox, Vector2 } from '../types/shared';
import { degreesToRadians } from '../../utils/math';
import { Sprite } from './sprite';

export class Tile extends Sprite {
  cropPosition: Vector2;
  image: HTMLImageElement;
  hasCollision: boolean;

  constructor(
    x: number,
    y: number,
    cropPositionX: number,
    cropPositionY: number,
    imageSrc: string,
    collisionBox: CollisionBox | null = null,
    hasCollision: boolean = false,
    rotation: number = 0,
    width: number = DESTINATION_TILE_SIZE,
    height: number = DESTINATION_TILE_SIZE
  ) {
    super(
      x * DESTINATION_TILE_SIZE,
      y * DESTINATION_TILE_SIZE,
      width,
      height,
      collisionBox
    );
    this.cropPosition = { x: cropPositionX, y: cropPositionY } as Vector2;
    this.image = new Image();
    this.image.src = imageSrc;
    this.hasCollision = hasCollision;
    this.rotation = rotation;
    this.width = width;
    this.height = height;
  }

  renderSprite(ctx: CanvasRenderingContext2D) {
    const angleInRadians = degreesToRadians(this.rotation);
    if (angleInRadians !== 0) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(
        this.position.x + DESTINATION_TILE_SIZE / 2,
        this.position.y + DESTINATION_TILE_SIZE / 2
      );
      ctx.rotate(angleInRadians);
      ctx.drawImage(
        this.image,
        this.cropPosition.x * ORIGINAL_TILE_SIZE,
        this.cropPosition.y * ORIGINAL_TILE_SIZE,
        ORIGINAL_TILE_SIZE,
        ORIGINAL_TILE_SIZE,
        -DESTINATION_TILE_SIZE / 2,
        -DESTINATION_TILE_SIZE / 2,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
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
  }

  update() {}
}
