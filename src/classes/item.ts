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
    hasCollision: boolean = true
  ) {
    super(
      x,
      y,
      cropPositionX,
      cropPositionY,
      imageSrc,
      collisionBox,
      hasCollision
    );
    this.name = name;
  }

  update() {}
}
