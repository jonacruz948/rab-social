export function login(data) {
  return { type: 'LOGIN_ASYNC', payload: data };
}

export function signup(token) {
  return { type: 'SIGNUP_ASYNC', payload: token };
}