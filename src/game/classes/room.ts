import { v4 as uuidv4 } from 'uuid';

import { RoomId } from '../types/room';
import { Map } from './map';
import { Renderable } from './renderable';
import { Door } from './door';
import { Coords } from '../types/shared';

export class Room extends Renderable {
  id: RoomId;
  map: Map;

  constructor(map: Map) {
    super();
    this.id = uuidv4() as RoomId;
    this.map = map;
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.map.renderSprite(ctx);
  }

  addDoors(doors: Door[]) {
    this.map.addDoors(doors);
  }

  hasRoomAt(coords: Coords): boolean {
    return this.map.doors.some(
      (door) => door.coords.x === coords.x && door.coords.y === coords.y
    );
  }

  static getEmptyRoom(): Room {
    const map = Map.getDefaultMap();

    return new Room(map);
  }
}
