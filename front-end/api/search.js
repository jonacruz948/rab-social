import fetch from 'isomorphic-fetch'
import axios from 'axios'

export function search(term, userID = null) {
  return fetch(`${process.env.apiPath}/api/search?keywords=${term}&userID=${userID}`)
}

export function onSView(token, userID, type, cbID) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const body = {userID, type, cbID};

  return axios.post(`${process.env.apiPath}/api/search/view`, body, config);
}