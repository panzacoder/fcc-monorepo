import {
  GET_SUBSCRIPTION_DETAILS,
  SET_SUBSCRIPTION_DETAILS
} from './userSubscriptionTypes'
import type { AnyAction } from 'redux'

const initialState = {
  subscriptionDetails: {}
}

const subscriptionDetailsReducer = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case GET_SUBSCRIPTION_DETAILS:
      return {
        ...state
      }
    case SET_SUBSCRIPTION_DETAILS:
      return {
        ...state,
        subscriptionDetails: action.payload
      }
    default:
      return state
  }
}

export default subscriptionDetailsReducer
