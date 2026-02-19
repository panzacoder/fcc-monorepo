import { legacy_createStore as createStore } from 'redux'
import rootReducer from './rootReducer'
import StateLoader from './stateLoader'

import { composeWithDevTools } from 'redux-devtools-extension'

const stateLoader = new StateLoader()

const store = createStore(rootReducer, {}, composeWithDevTools())

store.subscribe(() => {
  stateLoader.saveState(store.getState())
})

export async function hydrateStore() {
  const savedState = await stateLoader.loadState()
  if (savedState && Object.keys(savedState).length > 0) {
    store.dispatch({ type: 'HYDRATE', payload: savedState })
  }
}

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
