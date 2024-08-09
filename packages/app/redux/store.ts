import { createStore, compose } from 'redux'
import rootReducer from './rootReducer'
import StateLoader from './stateLoader'

const stateLoader = new StateLoader()

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose
  }
}
const enhancers = compose(
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f: any) => f
)
const store = createStore(rootReducer, stateLoader.loadState(), enhancers)
store.subscribe(() => {
  stateLoader.saveState(store.getState())
})
export default store
