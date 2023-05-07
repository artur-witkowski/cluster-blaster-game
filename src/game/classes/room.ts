import { v4 as uuidv4 } from 'uuid';

import { RoomId } from '../types/room';
import { Map } from './map';
import { Renderable } from './renderable';
import { Door } from './door';
import { Coords, DoorPosition } from '../types/shared';
import { DOOR_POSITION } from '../constants/doors';

export class Room extends Renderable {
  id: RoomId;
  map: Map;
  coords: Coords;

  constructor(map: Map, coords?: Coords) {
    super();
    this.id = uuidv4() as RoomId;
    this.map = map;
    this.coords = coords || ({ x: 0, y: 0 } as Coords);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.map.renderSprite(ctx);
  }

  addDoors(doors: Door[]) {
    this.map.addDoors(doors);
  }

  hasDoorAt(coords: Coords): boolean {
    return this.map.doors.some(
      (door) => door.coords.x === coords.x && door.coords.y === coords.y
    );
  }

  static getNewRoomCoordsFromNewDoorPosition(
    coords: Coords,
    position: DoorPosition
  ): Coords {
    const newCoords = { x: coords.x, y: coords.y } as Coords;
    if (position === DOOR_POSITION.DOWN) {
      newCoords.y++;
    } else if (position === DOOR_POSITION.UP) {
      newCoords.y--;
    } else if (position === DOOR_POSITION.LEFT) {
      newCoords.x--;
    } else if (position === DOOR_POSITION.RIGHT) {
      newCoords.x++;
    }

    return newCoords;
  }

  static getEmptyRoom(): Room {
    const map = Map.getDefaultMap();

    return new Room(map);
  }
}
