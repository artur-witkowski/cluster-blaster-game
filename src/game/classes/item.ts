import { CollisionBox } from '../types/shared';
import { Tile } from './tile';

export class Item extends Tile {
  name: string;

  constructor(
    name: string,
    x: number,
    y: number,
    cropPositionX: number,
    cropPositionY: number,
    imageSrc: string,
    collisionBox: CollisionBox | null = null,
    hasCollision: boolean = true,
    rotation: number = 0
  ) {
    super(
      x,
      y,
      cropPositionX,
      cropPositionY,
      imageSrc,
      collisionBox,
      hasCollision,
      rotation
    );
    this.name = name;
  }

  update() {}
}
