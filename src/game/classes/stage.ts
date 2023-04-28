import { v4 as uuidv4 } from 'uuid';

import { StageId } from '../types/stage';
import { Room } from './room';
import { RoomId } from '../types/room';
import { Door } from './door';
import { Coords } from '../types/shared';
import { DESTINATION_TILE_SIZE } from '../constants/game';
import { Renderable } from './renderable';
import { DOOR_POSITION } from '../constants/doors';
import { Player } from './player';

export class Stage extends Renderable {
  id: StageId;
  name: string;
  rooms: Room[];
  player: Player;
  currentRoomId: RoomId;
  private enteredDoor: Door | null = null;

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
    this.currentRoomId = currentRoomId || rooms[0].id;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const currentRoom = this.rooms.find(
      (room) => room.id === this.currentRoomId
    );

    if (!currentRoom) return;

    currentRoom.render(ctx);

    if (this.enteredDoor) {
      this.animateDoorEnter(ctx);
    }
  }

  update(lagOffset: number): void {
    const doors = this.getCurrentRoom()?.map.doors;

    if (!doors) return;

    doors.forEach((door) => {
      const isPlayerEnteredDoor = door.isPlayerEnteredDoor(this.player);

      // Change room if player entered door
      if (isPlayerEnteredDoor) {
        this.enteredDoor = door;
      }
    });
  }

  animateDoorEnter(ctx: CanvasRenderingContext2D) {
    if (this.enteredDoor === null) return;

    console.log('animate');
    ctx.globalAlpha = 0.1;

    this.player.stopMoving();
    this.setCurrentRoom(this.enteredDoor.targetRoomId);
    this.player.setCoordsPosition(this.enteredDoor.targetCoords);

    this.enteredDoor = null;
  }

  setCurrentRoom(roomId: RoomId) {
    const newCurrentRoom = this.rooms.find((room) => room.id === roomId);

    if (!newCurrentRoom) return;

    this.currentRoomId = roomId;
  }

  getCurrentRoom(): Room | undefined {
    return this.rooms.find((room) => room.id === this.currentRoomId);
  }

  static getThreeHorizontalRoomsStage(player: Player): Stage {
    const room1 = Room.getEmptyRoom();
    const room2 = Room.getEmptyRoom();
    const room3 = Room.getEmptyRoom();
    room1.addDoors([
      new Door(
        {
          x: room1.map.width / DESTINATION_TILE_SIZE - 1,
          y: 7,
        } as Coords,
        room1.id,
        {
          x: 1,
          y: 7,
        } as Coords,
        room2.id,
        DOOR_POSITION.RIGHT
      ),
    ]);
    room2.addDoors([
      new Door(
        {
          x: 0,
          y: 7,
        } as Coords,
        room2.id,
        {
          x: room2.map.width / DESTINATION_TILE_SIZE - 2,
          y: 7,
        } as Coords,
        room1.id,
        DOOR_POSITION.LEFT
      ),
      new Door(
        {
          x: room2.map.width / DESTINATION_TILE_SIZE - 1,
          y: 7,
        } as Coords,
        room2.id,
        {
          x: 1,
          y: 7,
        } as Coords,
        room3.id,
        DOOR_POSITION.RIGHT
      ),
    ]);
    room3.addDoors([
      new Door(
        {
          x: 0,
          y: 7,
        } as Coords,
        room3.id,
        {
          x: room3.map.width / DESTINATION_TILE_SIZE - 2,
          y: 7,
        } as Coords,
        room2.id,
        DOOR_POSITION.LEFT
      ),
    ]);

    const rooms: Room[] = [room1, room2, room3];

    return new Stage('Three Horizontal Rooms', rooms, player);
  }
}
