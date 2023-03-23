import { useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../constants/game';

import { useInitGame } from './useInitGame';

const useStyles = createUseStyles({
  canvasContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    border: '1px solid #000000',
  },
});

const GameCanvas = () => {
  const classes = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useInitGame({ canvasRef });

  return (
    <div className={classes.canvasContainer}>
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={classes.canvas}
        ref={canvasRef}
      />
    </div>
  );
};

export default GameCanvas;
