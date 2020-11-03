import React, { createContext, useReducer } from 'react'

const isServer = typeof window === 'undefined'

const initialUserProfile = {
  bio: !isServer && localStorage.getItem('bio'),
  avatar: !isServer && localStorage.getItem('avatar'),
  email: !isServer && localStorage.getItem('email'),
  points: !isServer && localStorage.getItem('points'),
  userID: !isServer && localStorage.getItem('userID'),
  fullName: !isServer && localStorage.getItem('fullName'),
  userName: !isServer && localStorage.getItem('userName'),
  token: !isServer && localStorage.getItem('token'),
}

const UserContext = createContext(initialUserProfile)

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_INITIAL_INFO':
      const {
        bio,
        avatar,
        email,
        points,
        userID,
        fullName,
        userName,
        token,
      } = action.payload

      return {
        ...state,
        bio,
        avatar,
        email,
        points,
        userID,
        fullName,
        userName,
        token,
      }
    default:
      return state
  }
}

const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialUserProfile)
  let value = { state, dispatch }
  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  )
}

const UserContextConsumer = UserContext.Consumer

export { UserContextProvider, UserContextConsumer }
export default UserContext
