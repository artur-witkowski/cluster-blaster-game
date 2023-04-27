import { Tile } from '../classes/tile';
import { DESTINATION_TILE_SIZE } from '../constants/game';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { Map } from '../classes/map';

export const setBasicMap = (map: Map): void => {
  for (let x = 0; x < map.width / DESTINATION_TILE_SIZE; x++) {
    for (let y = 0; y < map.height / DESTINATION_TILE_SIZE; y++) {
      map.setTile(new Tile(x, y, 1, 1, DungeonTileset));
    }
  }
};

export const setMapBorders = (map: Map): void => {
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
