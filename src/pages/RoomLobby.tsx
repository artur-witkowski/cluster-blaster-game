import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate, useParams } from 'react-router-dom';

import { useLobbyStore } from '../stores/lobbyStore';
import { routes } from '../components/router';
import { GAME_STATUSES } from '../game-with-server/types/shared';
import { startGame } from '../game-with-server/server/server';

const useStyles = createUseStyles({});

const RoomLobby = () => {
  const classes = useStyles();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const gameStatus = useLobbyStore((state) => state.gameStatus);
  const gameId = useLobbyStore((state) => state.gameId);
  const playersInLobby = useLobbyStore((state) => state.playersInLobby);

  useEffect(() => {
    if (playersInLobby.length === 0) {
      navigate(routes.createRoom.path);
    }
  }, []);

  useEffect(() => {
    if (gameStatus === GAME_STATUSES.IN_PROGRESS) {
      navigate(routes.gameRoom.path);
    }
  }, [gameStatus]);

  const handleStartGame = () => {
    if (gameId) {
      startGame({ gameId });
    }
  };

  return (
    <div>
      <h1>Room lobby</h1>
      Room name: {roomId}
      <hr />
      <h2>List of players:</h2>
      <ul>
        {playersInLobby.map((player) => (
          <li key={player.id}>
            {player.username} {player.isMe && ' - You'}
          </li>
        ))}
      </ul>
      <hr />
      <button onClick={handleStartGame}>Start game</button>
    </div>
  );
};

export default RoomLobby;
