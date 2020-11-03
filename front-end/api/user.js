import axios from 'axios'

import { URI as t } from '../constant'

export function getProfile(userID) {
  return axios.get(`${process.env.apiPath}/api/profile/${userID}`)
}

export function updateProfileInfo({ profile, userID, Authorization }) {
  return axios.post(
    `${t.UPDATE_PROFILE_INFO}/${userID}/update`,
    { profile },
    {
      headers: {
        Authorization,
        'Content-Type': 'application/json',
      },
    }
  )
}

export function updateActionsOnProfile({
  userID,
  actionID,
  actionKeyword,
  type,
}) {
  return axios.put(`${t.UPDATE_ACTIONS_ON_PROFILE}/${userID}`, {
    userID,
    actionID,
    actionKeyword,
    type,
  })
}

export function getActionsData({ Authorization, userID }) {
  return axios.get(`${t.GET_ACTIONS_FROM_PROFILE}/${userID}/get-actions`, {
    headers: {
      Authorization,
    },
  })
}
export function getUserBoards({ Authorization, userID }) {
  return axios.get(`${t.GET_USER_BOARDS}`, {
    params: {
      userID,
    },
    headers: {
      Authorization,
    },
  })
}

export function uploadProfileAvatar({ Authorization, formData, userID }) {
  return axios.post(
    `${t.UPLOAD_PROFILE_AVATAR}/${userID}/upload-avatar`,
    formData,
    {
      headers: {
        Authorization,
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

export function getBoardStats({ Authorization, userID }) {
  return axios.get(t.GET_PROFILE_BOARD_STATS(userID), {
    headers: {
      Authorization,
    },
  })
}
