import { Item } from './item';
import DungeonTileset from '../assets/dungeon_tileset.png';
import { DESTINATION_TILE_SIZE } from '../constants/game';
import { renderTileOnCanvas } from '../../utils/render';

export class Chest extends Item {
  isOpen: boolean = false;

  constructor(x: number, y: number) {
    super(
      'Chest',
      x,
      y,
      4,
      5,
      DungeonTileset,
      {
        x: 5,
        y: 5,
        width: DESTINATION_TILE_SIZE - 10,
        height: DESTINATION_TILE_SIZE - 10,
      },
      true,
      0
    );
    this.action = this.openChest;
  }

  renderSprite(ctx: CanvasRenderingContext2D) {
    if (this.isHover) {
      ctx.save();
      ctx.filter = 'blur(16px)';

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(
        this.position.x + DESTINATION_TILE_SIZE / 2,
        this.position.y + DESTINATION_TILE_SIZE / 2,
        DESTINATION_TILE_SIZE / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.fill();
      ctx.restore();
    }

    renderTileOnCanvas(ctx, this);
  }

  update() {}

  openChest() {
    this.isOpen = true;
    this.cropPosition.x = 5;
    this.action = null;
  }
}
