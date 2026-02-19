import {
  GET_SUBSCRIPTION_DETAILS,
  SET_SUBSCRIPTION_DETAILS
} from './userSubscriptionTypes'

const initialState = {
  subscriptionDetails: {}
}

const subscriptionDetailsReducer = (state = initialState, action) => {
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
