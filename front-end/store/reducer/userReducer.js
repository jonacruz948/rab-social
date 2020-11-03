const initialState = {
  token: (typeof window !== 'undefined' && localStorage.getItem('token')) || '',
  userId:
    (typeof window !== 'undefined' && localStorage.getItem('userId')) || '',
  isAuthorized:
    (typeof window !== 'undefined' && localStorage.getItem('isAuthorized')) ||
    false,
  boards:
    (typeof window !== 'undefined' &&
      localStorage.getItem('boards') &&
      localStorage.getItem('boards').split(',')) ||
    [],
  cards:
    (typeof window !== `undefined` && localStorage.getItem('boards')) || [],
  actions: [],
}

function setUserInfo(state, userinfo) {
  const { token, user, profile } = userinfo
  const { bookmarkedboards, bookmarkedcards } = profile

  localStorage.setItem('token', token)
  localStorage.setItem('userId', user._id)
  localStorage.setItem('isAuthorized', true)
  localStorage.setItem('boards', bookmarkedboards)
  localStorage.setItem('cards', bookmarkedcards)

  return {
    ...state,
    token,
    userId: user._id,
    isAuthorized: true,
    boards: bookmarkedboards,
    cards: bookmarkedcards,
  }
}

function setUserProfileInfo(state, profileInfo) {
  const { bookmarked_cards, profile } = profileInfo
  const { actions } = profile

  return {
    ...state,
    bookmarked_cards,
    actions: actions.map((item) => item.actionID),
  }
}

function updateActionsOnProfile(state, actionInfo) {
  const { actionID, type } = actionInfo
  if (type === 0) {
    return {
      ...state,
      actions: [...state.actions, actionID],
    }
  } else {
    return {
      ...state,
      actions: state.actions.splice(
        state.actions.findIndex((item) => item === actionID),
        1
      ),
    }
  }
}

function bookmarkBoard(state, bookmarkInfo) {
  const { userID, boardID } = bookmarkInfo

  let uBoards = state.boards
  if (typeof uBoards === 'string') uBoards = uBoards.split(',')
  localStorage.setItem('boards', [...uBoards, boardID])

  return {
    ...state,
    boards: [...uBoards, boardID],
  }
}

function removeBookmark(state, bookmarkInfo) {
  const { userID, boardID } = bookmarkInfo

  let uBoards = state.boards

  uBoards.splice(
    uBoards.findIndex((item) => item === boardID),
    1
  )
  localStorage.setItem('boards', [...uBoards])
  return {
    ...state,
    boards: [...uBoards],
  }
}

function clearUserInfo(state) {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('isAuthorized')
  localStorage.removeItem('boards')
  localStorage.removeItem('cards')

  return {
    ...state,
    token: '',
    userId: '',
    isAuthorized: false,
    boards: '',
    cards: '',
  }
}

function setUserLoginFailed(state) {
  return {
    ...state,
    loginFailed: 1,
  }
}

function signUpFailed(state, payload) {
  const { message } = payload

  return {
    ...state,
    signUpFailed: 1,
    message: 'Email or Username is duplicated',
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return setUserInfo(state, action.payload)
    case 'USER_SIGNUP':
      return setUserInfo(state, action.payload)
    case 'USER_LOG_OUT':
      return clearUserInfo(state)
    case 'USER_LOGIN_FAILED':
      return setUserLoginFailed(state)
    case 'USER_SIGNUP_FAILED':
      return signUpFailed(state, action.payload)
    case 'GET_USER_PROFILE':
      return setUserProfileInfo(state, action.payload)
    case 'BOOKMARK_BOARD':
      return bookmarkBoard(state, action.payload)
    case 'REMOVE_BOOKMARK_BOARD':
      return removeBookmark(state, action.payload)
    case 'UPDATE_ACTIONS_ON_PROFILE':
      return updateActionsOnProfile(state, action.payload)
    default:
      return state
  }
}
