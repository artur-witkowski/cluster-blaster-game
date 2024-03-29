export const EVENTS_TO_SERVER = {
  GAME: {
    CREATE_NEW_LOBBY: 'SERVER::GAME::CREATE_NEW_LOBBY',
    JOIN_EXISTING_LOBBY: 'SERVER::GAME::JOIN_EXISTING_LOBBY',
    START: 'SERVER::GAME::START',
  },
  PLAYER: {
    UPDATE_DATA: 'SERVER::PLAYER::UPDATE_DATA',
  },
};

export const EVENTS_TO_CLIENT = {
  GAME: {
    NEW_LOBBY_CREATED: 'CLIENT::GAME::NEW_LOBBY_CREATED',
    JOIN_LOBBY_SUCCESS: 'CLIENT::GAME::JOIN_LOBBY_SUCCESS',
    PLAYER_JOINED_THE_LOBBY: 'CLIENT::GAME::PLAYER_JOINED_THE_LOBBY',
    GAME_STARTED: 'CLIENT::GAME::GAME_STARTED',
    UPDATE_GAME_DATA: 'CLIENT::GAME::UPDATE_GAME_DATA',
  },
};
