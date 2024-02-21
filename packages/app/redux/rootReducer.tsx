import { combineReducers } from 'redux'
import headerReducer from './header/headerReducer'
import staticDataReducer from './staticData/staticReducer'
import sponsororReducer from './sponsor/sponsororReducer'
import paidAdReducer from './paidAdvertiser/paidAdReducer'
import userProfileReducer from './userProfile/userProfileReducer'
import subscriptionReducer from './userSubscription/subscriptionReducer'
import subscriptionDetailsReducer from './userSubscriptionDetails/userSubscriptionReducer'

const appReducer = combineReducers({
  headerState: headerReducer,
  staticDataState: staticDataReducer,
  userProfileState: userProfileReducer,
  sponsor: sponsororReducer,
  paidAdvertiser: paidAdReducer,
  subscriptionState: subscriptionReducer,
  subscriptionDetailsState: subscriptionDetailsReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ACTION' || action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}
export default rootReducer
