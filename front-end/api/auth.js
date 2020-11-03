import axios from 'axios'

import { URI as t } from '../constant'

export function register({ formData }) {
  return axios.post(t.USER_SIGNUP, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function login({ email, userName, password }) {
  let auth = {
    email,
    userName,
    password,
  }
  return axios.post(t.USER_LOGIN, auth)
}

export function loginWithSocial({ email, fullName, userName, avatar }) {
  return axios.post(t.LOGIN_WITH_SOCIAL, {
    email,
    fullName,
    userName,
    avatar,
  })
}

export function logout(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.post(`${process.env.apiPath}/api/users/me/logout`, {}, config)
}

export function ping(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.get(`${process.env.apiPath}/api/users/ping`, config)
}
