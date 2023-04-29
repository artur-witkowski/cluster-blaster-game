import { Tile } from './tile';
import { Sprite } from './sprite';
import { Item } from './item';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DESTINATION_TILE_SIZE,
} from '../constants/game';
import { Coords, Vector2 } from '../types/shared';
import { setGroundMap as setMapGround, setMapWalls } from '../maps/utils';
import { Door } from './door';
import { Chest } from './chest';

export class Map extends Sprite {
  width: number;
  height: number;
  tiles: Tile[] = [];
  items: Item[] = [];
  doors: Door[] = [];

  constructor(width: number, height: number) {
    super(0, 0, width, height);
    this.width = width;
    this.height = height;
  }

  setDefaultMap() {
    setMapGround(this);
    setMapWalls(this);

    for (let i = 0; i < 3; i++) {
      this.createChest(this.getRandomEmptyItemCoords());
    }
  }

  resetMap() {
    this.tiles = [];
    this.items = [];
  }

  removeDoors() {
    this.doors = [];
  }

  addDoors(doors: Door[]) {
    this.doors = doors;
    doors.forEach((door) => {
      const [doorTiles, doorItems] = door.getDoorRenderElements();
      doorTiles.forEach((doorTile) => {
        this.setTile(doorTile);
      });

      doorItems.forEach((doorItem) => {
        this.setItem(doorItem);
      });
    });
  }

  createChest(coords: Coords) {
    this.setItem(new Chest(coords.x, coords.y));
  }

  setItem(item: Item) {
    const existingItem = this.items.find((i) => {
      return (
        i.position.x === item.position.x && i.position.y === item.position.y
      );
    });
    if (existingItem) {
      this.items = this.items.filter((i) => i !== existingItem);
    }
    this.items.push(item);
  }

  setTile(tile: Tile) {
    const existingTile = this.getTileAtPosition(tile.position);
    if (existingTile) {
      this.tiles = this.tiles.filter((t) => t !== existingTile);
    }
    this.tiles.push(tile);
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

  private getTileAtPosition(position: Vector2): Tile | undefined {
    return this.tiles.find((tile) => {
      return tile.position.x === position.x && tile.position.y === position.y;
    });
  }

  private getTileAtCoords(coords: Coords): Tile | undefined {
    const x = Math.floor(coords.x * DESTINATION_TILE_SIZE);
    const y = Math.floor(coords.y * DESTINATION_TILE_SIZE);
    return this.getTileAtPosition({ x, y } as Vector2);
  }

  private getRandomEmptyItemCoords(): Coords {
    const x = Math.floor(Math.random() * (this.width / DESTINATION_TILE_SIZE));
    const y = Math.floor(Math.random() * (this.height / DESTINATION_TILE_SIZE));

    const existingCollidingTile = this.getTileAtCoords({ x, y } as Coords);
    const doesExistingTileHasCollision = existingCollidingTile?.hasCollision;
    const existingItem = this.items.find((i) => {
      return (
        i.position.x === x * DESTINATION_TILE_SIZE &&
        i.position.y === y * DESTINATION_TILE_SIZE
      );
    });
    if (!existingItem && !doesExistingTileHasCollision) {
      return { x, y } as Coords;
    }

    return this.getRandomEmptyItemCoords();
  }

  static getDefaultMap(): Map {
    const map = new Map(CANVAS_WIDTH, CANVAS_HEIGHT);
    map.setDefaultMap();
    return map;
  }
}
