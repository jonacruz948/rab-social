import { put, call } from 'redux-saga/effects'

import * as authAPI from '../../api/auth'
import * as cardAPI from '../../api/cards'
import * as userAPI from '../../api/user'
import * as boardAPI from '../../api/boards'

import {
  userLogin,
  userLoginFailed,
  userSignup,
  signUpFailed,
  userLogOut,
  getUserProfile,
  updateActionsOnProfile,
  bookmarkBoard,
  removeBookmarkFromBoard,
} from '../actions'

export function* loginSaga({ payload }) {
  try {
    const loginData = yield authAPI.login({ ...payload })
    const { result, token, user, profile } = loginData.data
    if (!result) {
      if (token && user) {
        yield put(userLogin({ token, user, profile }))
      }
    } else {
      yield put(userLoginFailed())
    }
  } catch (e) {
    yield put(userLoginFailed())
  }
}

export function* loginWithSocialSaga({ payload }) {
  try {
    const { data } = yield authAPI.loginWithSocial({ ...payload })
    const { token, user, profile } = data
    yield put(userLogin({ token, user, profile }))
  } catch (e) {
    console.log(e)
    yield put(userLoginFailed())
  }
}

export function* signupSaga({ payload }) {
  try {
    const result = yield authAPI.register({ ...payload })
    const { result: code } = result.data
    if (code === 0) {
      const { token, user, profile } = result.data
      yield put(userSignup({ token, user, profile }))
    } else {
      const { message } = result.data
      yield put(signUpFailed({ message }))
    }
  } catch (e) {}
}

export function* logoutSaga() {
  yield put(userLogOut())
}

export function* addDidActionSaga({ payload }) {
  const { userID, actionID, type } = payload
  const res = yield userAPI.updateActionsOnProfile({ userID, actionID, type })
  const { resultCode } = res.data
  if (resultCode === 0) {
    yield put(updateActionsOnProfile({ actionID, type }))
  } else {
  }
  try {
  } catch (e) {}
}

export function* getUserProfileSaga({ payload }) {
  const { userID } = payload
  try {
    const res = yield userAPI.getProfile(userID)
    yield put(getUserProfile(res.data))
  } catch (e) {}
}

export function* bookmarkBoardSaga({ payload }) {
  const { Authorization, userID, boardID, creatorID } = payload

  try {
    const { data } = yield boardAPI.bookmarkBoard({
      Authorization,
      boardID,
      userID,
      creatorID,
    })

    if (data.result === 0) {
      yield put(bookmarkBoard({ boardID, userID }))
    }
  } catch (e) {
    console.log(e)
  }
}

export function* removeBookmarkFromBoardSaga({ payload }) {
  const { Authorization, userID, boardID, creatorID } = payload
  try {
    const res = yield boardAPI.removeBookmarkBoard({
      Authorization,
      boardID,
      userID,
      creatorID,
    })
    if (res.data.result === 0) {
      yield put(removeBookmarkFromBoard({ boardID, userID }))
    }
  } catch (e) {}
}
