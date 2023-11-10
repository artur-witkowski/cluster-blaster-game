import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';

import { routes } from '../components/router';
import { useLobbyStore } from '../stores/lobbyStore';
import { createNewLobby, joinLobby } from '../game-with-server/server/server';

const useStyles = createUseStyles({});

const CreateRoomPage = () => {
  const classes = useStyles();
  const redirect = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const setUsername = useLobbyStore((state) => state.setUsername);
  const gameId = useLobbyStore((state) => state.gameId);

  useEffect(() => {
    if (gameId) {
      redirect(routes.roomLobby.build(gameId));
    }
  }, [gameId]);

  const handleJoinRoom = () => {
    setUsername(newUsername);
    joinLobby({ username: newUsername, gameId: roomName });
  };

  const handleCreateRoom = () => {
    setUsername(newUsername);

    createNewLobby({ username: newUsername });
  };

  return (
    <div>
      Username:{' '}
      <input
        type='text'
        onChange={(e) => setNewUsername(e.target.value)}
        value={newUsername}
      />
      <hr />
      <h1>Create new room</h1>
      <button onClick={handleCreateRoom} disabled={!newUsername}>
        Create
      </button>
      <hr />
      <h1>Join room</h1>
      <label htmlFor='room-id'>Room name</label>
      <input
        type='text'
        id='room-id'
        value={roomName}
        onChange={(e) => setRoomName(e.target.value || '')}
      />
      <button onClick={handleJoinRoom} disabled={!newUsername || !roomName}>
        Join
      </button>
    </div>
  );
};

export default CreateRoomPage;
