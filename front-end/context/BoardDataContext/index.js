import React, { createContext, useReducer } from 'react'

const initialBoardData = {}

const BoardDataContext = createContext(initialBoardData)

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOARD_DATA':
      const { name, bio: desc, tags, coverimage, boardID } = action.payload
      return {
        ...state,
        name,
        desc,
        tags,
        coverimage,
        boardID,
      }
    default:
      return state
  }
}

const BoardDataContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialBoardData)
  let value = { state, dispatch }
  return (
    <BoardDataContext.Provider value={value}>
      {props.children}
    </BoardDataContext.Provider>
  )
}

const BoardDataContextConsumer = BoardDataContext.Consumer

export { BoardDataContextProvider, BoardDataContextConsumer }
export default BoardDataContext
