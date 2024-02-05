import { combineReducers } from 'redux'
import headerReducer from './header/headerReducer'

const appReducer = combineReducers({
  headerState: headerReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ACTION' || action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}
export default rootReducer
