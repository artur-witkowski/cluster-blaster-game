import { Tile } from './tile';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { Sprite } from './sprite';
import { Item } from './item';
import { DESTINATION_TILE_SIZE } from '../constants/game';
import { Vector2 } from '../types/shared';
import { setBasicMap, setMapBorders } from '../maps/utils';

export class Map extends Sprite {
  width: number;
  height: number;
  tiles: Tile[] = [];
  items: Item[] = [];

  constructor(width: number, height: number) {
    super(0, 0, width, height);
    this.width = width;
    this.height = height;
  }

  setDefaultMap() {
    setBasicMap(this);
    setMapBorders(this);

    this.createChest(12, 10);
    this.createChest(5, 4);
    this.createChest(5, 6);
    this.createChest(8, 8);
    this.createChest(10, 8);
    this.createChest(13, 13);
  }

  createChest(x: number, y: number) {
    this.items.push(
      new Item('Chest', x, y, 4, 5, DungeonTileset, {
        x: 5,
        y: 5,
        width: DESTINATION_TILE_SIZE - 10,
        height: DESTINATION_TILE_SIZE - 10,
      })
    );
  }

  setTile(tile: Tile) {
    const existingTile = this.getTileAtPosition(tile.position);
    if (existingTile) {
      this.tiles = this.tiles.filter((t) => t !== existingTile);
    }
    this.tiles.push(tile);
  }

  private getTileAtPosition(position: Vector2): Tile | undefined {
    return this.tiles.find((tile) => {
      return tile.position.x === position.x && tile.position.y === position.y;
    });
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
