import { Tile } from './tile';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { Sprite } from './sprite';
import { Item } from './item';
import { DESTINATION_TILE_SIZE } from '../constants/game';

export class Map extends Sprite {
  width: number;
  height: number;
  tiles: Tile[] = [];
  items: Item[] = [];

  constructor(width: number, height: number) {
    super(0, 0, width, height);
    this.width = width;
    this.height = height;
    this.getBasicMap();
  }

  getBasicMap() {
    const newTiles: Tile[] = [];
    for (let x = 0; x < this.width / DESTINATION_TILE_SIZE; x++) {
      for (let y = 0; y < this.height / DESTINATION_TILE_SIZE; y++) {
        newTiles.push(
          new Tile(
            x * DESTINATION_TILE_SIZE,
            y * DESTINATION_TILE_SIZE,
            1,
            1,
            DungeonTileset
          )
        );
      }
    }
    this.tiles = newTiles;

    this.createChest(12, 10);
    this.createChest(5, 4);
    this.createChest(5, 5);
    this.createChest(5, 6);
    this.createChest(8, 8);
    this.createChest(10, 8);
    this.createChest(13, 13);

    return newTiles;
  }

  createChest(x: number, y: number) {
    this.items.push(
      new Item(
        'Chest',
        x * DESTINATION_TILE_SIZE,
        y * DESTINATION_TILE_SIZE,
        4,
        5,
        DungeonTileset,
        {
          x: 5,
          y: 5,
          width: DESTINATION_TILE_SIZE - 10,
          height: DESTINATION_TILE_SIZE - 10,
        }
      )
    );
  }

  renderSprite(ctx: CanvasRenderingContext2D) {
    for (const tile of this.tiles) {
      tile.render(ctx);
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].render(ctx);
    }
  }

  update() {}
}
