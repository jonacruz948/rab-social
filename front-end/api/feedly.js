import axios from 'axios'

import { URI as t } from '../constant'

export const getFeeds = () => {
  return axios.get(t.GET_FEEDS_FROM_FEEDLY)
}