import { v4 as uuidv4 } from 'uuid';

import { StageId } from '../types/stage';
import { Room } from './room';
import { RoomId } from '../types/room';
import { Door } from './door';
import { Coords, DoorPosition } from '../types/shared';
import { Renderable } from './renderable';
import { DOOR_POSITION } from '../constants/doors';
import { Player } from './player';
import { BackdropRoomChangeAnimation } from './backdropRoomChangeAnimation';
import { randomInt } from '../../utils/random';

const DOOR_POSITION_MAP = {
  1: DOOR_POSITION.DOWN,
  2: DOOR_POSITION.LEFT,
  3: DOOR_POSITION.RIGHT,
  4: DOOR_POSITION.UP,
} as const;

const DOOR_POSITION_OPPOSITE = {
  [DOOR_POSITION.DOWN]: DOOR_POSITION.UP,
  [DOOR_POSITION.UP]: DOOR_POSITION.DOWN,
  [DOOR_POSITION.LEFT]: DOOR_POSITION.RIGHT,
  [DOOR_POSITION.RIGHT]: DOOR_POSITION.LEFT,
} as const;

export class Stage extends Renderable {
  id: StageId;
  name: string;
  rooms: Room[];
  player: Player;
  currentRoomId: RoomId;
  backdropRoomChangeAnimation: BackdropRoomChangeAnimation;

  constructor(
    name: string,
    rooms: Room[],
    player: Player,
    currentRoomId?: RoomId
  ) {
    super();
    this.id = uuidv4() as StageId;
    this.name = name;
    this.rooms = rooms;
    this.player = player;
    const backdropRoomChangeAnimation = new BackdropRoomChangeAnimation(
      (enteredDoor) => {
        this.setCurrentRoom(enteredDoor.targetRoomId);
        player.setCoordsPosition(enteredDoor.targetCoords);
      },
      () => {
        player.isBlockedMoving = false;
      }
    );
    this.backdropRoomChangeAnimation = backdropRoomChangeAnimation;
    this.currentRoomId = currentRoomId || rooms[0].id;
    this.revealNearbyRooms();
  }

  render(ctx: CanvasRenderingContext2D): void {
    const currentRoom = this.rooms.find(
      (room) => room.id === this.currentRoomId
    );

    if (!currentRoom) return;

    currentRoom.render(ctx);
  }

  update(lagOffset: number): void {
    const doors = this.getCurrentRoom()?.map.doors;

    if (!doors) return;

    doors.forEach((door) => {
      const isPlayerEnteredDoor = door.isPlayerEnteredDoor(this.player);

      // Change room if player entered door
      if (isPlayerEnteredDoor) {
        this.backdropRoomChangeAnimation.setEnteredDoor(door);
        this.player.stopMoving();
        this.player.isBlockedMoving = true;
      }
    });
  }

  setCurrentRoom(roomId: RoomId) {
    const newCurrentRoom = this.rooms.find((room) => room.id === roomId);

    if (!newCurrentRoom) return;

    this.currentRoomId = roomId;
    this.revealNearbyRooms();
  }

  getCurrentRoom(): Room | undefined {
    return this.rooms.find((room) => room.id === this.currentRoomId);
  }

  revealNearbyRooms() {
    const currentRoom = this.getCurrentRoom();

    if (!currentRoom) return;

    const nearbyRooms = currentRoom.map.doors
      .map((door) => {
        return this.rooms.find((room) => room.id === door.targetRoomId);
      })
      .filter((room: Room | undefined): room is Room => !!room);

    nearbyRooms.forEach((room) => {
      room.isRevealed = true;
    });
  }

  static getThreeHorizontalRoomsStage(player: Player): Stage {
    const room1 = Room.getEmptyRoom();
    const room2 = Room.getEmptyRoom();
    const room3 = Room.getEmptyRoom();
    room1.addDoors([new Door(room1.id, room2.id, DOOR_POSITION.RIGHT)]);
    room2.addDoors([
      new Door(room2.id, room1.id, DOOR_POSITION.LEFT),
      new Door(room2.id, room3.id, DOOR_POSITION.RIGHT),
    ]);
    room3.addDoors([new Door(room3.id, room2.id, DOOR_POSITION.LEFT)]);

    const rooms: Room[] = [room1, room2, room3];

    return new Stage('Three Horizontal Rooms', rooms, player);
  }

  static getRandomsRoomsStage(
    player: Player,
    numberOfRooms: number = 6
  ): Stage {
    const rooms: Room[] = [];
    for (let i = 0; i < numberOfRooms; i++) {
      rooms.push(Room.getEmptyRoom());
    }

    let currentRoomCoords: Coords = { x: 0, y: 0 } as Coords;

    for (let i = 0; i < numberOfRooms - 1; i++) {
      let randomNumber: keyof typeof DOOR_POSITION_MAP;
      let doorPosition: DoorPosition;
      let doorCoords: Coords | null;
      let doorTargetCoords: Coords | null;
      let loopIterations = 0;

      do {
        randomNumber = randomInt(1, 4) as keyof typeof DOOR_POSITION_MAP;
        doorPosition = DOOR_POSITION_MAP[randomNumber];
        [doorCoords, doorTargetCoords] = Door.getDoorCoords(doorPosition);
        loopIterations++;
        if (loopIterations >= 50) break;
      } while (
        (doorCoords && rooms[i].hasDoorAt(doorCoords)) ||
        (doorTargetCoords && rooms[i + 1].hasDoorAt(doorTargetCoords)) ||
        Room.getRoomAtCoords(
          rooms,
          Room.addDoorPositionToCoords(currentRoomCoords, doorPosition)
        )
      );
      if (loopIterations >= 50) {
        break;
      }
      currentRoomCoords = Room.addDoorPositionToCoords(
        currentRoomCoords,
        doorPosition
      );
      rooms[i + 1].coords = currentRoomCoords;

      rooms[i].addDoors([new Door(rooms[i].id, rooms[i + 1].id, doorPosition)]);
      rooms[i + 1].addDoors([
        new Door(
          rooms[i + 1].id,
          rooms[i].id,
          DOOR_POSITION_OPPOSITE[doorPosition]
        ),
      ]);

      // Connect new room to existing rooms with doors
      const possibleRooms = [
        {
          room: Room.getRoomAtCoords(rooms, {
            x: currentRoomCoords.x - 1,
            y: currentRoomCoords.y,
          } as Coords),
          doorPosition: DOOR_POSITION.LEFT,
        },
        {
          room: Room.getRoomAtCoords(rooms, {
            x: currentRoomCoords.x + 1,
            y: currentRoomCoords.y,
          } as Coords),
          doorPosition: DOOR_POSITION.RIGHT,
        },
        {
          room: Room.getRoomAtCoords(rooms, {
            x: currentRoomCoords.x,
            y: currentRoomCoords.y - 1,
          } as Coords),
          doorPosition: DOOR_POSITION.UP,
        },
        {
          room: Room.getRoomAtCoords(rooms, {
            x: currentRoomCoords.x,
            y: currentRoomCoords.y + 1,
          } as Coords),
          doorPosition: DOOR_POSITION.DOWN,
        },
      ];
      const existingRooms = possibleRooms.filter(
        (possibleRoom) => !!possibleRoom.room
      );

      if (existingRooms.length > 0) {
        existingRooms.forEach((existingRoom) => {
          if (!rooms[i + 1].hasDoorAt(existingRoom.room!.coords)) {
            rooms[i + 1].addDoors([
              new Door(
                rooms[i + 1].id,
                existingRoom.room!.id,
                existingRoom.doorPosition
              ),
            ]);
            existingRoom.room!.addDoors([
              new Door(
                existingRoom.room!.id,
                rooms[i + 1].id,
                DOOR_POSITION_OPPOSITE[existingRoom.doorPosition]
              ),
            ]);
          }
        });
      }
    }

    return new Stage(`Random ${numberOfRooms} Rooms Stage`, rooms, player);
  }
}
