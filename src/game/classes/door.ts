import { v4 as uuidv4 } from 'uuid';

import { DoorId } from '../types/door';
import { RoomId } from '../types/room';
import { Coords, DoorPosition, Vector2 } from '../types/shared';
import { Tile } from './tile';
import { DOOR_POSITION } from '../constants/doors';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { Item } from './item';
import { Player } from './player';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DESTINATION_TILE_SIZE,
} from '../constants/game';

export class Door {
  id: DoorId;
  coords: Coords = { x: 1, y: 1 } as Coords;
  sourceRoomId: RoomId;
  targetCoords: Coords = { x: 1, y: 1 } as Coords;
  targetRoomId: RoomId;
  doorPosition: DoorPosition;
  isBlocked: boolean = false;

  constructor(
    sourceRoomId: RoomId,
    targetRoomId: RoomId,
    doorPosition: DoorPosition,
    coords?: Coords,
    targetCoords?: Coords
  ) {
    this.id = uuidv4() as DoorId;
    this.sourceRoomId = sourceRoomId;
    this.targetRoomId = targetRoomId;
    this.doorPosition = doorPosition;
    if (targetCoords) {
      this.targetCoords = targetCoords;
    }
    if (coords) {
      this.coords = coords;
    } else {
      const [newCoords, newTargetCoords] = Door.getDoorCoords(doorPosition);
      if (newCoords && newTargetCoords) {
        this.coords = newCoords;
        this.targetCoords = newTargetCoords;
      }
    }
  }

  getDoorRenderElements(): [Tile[], Item[]] {
    const tiles: Tile[] = [];
    const items: Item[] = [];
    const { x, y } = this.coords;
    if (this.doorPosition === DOOR_POSITION.UP) {
      items.push(new Item('Door', x - 1, y, 0, 3, DungeonTileset, null, true));
      items.push(new Item('Door', x, y, 1, 3, DungeonTileset, null, false));
      items.push(new Item('Door', x + 1, y, 2, 3, DungeonTileset, null, true));
      tiles.push(new Tile(x, y, 1, 1, DungeonTileset, null, this.isBlocked));
    } else if (this.doorPosition === DOOR_POSITION.DOWN) {
      items.push(new Item('Door', x - 1, y, 0, 4, DungeonTileset, null, true));
      items.push(new Item('Door', x, y, 1, 4, DungeonTileset, null, false));
      items.push(new Item('Door', x + 1, y, 2, 4, DungeonTileset, null, true));
      tiles.push(new Tile(x, y, 1, 1, DungeonTileset, null, this.isBlocked));
    } else if (this.doorPosition === DOOR_POSITION.LEFT) {
      items.push(new Item('Door', x, y - 1, 3, 2, DungeonTileset, null, true));
      items.push(new Item('Door', x, y, 3, 3, DungeonTileset, null, false));
      items.push(new Item('Door', x, y + 1, 3, 4, DungeonTileset, null, true));
      tiles.push(new Tile(x, y, 1, 1, DungeonTileset, null, this.isBlocked));
    } else if (this.doorPosition === DOOR_POSITION.RIGHT) {
      items.push(new Item('Door', x, y - 1, 4, 2, DungeonTileset, null, true));
      items.push(new Item('Door', x, y, 4, 3, DungeonTileset, null, false));
      items.push(new Item('Door', x, y + 1, 4, 4, DungeonTileset, null, true));
      tiles.push(new Tile(x, y, 1, 1, DungeonTileset, null, this.isBlocked));
    }

    return [tiles, items];
  }

  isPlayerEnteredDoor(player: Player): boolean {
    const playerCoords = player.getCoords();

    if (playerCoords.x === this.coords.x && playerCoords.y === this.coords.y) {
      return true;
    }

    return false;
  }

  setBlocked() {
    this.isBlocked = true;
  }

  removeBlocked() {
    this.isBlocked = false;
  }

  static getDoorCoords(doorPosition: DoorPosition) {
    let coords: Coords;
    let targetCoords: Coords;
    if (doorPosition === DOOR_POSITION.RIGHT) {
      coords = {
        x: CANVAS_WIDTH / DESTINATION_TILE_SIZE - 1,
        y: 7,
      } as Coords;
      targetCoords = {
        x: 1,
        y: 7,
      } as Coords;
    } else if (doorPosition === DOOR_POSITION.LEFT) {
      coords = {
        x: 0,
        y: 7,
      } as Coords;
      targetCoords = {
        x: CANVAS_WIDTH / DESTINATION_TILE_SIZE - 2,
        y: 7,
      } as Coords;
    } else if (doorPosition === DOOR_POSITION.UP) {
      coords = {
        x: 10,
        y: 0,
      } as Coords;
      targetCoords = {
        x: 10,
        y: CANVAS_HEIGHT / DESTINATION_TILE_SIZE - 2,
      } as Coords;
    } else if (doorPosition === DOOR_POSITION.DOWN) {
      coords = {
        x: 10,
        y: CANVAS_HEIGHT / DESTINATION_TILE_SIZE - 1,
      } as Coords;
      targetCoords = {
        x: 10,
        y: 1,
      } as Coords;
    } else {
      return [null, null];
    }

    return [coords, targetCoords];
  }
}
