import fetch from 'isomorphic-fetch'
import axios from 'axios'

import { URI as t } from '../constant'

const JSON_HEADERS = {
  'Content-Type': 'application/json',
}

export function getCards() {
  return fetch(t.GET_ALL_ACTION_CARDS)
}

export function getContentCards() {
  const headers = JSON_HEADERS
  return axios.get(t.GET_ALL_CONTENT_CARDS, headers)
}

export function getCard(slug) {
  return fetch(`${t.API_ENDPOINT}/api/cards/${slug}`)
}

export function bookmarkCardToBoard({
  Authorization,
  cards,
  boardID,
  cardID,
  userID,
}) {
  return axios.put(
    t.BOOKMARK_CARD_TO_BOARD,
    { cards, boardID, cardID, userID },
    {
      headers: {
        Authorization,
      },
    }
  )
}

export function removeCardBookmark({
  Authorization,
  userID,
  cardID,
  cardType,
}) {
  return axios.post(
    `${t.REMOVE_BOOKMARK_CARD_FROM_BOARD}`,
    { userID, cardID, cardType },
    {
      headers: { Authorization },
    }
  )
}

export function getHomeCarousel() {
  return axios.get(t.GET_HOME_CAROUSELS)
}

export function suggestCard({
  Authorization,
  email,
  userID,
  cause,
  description,
}) {
  return axios.post(
    t.SUGGEST_CARD,
    { email, userID, cause, description },
    {
      headers: {
        Authorization,
        ...JSON_HEADERS,
      },
    }
  )
}

export function updateDownloadCount({ Authorization, cardID }) {
  return axios.post(
    t.UPDATE_DOWNLOAD_COUNT(cardID),
    {},
    {
      headers: {
        Authorization,
        ...JSON_HEADERS,
      },
    }
  )
}
