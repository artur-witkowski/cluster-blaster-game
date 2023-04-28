import { Tile } from '../classes/tile';
import { DESTINATION_TILE_SIZE } from '../constants/game';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { Map } from '../classes/map';
import { Coords, DoorPosition } from '../types/shared';
import { Item } from '../classes/item';
import { DOOR_POSITION } from '../constants/doors';

export const setGroundMap = (map: Map): void => {
  for (let x = 0; x < map.width / DESTINATION_TILE_SIZE; x++) {
    for (let y = 0; y < map.height / DESTINATION_TILE_SIZE; y++) {
      map.setTile(new Tile(x, y, 1, 1, DungeonTileset));
    }
  }
};

export const setMapWalls = (map: Map): void => {
  for (let x = 0; x < map.width / DESTINATION_TILE_SIZE; x++) {
    for (let y = 0; y < map.height / DESTINATION_TILE_SIZE; y++) {
      if (y === 0) {
        map.setTile(new Tile(x, y, 1, 0, DungeonTileset, null, true));
      } else if (y === map.height / DESTINATION_TILE_SIZE - 1) {
        map.setTile(new Tile(x, y, 1, 2, DungeonTileset, null, true));
      } else if (x === 0) {
        map.setTile(new Tile(x, y, 0, 1, DungeonTileset, null, true));
      } else if (x === map.width / DESTINATION_TILE_SIZE - 1) {
        map.setTile(new Tile(x, y, 2, 1, DungeonTileset, null, true));
      }
    }
  }

  map.setTile(new Tile(0, 0, 0, 0, DungeonTileset, null, true));
  map.setTile(
    new Tile(
      0,
      map.height / DESTINATION_TILE_SIZE - 1,
      0,
      2,
      DungeonTileset,
      null,
      true
    )
  );
  map.setTile(
    new Tile(
      map.width / DESTINATION_TILE_SIZE - 1,
      0,
      2,
      0,
      DungeonTileset,
      null,
      true
    )
  );
  map.setTile(
    new Tile(
      map.width / DESTINATION_TILE_SIZE - 1,
      map.height / DESTINATION_TILE_SIZE - 1,
      2,
      2,
      DungeonTileset,
      null,
      true
    )
  );
};

export const setMapDoor = (
  map: Map,
  coords: Coords,
  direction: DoorPosition
): void => {
  const { x, y } = coords;
  if (direction === DOOR_POSITION.UP) {
    map.setItem(new Item('Door', x - 1, y, 0, 3, DungeonTileset, null, true));
    map.setItem(
      new Item(
        'Door',
        x,
        y,
        1,
        3,
        DungeonTileset,
        { x: 0, y: 0, width: DESTINATION_TILE_SIZE, height: 20 },
        true
      )
    );
    map.setItem(new Item('Door', x + 1, y, 2, 3, DungeonTileset, null, true));
    map.setTile(new Tile(x, y, 1, 1, DungeonTileset, null, false));
  } else if (direction === DOOR_POSITION.DOWN) {
    map.setItem(new Item('Door', x - 1, y, 0, 4, DungeonTileset, null, true));
    map.setItem(
      new Item(
        'Door',
        x,
        y,
        1,
        4,
        DungeonTileset,
        {
          x: 0,
          y: DESTINATION_TILE_SIZE - 20,
          width: DESTINATION_TILE_SIZE,
          height: 20,
        },
        true
      )
    );
    map.setItem(new Item('Door', x + 1, y, 2, 4, DungeonTileset, null, true));
    map.setTile(new Tile(x, y, 1, 1, DungeonTileset, null, false));
  } else if (direction === DOOR_POSITION.LEFT) {
    map.setItem(new Item('Door', x, y - 1, 3, 2, DungeonTileset, null, true));
    map.setItem(
      new Item(
        'Door',
        x,
        y,
        3,
        3,
        DungeonTileset,
        {
          x: 0,
          y: 0,
          width: 20,
          height: DESTINATION_TILE_SIZE,
        },
        true
      )
    );
    map.setItem(new Item('Door', x, y + 1, 3, 4, DungeonTileset, null, true));
    map.setTile(new Tile(x, y, 1, 1, DungeonTileset, null, false));
  } else if (direction === DOOR_POSITION.RIGHT) {
    map.setItem(new Item('Door', x, y - 1, 4, 2, DungeonTileset, null, true));
    map.setItem(
      new Item(
        'Door',
        x,
        y,
        4,
        3,
        DungeonTileset,
        {
          x: DESTINATION_TILE_SIZE - 20,
          y: 0,
          width: 20,
          height: DESTINATION_TILE_SIZE,
        },
        true
      )
    );
    map.setItem(new Item('Door', x, y + 1, 4, 4, DungeonTileset, null, true));
    map.setTile(new Tile(x, y, 1, 1, DungeonTileset, null, false));
  }
};
