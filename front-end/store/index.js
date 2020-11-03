import { applyMiddleware, createStore } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducer'
import sagaWatchers from './sagas'

const saga = createSagaMiddleware()

const initStore = (initialState) => {
  const store = createStore(rootReducer, initialState, applyMiddleware(saga))

  saga.run(sagaWatchers)

  return store
}

export const wrapper = createWrapper(initStore, { debug: true })
