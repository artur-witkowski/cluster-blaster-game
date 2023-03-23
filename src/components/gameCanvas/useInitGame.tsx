import { useEffect, useState } from 'react';
import { KEYS } from '../../constants/keyboard';
import { Player } from '../../classes/player';
import { CANVAS_HEIGHT, CANVAS_WIDTH, FPS_LIMIT } from '../../constants/game';
import { World } from '../../classes/world';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const useInitGame = ({ canvasRef }: Props) => {
  const world = new World(CANVAS_WIDTH, CANVAS_HEIGHT);
  const [player, _setPlayer] = useState<Player>(
    new Player(world, 10, 10, 50, 50)
  );
  const [sprites, _setSprites] = useState<Player[]>([player]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    // Init context
    if (context) {
      context.imageSmoothingEnabled = false;
    }

    let start = Date.now(),
      frameDuration = 1000 / FPS_LIMIT;
    let lag = 0;

    //The renderer
    const render = () => {
      if (!context || !canvas) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      sprites.forEach((sprite) => {
        context.save();
        sprite.render(context);
        context.restore();
      });
    };

    // Update the game logic
    const update = (lagOffset: number) => {
      sprites.forEach((sprite) => {
        sprite.update(lagOffset);
      });
    };

    // The game loop
    const gameLoop = () => {
      window.requestAnimationFrame(gameLoop);
      const current = Date.now();
      const elapsed = current - start;
      start = current;
      lag += elapsed;

      while (lag >= frameDuration) {
        update(lag);
        lag -= frameDuration;
      }

      render();
    };

    //Start the game loop
    gameLoop();
  }, []);

  useEffect(() => {
    const handleKeyboardKeydown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'down':
        case 'arrowdown':
        case 's':
          player.addPressedKey(KEYS.DOWN);
          break;
        case 'up':
        case 'arrowup':
        case 'w':
          player.addPressedKey(KEYS.UP);
          break;
        case 'left':
        case 'arrowleft':
        case 'a':
          player.addPressedKey(KEYS.LEFT);
          break;
        case 'right':
        case 'arrowright':
        case 'd':
          player.addPressedKey(KEYS.RIGHT);
          break;
        case 'c':
          player.toggleDebugMode();
          break;
      }
    };
    const handleKeyboardKeyup = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'down':
        case 'arrowdown':
        case 's':
          player.removePressedKey(KEYS.DOWN);
          break;
        case 'up':
        case 'arrowup':
        case 'w':
          player.removePressedKey(KEYS.UP);
          break;
        case 'left':
        case 'arrowleft':
        case 'a':
          player.removePressedKey(KEYS.LEFT);
          break;
        case 'right':
        case 'arrowright':
        case 'd':
          player.removePressedKey(KEYS.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyboardKeydown);
    window.addEventListener('keyup', handleKeyboardKeyup);

    return () => {
      window.removeEventListener('keydown', handleKeyboardKeydown);
      window.removeEventListener('keyup', handleKeyboardKeyup);
    };
  }, []);
};
