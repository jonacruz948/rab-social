import axios from 'axios'

import { URI as t } from '../constant'

export function getExplorePageCarousel() {
  return axios.get(t.GET_EXPLORE_PAGE_CAROUSEL)
}

export function getExplorePageTrends() {
  return axios.get(t.GET_EXPLORE_PAGE_TRENDS)
}

export function getExploreTrendBoards() {
  return axios.get(t.GET_EXPLORE_PAGE_TRENDS_BOARD)
}

export function getExplorePageCardsByBoards({ Authorization, userID }) {
  return axios.get(t.GET_EXPLORE_PAGE_CARDS_BY_BOARD(userID), {
    headers: {
      Authorization,
    },
  })
}

export function getExplorePageCardsByLocation({ Authorization, userID }) {
  return axios.get(t.GET_EXPLORE_PAGE_CARDS_BY_LOCATION(userID), {
    headers: {
      Authorization,
    },
  })
}

export function getSearchResult({ searchWords }) {
  return axios.get(t.GET_SEARCH_RESULTS, {
    params: {
      searchWords,
    },
  })
}
