import { Vector2 } from '../types/shared';
import characterBase from '../assets/character_base.png';
import { Renderable } from './renderable';
import { KEYS } from '../constants/keyboard';
import {
  PLAYER_CONSTANT_SPEED_LOSE,
  PLAYER_DIAGONAL_FACTOR_SPEED,
  PLAYER_MAX_VELOCITY,
  PLAYER_SPEED,
  PLAYER_VELOCITY_THRESHOLD,
} from '../constants/player';

export class Player extends Renderable {
  id: string;
  private username: string;
  private position: Vector2;
  private velocity: Vector2;
  private direction: Vector2;
  private image: HTMLImageElement;
  private lastServerPositionUpdateTimestamp: number;

  constructor(id: string, username: string) {
    super();
    this.id = id;
    this.username = username;
    this.position = { x: 0, y: 0 } as Vector2;
    this.velocity = { x: 0, y: 0 } as Vector2;
    this.direction = { x: 0, y: 0 } as Vector2;
    this.image = new Image();
    this.image.src = characterBase;
    this.lastServerPositionUpdateTimestamp = Date.now();
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      0, // this.imageProgress * 16, // Start crop position
      0, // this.getDirectionSprite() * 16,
      16, // Width of the crop
      16, // Height of the crop
      this.position.x, // Place the result at x, y in the canvas,
      this.position.y,
      48, // this.width, // Destination image width and height
      48 // this.height
    );
    ctx.font = '12px Comic Sans MS';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText(this.username, this.position.x + 8, this.position.y);
  }

  update(keyPressed?: Set<(typeof KEYS)[keyof typeof KEYS]>) {
    if (keyPressed) {
      // Update the direction based on the keys pressed
      if (keyPressed.has(KEYS.LEFT) && !keyPressed.has(KEYS.RIGHT)) {
        this.changeDirection(-1, null);
      } else if (keyPressed.has(KEYS.RIGHT) && !keyPressed.has(KEYS.LEFT)) {
        this.changeDirection(1, null);
      } else {
        this.changeDirection(0, null);
      }

      if (keyPressed.has(KEYS.UP) && !keyPressed.has(KEYS.DOWN)) {
        this.changeDirection(null, -1);
      } else if (keyPressed.has(KEYS.DOWN) && !keyPressed.has(KEYS.UP)) {
        this.changeDirection(null, 1);
      } else {
        this.changeDirection(null, 0);
      }
    }

    // Constantly slowing down the player if not moving
    if (!this.direction.x) this.velocity.x *= PLAYER_CONSTANT_SPEED_LOSE;
    if (!this.direction.y) this.velocity.y *= PLAYER_CONSTANT_SPEED_LOSE;

    // Stop the player if the velocity is too low
    if (Math.abs(this.velocity.x) < PLAYER_VELOCITY_THRESHOLD) {
      this.velocity.x = 0;
    }
    if (Math.abs(this.velocity.y) < PLAYER_VELOCITY_THRESHOLD) {
      this.velocity.y = 0;
    }

    // Update position based on velocity
    const isDiagonal = this.direction.x && this.direction.y;
    this.changePosition(
      this.velocity.x * (isDiagonal ? PLAYER_DIAGONAL_FACTOR_SPEED : 1),
      this.velocity.y * (isDiagonal ? PLAYER_DIAGONAL_FACTOR_SPEED : 1)
    );

    // Update the velocity based on the direction
    if (this.direction.x) {
      this.changeVelocity(this.direction.x * PLAYER_SPEED, 0);
    }
    if (this.direction.y) {
      this.changeVelocity(0, this.direction.y * PLAYER_SPEED);
    }
  }

  getPosition() {
    return this.position;
  }

  getVelocity() {
    return this.velocity;
  }

  getDirection() {
    return this.direction;
  }

  getUsername() {
    return this.username;
  }

  setPlayerDataFromServer({
    position,
    velocity,
    direction,
  }: {
    position: Vector2;
    velocity: Vector2;
    direction: Vector2;
  }) {
    const now = Date.now();
    if (now - this.lastServerPositionUpdateTimestamp > 1000) {
      this.position = position;
      this.lastServerPositionUpdateTimestamp = now;
    }
    this.velocity = velocity;
    this.direction = direction;
  }

  private changePosition(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
  }

  private changeVelocity(x: number, y: number) {
    if (this.velocity.x + x > PLAYER_MAX_VELOCITY) {
      this.velocity.x = PLAYER_MAX_VELOCITY;
    } else if (this.velocity.x + x < -PLAYER_MAX_VELOCITY) {
      this.velocity.x = -PLAYER_MAX_VELOCITY;
    } else {
      this.velocity.x += x;
    }

    if (this.velocity.y + y > PLAYER_MAX_VELOCITY) {
      this.velocity.y = PLAYER_MAX_VELOCITY;
    } else if (this.velocity.y + y < -PLAYER_MAX_VELOCITY) {
      this.velocity.y = -PLAYER_MAX_VELOCITY;
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
}
