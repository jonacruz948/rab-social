export function loginWatcher(params) {
  return { type: 'LOGIN_WATCHER', payload: params }
}

export function signupWatcher(params) {
  return { type: 'SIGNUP_WATCHER', payload: params }
}