import { Tile, TILE_SIZE } from './tile';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { Sprite } from './sprite';

export class Map extends Sprite {
  width: number;
  height: number;
  tiles: Tile[][];

  constructor(width: number, height: number) {
    super(0, 0, width, height);
    this.width = width;
    this.height = height;
    this.tiles = this.getBasicMap();
  }

  getBasicMap() {
    const newTiles: Tile[][] = [];
    for (let x = 0; x < this.width / TILE_SIZE; x++) {
      newTiles[x] = [];
      for (let y = 0; y < this.width / TILE_SIZE; y++) {
        newTiles[x][y] = new Tile(
          x * TILE_SIZE,
          y * TILE_SIZE,
          1,
          1,
          16,
          16,
          DungeonTileset
        );
      }
    }

    return newTiles;
  }

  renderSprite(ctx: CanvasRenderingContext2D) {
    for (let x = 0; x < this.width / TILE_SIZE; x++) {
      for (let y = 0; y < this.width / TILE_SIZE; y++) {
        this.tiles[x][y].renderSprite(ctx);
      }
    }
  }

  update() {}
}
