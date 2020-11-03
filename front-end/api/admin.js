import axios from 'axios'

import { URI as t } from '../constant'

export function adminLogin({ email, password }) {
  return axios.post(t.ADMIN_LOGIN, {
    email,
    password,
  })
}

export function adminRegisterTags({ email, tags }) {
  return axios.post(t.ADMIN_REGISTER, {
    email,
    tags,
  })
}

export function getAllBoards() {
  return axios.get(t.GET_ALL_BOARDS_ADMIN)
}

export function getAllMediaCards() {
  return axios.get(t.GET_ALL_MEDIA_CARDS_ADMIN)
}

export function getAllActionCards() {
  return axios.get(t.GET_ALL_ACTION_CARDS_ADMIN)
}

export function createNewSection({ boards, cards, tags, sectionTitle }) {
  return axios.post(t.CREATE_NEW_SECTION, {
    boards,
    cards,
    tags,
    sectionTitle,
  })
}

export function getAllSections() {
  return axios.get(t.GET_ALL_SECTIONS)
}

export function removeSection({ sectionID }) {
  return axios({
    method: 'delete',
    url: t.REMOVE_SECTION,
    data: {
      sectionID,
    },
  })
}

export function updateSection({
  sectionID,
  boards,
  cards,
  tags,
  sectionTitle,
}) {
  return axios.put(t.UPDATE_SECTION, {
    sectionID,
    boards,
    cards,
    tags,
    sectionTitle,
  })
}
export function getSection({ sectionID }) {
  return axios.get(t.GET_SECTION(sectionID))
}
