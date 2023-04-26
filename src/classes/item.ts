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
    hasCollision: boolean = true
  ) {
    super(x, y, cropPositionX, cropPositionY, imageSrc, hasCollision);
    this.name = name;
  }

  update() {}
}
