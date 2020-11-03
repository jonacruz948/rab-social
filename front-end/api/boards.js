import fetch from 'isomorphic-fetch'
import axios from 'axios'

import { URI as t } from '../constant'

export function getBoards() {
  return fetch(`${process.env.apiPath}/api/boards`)
}

export function getBoard(slug) {
  return axios.get(`${t.GET_BOARD_DATA}/${slug}`)
}

export function deleteCardsFromBoard({
  Authorization,
  userID,
  cards,
  boardID,
}) {
  return axios.put(
    `${t.DELETE_CARDS_FROM_BOARD}/${boardID}/deletecards`,
    {
      cards,
      userID,
    },
    {
      headers: {
        Authorization,
      },
    }
  )
}

export function getRecommendations({ hashTags, Authorization }) {
  return axios.get(`${t.GET_RECOMMENDATIONS}`, {
    params: {
      hashTags,
    },
    headers: {
      Authorization,
    },
  })
}

export function updateBoardMainContents({
  Authorization,
  name,
  bio,
  tags,
  boardID,
}) {
  return axios.put(
    t.UPDATE_BOARD_MAIN_CONTENTS,
    {
      boardID,
      name,
      bio,
      tags,
    },
    {
      headers: {
        Authorization,
      },
    }
  )
}

export function uploadBoardCoverImage({ Authorization, formData }) {
  return axios.post(t.UPLOAD_BOARD_IMAGE, formData, {
    headers: {
      Authorization,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function createBoard({ Authorization, formData }) {
  return axios.post(t.CREATE_NEW_BOARD, formData, {
    headers: {
      Authorization,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function deleteBoard({ Authorization, boardID, userID }) {
  return axios({
    method: 'delete',
    url: t.DELETE_BOARD,
    data: {
      userID,
      boardID,
    },
    headers: {
      Authorization,
    },
  })
}

export function updateBoard(token, board) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.post(`${process.env.apiPath}/api/boards/update`, board, config)
}

export function getUsersBoards(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.get(`${process.env.apiPath}/api/users/me/boards`, config)
}

export function addCardToBoard(token, board, card, message) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const body = {
    cardID: card,
    message: message,
  }

  return axios.put(
    `${process.env.apiPath}/api/boards/${board}/cards`,
    body,
    config
  )
}

export function bookmarkBoard({ Authorization, boardID, userID, creatorID }) {
  return axios.put(
    t.BOOKMARK_BOARD,
    {
      boardID,
      userID,
      creatorID,
    },
    {
      headers: {
        Authorization,
      },
    }
  )
}

export function removeBookmarkBoard({
  Authorization,
  boardID,
  userID,
  creatorID,
}) {
  return axios({
    method: 'delete',
    url: t.REMOVE_BOOKMARK_BOARD,
    headers: {
      Authorization,
    },
    data: {
      boardID,
      userID,
      creatorID,
    },
  })
}

export function getBookmarkBoard({ Authorization, userID }) {
  return axios.get(`${t.GET_BOARD_DATA}/${userID}/bookmark-boards`, {
    headers: {
      Authorization,
    },
  })
}

export function makeBoard(token, name, purpose, bio) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const body = {
    name: name,
    purpose: purpose,
    bio: bio,
  }

  return axios.put(`${process.env.apiPath}/api/boards`, body, config)
}

export function shareBoard(
  accessToken,
  title,
  text,
  shareUrl,
  shareThumbnailUrl
) {
  const body = {
    accessToken,
    title,
    text,
    shareUrl,
    shareThumbnailUrl,
  }

  return axios.post(`${process.env.apiPath}/api/linkedin/share`, body)
}

export function getShortenURL({ Authorization, url }) {
  return axios.get(t.GET_SHARABLE_LINK, {
    params: {
      url,
    },
    headers: {
      Authorization,
    },
  })
}

export function addComments(token, userID, boardID, message) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.post(
    `${process.env.apiPath}/api/boards/comments/add`,
    { userID, boardID, message },
    config
  )
}

export function getComments(boardID) {
  return fetch(`${process.env.apiPath}/api/boards/comments/${boardID}`)
}

export function findMoreIdeas(boardID) {
  return axios.get(t.FIND_MORE_IDEAS(boardID))
}

export function shareBoardCount({ Authorization, boardID }) {
  return axios.post(
    t.UPDATE_BOARD_DOWNLOAD_COUNT(boardID),
    {},
    {
      headers: {
        Authorization,
      },
    }
  )
}
