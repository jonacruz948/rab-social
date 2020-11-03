import { combineReducers } from 'redux'

import boardsReducer from './boardsReducer';
import cardsReducer from './cardsReducer';
import hydrateReducer from './hydrateReducer';
import userReducer from './userReducer';

export default combineReducers({
  hydrate: hydrateReducer,
  boards: boardsReducer,
  cards: cardsReducer,
  users: userReducer,
});
