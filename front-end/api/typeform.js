import axios from 'axios'

import { TYPEFORM as t } from '../constant'

export function getSpecificTypeformResponse({
  Authorization,
  formID,
  responseID,
  userID,
}) {
  return axios.get(t.GET_SPECIFIC_TYPEFORM_RESPONSE, {
    headers: {
      Authorization,
    },
    params: {
      formID,
      responseID,
      userID,
    },
  })
}
