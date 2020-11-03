export function userLogin(payload) {
  return {
    type: 'USER_LOGIN',
    payload,
  }
}

export function userLoginFailed() {
  return {
    type: 'USER_LOGIN_FAILED',
  }
}

export function signUpFailed(payload) {
  return {
    type: 'USER_SIGNUP_FAILED',
    payload,
  }
}

export function userSignup(payload) {
  return {
    type: 'USER_SIGNUP',
    payload,
  }
}

export function userLogOut() {
  return {
    type: 'USER_LOG_OUT',
  }
}

export function getUserProfile(payload) {
  return {
    type: 'GET_USER_PROFILE',
    payload,
  }
}

export function updateActionsOnProfile(payload) {
  return {
    type: 'UPDATE_ACTIONS_ON_PROFILE',
    payload,
  }
}

export function bookmarkBoard(payload) {
  return {
    type: 'BOOKMARK_BOARD',
    payload,
  }
}

export function removeBookmarkFromBoard(payload) {
  return {
    type: 'REMOVE_BOOKMARK_BOARD',
    payload,
  }
}
