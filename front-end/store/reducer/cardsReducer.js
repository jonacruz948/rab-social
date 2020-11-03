const initialState = {
  comments: []
}

export default (state = initialState, action) => {
  switch(action.type) {
    case 'ADD_CARDS_TO_BOARDS':
      return {
        ...state,
        justList: [...state.justList, action.payload]
      }
    case 'CARD_DOWNLOAD':
      return state;
    case 'SAVE_CARD_COMMENTS':
      const comments = action.payload;
      return {
        ...state,
        comments,
      };
    case 'ADD_COMMENT_TO_CARD':
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    case 'SAVE_COMMENTS':
      return state;
    default: 
      return state;
  }
}