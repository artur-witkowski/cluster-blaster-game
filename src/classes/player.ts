import { KEYS } from '../constants/keyboard';
import { Vector2 } from '../types/shared';
import { Sprite } from './sprite';
import characterBase from '../assets/character_base.png';
import { DIAGONAL_FACTOR_SPEED } from '../constants/game';
import { World } from './world';

const MAX_VELOCITY = 3;
const SPEED = 0.4;
const CONSTANT_SPEED_LOSE = 0.92;
const VELOCITY_THRESHOLD = 0.15;
const TIME_BETWEEN_FRAMES_IN_MILLISECONDS = 400;

export class Player extends Sprite {
  private velocity: Vector2 = { x: 0, y: 0 };
  private direction: Vector2 = { x: 0, y: 0 };
  private keyPressed: Set<typeof KEYS[keyof typeof KEYS]> = new Set();
  private image: HTMLImageElement;
  private imageProgress: number = 0;
  private lastFrameUpdateInMilliseconds: number = 0;
  private world: World;

  constructor(
    world: World,
    x: number,
    y: number,
    width: number,
    height: number,
    imageUrl: string = characterBase
  ) {
    super(x, y, width, height);
    this.world = world;
    this.image = new Image();
    this.image.src = imageUrl;
  }

  renderSprite(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.imageProgress * 16, // Start crop position
      this.getDirectionSprite() * 16,
      16, // Width and height of the crop
      16,
      this.position.x, // Place the result at x, y in the canvas,
      this.position.y,
      this.width, // Destination image width and height
      this.height
    );
  }

  update(lag: number) {
    this.updateDirections();
    this.updateSpriteProgress(lag);

    // We are constantly slowing down the player if not moving
    if (!this.direction.x) this.velocity.x *= CONSTANT_SPEED_LOSE;
    if (!this.direction.y) this.velocity.y *= CONSTANT_SPEED_LOSE;
    if (Math.abs(this.velocity.x) < VELOCITY_THRESHOLD) {
      this.velocity.x = 0;
    }
    if (Math.abs(this.velocity.y) < VELOCITY_THRESHOLD) {
      this.velocity.y = 0;
    }

    const isDiagonal = this.direction.x && this.direction.y;

    // We are adding the velocity to the position
    this.changePosition(
      this.velocity.x * (isDiagonal ? DIAGONAL_FACTOR_SPEED : 1),
      this.velocity.y * (isDiagonal ? DIAGONAL_FACTOR_SPEED : 1)
    );

    if (this.direction.x) {
      this.changeVelocity(this.direction.x * SPEED, 0);
    }
    if (this.direction.y) {
      this.changeVelocity(0, this.direction.y * SPEED);
    }
  }

  addPressedKey(key: typeof KEYS[keyof typeof KEYS]) {
    this.keyPressed.add(key);
  }

  removePressedKey(key: typeof KEYS[keyof typeof KEYS]) {
    this.keyPressed.delete(key);
  }

  private changePosition(x: number, y: number) {
    if (
      (this.world.width - this.width > this.position.x + x &&
        this.position.x + x > 0) ||
      (this.world.width - this.width < this.position.x + x &&
        this.position.x + x < 0)
    ) {
      this.position.x += x;
    } else {
      this.velocity.x = 0;
    }

    if (
      (this.world.height - this.height > this.position.y + y &&
        this.position.y + y > 0) ||
      (this.world.height - this.height < this.position.y + y &&
        this.position.y + y < 0)
    ) {
      this.position.y += y;
    } else {
      this.velocity.y = 0;
    }
  }

  private getDirectionSprite() {
    if (this.direction.x === 1) {
      return 2;
    } else if (this.direction.x === -1) {
      return 3;
    } else if (this.direction.y === -1) {
      return 1;
    } else {
      return 0;
    }
  }

  private changeVelocity(x: number, y: number) {
    if (this.velocity.x + x > MAX_VELOCITY) {
      this.velocity.x = MAX_VELOCITY;
    } else if (this.velocity.x + x < -MAX_VELOCITY) {
      this.velocity.x = -MAX_VELOCITY;
    } else {
      this.velocity.x += x;
    }

    if (this.velocity.y + y > MAX_VELOCITY) {
      this.velocity.y = MAX_VELOCITY;
    } else if (this.velocity.y + y < -MAX_VELOCITY) {
      this.velocity.y = -MAX_VELOCITY;
    } else {
      this.velocity.y += y;
    }
  }

  private changeDirection(x: 1 | -1 | 0 | null, y: 1 | -1 | 0 | null) {
    if (x !== null) {
      this.direction.x = x;
    }
    if (y !== null) {
      this.direction.y = y;
    }
  }

  private updateDirections() {
    if (this.keyPressed.has(KEYS.LEFT) && !this.keyPressed.has(KEYS.RIGHT)) {
      this.changeDirection(-1, null);
    } else if (
      this.keyPressed.has(KEYS.RIGHT) &&
      !this.keyPressed.has(KEYS.LEFT)
    ) {
      this.changeDirection(1, null);
    } else {
      this.changeDirection(0, null);
    }

    if (this.keyPressed.has(KEYS.UP) && !this.keyPressed.has(KEYS.DOWN)) {
      this.changeDirection(null, -1);
    } else if (
      this.keyPressed.has(KEYS.DOWN) &&
      !this.keyPressed.has(KEYS.UP)
    ) {
      this.changeDirection(null, 1);
    } else {
      this.changeDirection(null, 0);
    }
  }

  private updateSpriteProgress(lag: number) {
    this.lastFrameUpdateInMilliseconds += lag;

    if (
      this.lastFrameUpdateInMilliseconds > TIME_BETWEEN_FRAMES_IN_MILLISECONDS
    ) {
      if ((this.direction.x || this.direction.y) && this.imageProgress < 3) {
        this.imageProgress++;
      } else {
        this.imageProgress = 0;
      }
      this.lastFrameUpdateInMilliseconds = 0;
    }
  }
}
