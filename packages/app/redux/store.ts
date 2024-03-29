import { legacy_createStore as createStore } from 'redux'
import rootReducer from './rootReducer'
import StateLoader from './stateLoader'

import { composeWithDevTools } from 'redux-devtools-extension'

const stateLoader = new StateLoader()

const store = createStore(
  rootReducer,
  stateLoader.loadState(),
  composeWithDevTools()
)
store.subscribe(() => {
  stateLoader.saveState(store.getState())
})
export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
