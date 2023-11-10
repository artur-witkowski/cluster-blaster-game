import { createBrowserRouter } from 'react-router-dom';
import CreateRoomPage from '../pages/CreateRoomPage';
import GameCanvas from './gameCanvas';
import RoomLobby from '../pages/RoomLobby';

export const routes = {
  createRoom: {
    path: '/',
    config: '/',
  },
  roomLobby: {
    path: '/lobby/',
    config: '/lobby/:roomId',
    build: (roomId: string) => `/lobby/${roomId}`,
  },
  gameRoom: {
    path: '/game/',
    config: '/game/',
  },
};

export const router = createBrowserRouter([
  {
    path: routes.createRoom.config,
    element: <CreateRoomPage />,
  },
  {
    path: routes.roomLobby.config,
    element: <RoomLobby />,
  },
  {
    path: routes.gameRoom.config,
    element: <GameCanvas />,
  },
]);
