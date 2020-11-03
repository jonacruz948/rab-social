import axios from 'axios'

import { URI as t } from '../constant'

export function addComments(token, userID, cardID, message) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  return axios.post(t.ADD_COMMENT_TO_CARD, { userID, cardID, message }, config)
}

export function getComments(cardID) {
  return axios.get(t.GET_COMMENTS_CARD(cardID))
}
