import { DESTINATION_TILE_SIZE } from '../constants/game';
import { CollisionBox, Vector2 } from '../types/shared';
import { Sprite } from './sprite';
import { renderTileOnCanvas } from '../../utils/render';

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
    renderTileOnCanvas(ctx, this);
  }

  update() {}
}
