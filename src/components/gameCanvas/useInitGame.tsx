import { useEffect, useState } from 'react';
import { Game } from '../../classes/game';

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const useInitGame = ({ canvasRef }: Props) => {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    canvasRef.current && setGame(new Game(canvasRef.current));

    return () => {
      game && game.stop();
    };
  }, []);
};
