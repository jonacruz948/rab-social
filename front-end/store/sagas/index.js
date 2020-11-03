import { takeLatest } from 'redux-saga/effects'

import {
  loginSaga,
  signupSaga,
  logoutSaga,
  loginWithSocialSaga,
  addDidActionSaga,
  getUserProfileSaga,
  bookmarkBoardSaga,
  removeBookmarkFromBoardSaga,
} from './functions'

export default function* SagaWatchers() {
  yield takeLatest('LOGIN_WATCHER', loginSaga)
  yield takeLatest('SOCIAL_LOGIN_WATCHER', loginWithSocialSaga)
  yield takeLatest('SIGNUP_WATCHER', signupSaga)
  yield takeLatest('LOGOUT_WATCHER', logoutSaga)
  yield takeLatest('UPDATE_ACTIONS_ON_PROFILE_WATCHER', addDidActionSaga)
  yield takeLatest('GET_USER_PROFILE_WATCHER', getUserProfileSaga)
  yield takeLatest('BOOKMARK_BOARD_WATCHER', bookmarkBoardSaga)
  yield takeLatest(
    'REMOVE_BOOKMARK_FROM_BOARD_WATCHER',
    removeBookmarkFromBoardSaga
  )
}
