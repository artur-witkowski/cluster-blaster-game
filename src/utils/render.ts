import { Tile } from '../game/classes/tile';
import {
  DESTINATION_TILE_SIZE,
  ORIGINAL_TILE_SIZE,
} from '../game/constants/game';
import { degreesToRadians } from './math';

export const renderTileOnCanvas = (
  ctx: CanvasRenderingContext2D,
  renderTile: Tile
): void => {
  const angleInRadians = degreesToRadians(renderTile.rotation);
  if (angleInRadians !== 0) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(
      renderTile.position.x + DESTINATION_TILE_SIZE / 2,
      renderTile.position.y + DESTINATION_TILE_SIZE / 2
    );
    ctx.rotate(angleInRadians);
    ctx.drawImage(
      renderTile.image,
      renderTile.cropPosition.x * ORIGINAL_TILE_SIZE,
      renderTile.cropPosition.y * ORIGINAL_TILE_SIZE,
      ORIGINAL_TILE_SIZE,
      ORIGINAL_TILE_SIZE,
      -DESTINATION_TILE_SIZE / 2,
      -DESTINATION_TILE_SIZE / 2,
      renderTile.width,
      renderTile.height
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      renderTile.image,
      renderTile.cropPosition.x * ORIGINAL_TILE_SIZE,
      renderTile.cropPosition.y * ORIGINAL_TILE_SIZE,
      ORIGINAL_TILE_SIZE,
      ORIGINAL_TILE_SIZE,
      renderTile.position.x,
      renderTile.position.y,
      renderTile.width,
      renderTile.height
    );
  }
};
