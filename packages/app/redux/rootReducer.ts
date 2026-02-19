import { combineReducers } from 'redux'
import headerReducer from './header/headerReducer'
import staticDataReducer from './staticData/staticReducer'
import sponsorReducer from './sponsor/sponsorReducer'
import paidAdReducer from './paidAdvertiser/paidAdReducer'
import userProfileReducer from './userProfile/userProfileReducer'
import subscriptionReducer from './userSubscription/subscriptionReducer'
import subscriptionDetailsReducer from './userSubscriptionDetails/userSubscriptionReducer'
import currentMemberAddressReducer from './curenMemberAddress/currentMemberAddressReducer'
import memberNamesReducer from './memberNames/memberNamesReducer'
import messageListReducer from './messageList/messageListReducer'

const appReducer = combineReducers({
  headerState: headerReducer,
  staticDataState: staticDataReducer,
  userProfileState: userProfileReducer,
  sponsor: sponsorReducer,
  paidAdvertiser: paidAdReducer,
  subscriptionState: subscriptionReducer,
  subscriptionDetailsState: subscriptionDetailsReducer,
  currentMemberAddress: currentMemberAddressReducer,
  memberNames: memberNamesReducer,
  messageList: messageListReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_ACTION' || action.type === 'USER_LOGOUT') {
    state = undefined
  }

  if (action.type === 'HYDRATE' && action.payload) {
    return { ...state, ...action.payload }
  }

  return appReducer(state, action)
}
export default rootReducer
