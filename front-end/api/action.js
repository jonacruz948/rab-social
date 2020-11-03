import axios from 'axios'

import { URI as t } from '../constant'

export function getActionPageCarousel() {
  return axios.get(t.GET_ACTION_PAGE_CAROUSEL)
}

export function getActionList({ Authorization, userID }) {
  return axios.get(t.GET_ACTION_PAGE_ACTIONLIST(userID), {
    headers: {
      Authorization,
    },
  })
}

export function getUserByPoints() {
  return axios.get(t.GET_USER_BY_POINTS)
}
