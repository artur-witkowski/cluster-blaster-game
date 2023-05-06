import { COLORS } from '../../utils/colors';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/game';
import { Door } from './door';
import { Renderable } from './renderable';

export class BackdropRoomChangeAnimation extends Renderable {
  private opacity: number = 0;
  private opacityDirection: 'up' | 'down' = 'up';
  private enteredDoor: Door | null = null;
  private callbackActionMiddleAnimation: (enteredDoor: Door) => void;
  private callbackActionEndAnimation: (enteredDoor: Door) => void;

  constructor(
    callbackActionMiddleAnimation: (enteredDoor: Door) => void,
    callbackActionEndAnimation: (enteredDoor: Door) => void
  ) {
    super();
    this.callbackActionMiddleAnimation = callbackActionMiddleAnimation;
    this.callbackActionEndAnimation = callbackActionEndAnimation;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.enteredDoor) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = COLORS.backgroundColorDark;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.restore();
    }
  }

  update(lagOffset: number): void {
    if (this.enteredDoor) {
      if (this.opacityDirection === 'up') {
        this.opacity += lagOffset / 500;
      } else {
        this.opacity -= lagOffset / 500;
      }

      if (this.opacity >= 1) {
        this.opacityDirection = 'down';
        this.callbackActionMiddleAnimation(this.enteredDoor);
      } else if (this.opacity <= 0 && this.opacityDirection === 'down') {
        this.opacity = 0;
        this.opacityDirection = 'up';
        this.callbackActionEndAnimation(this.enteredDoor);
        this.enteredDoor = null;
      }
    }
  }

  setEnteredDoor(door: Door | null) {
    this.enteredDoor = door;
  }
}
