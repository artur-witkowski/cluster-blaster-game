import { useEffect, useState } from 'react';
import { Game } from '../../game/classes/game';
import { gameInstance } from './gameInstance';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const useInitGame = ({ canvasRef }: Props) => {
  useEffect(() => {
    // canvasRef.current && setGame(new Game(canvasRef.current));
    if (canvasRef.current) {
      gameInstance.setCanvas(canvasRef.current);
      gameInstance.start();
    }

    return () => {
      if (gameInstance) {
        gameInstance.stop();
      }
    };
  }, []);
};
