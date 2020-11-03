const initialState = {
  counter: 0
};

export default (state = initialState, action) => {
  switch(action.type) {
    case 'CREATE_NEW_BOARDS':
      return {
        ...state,
        counter: action.payload
      }
    default:
      return state;
  }
}