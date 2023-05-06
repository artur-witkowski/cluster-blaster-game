import { useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../game/constants/game';

import { useInitGame } from './useInitGame';
import { COLORS } from '../../utils/colors';

const useStyles = createUseStyles({
  canvasContainer: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    background: `radial-gradient(circle, ${COLORS.backgroundColorDark} 30%, ${COLORS.backgroundColorLight} 100%)`,
  },
  canvas: {
    border: '1px solid #000000',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  controls: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: '#ffffff',
    fontSize: '1.5rem',

    '& h1': {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
  },
});

const GameCanvas = () => {
  const classes = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useInitGame({ canvasRef });

  return (
    <div className={classes.canvasContainer}>
      <div className={classes.controls}>
        <h1>Controls:</h1>
        WASD - Move
        <br />
        C - Toggle collision borders
        <br />R - Reset map <br />E - Action
      </div>
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={classes.canvas}
        id='game'
        ref={canvasRef}
      />
    </div>
  );
};

export default GameCanvas;
