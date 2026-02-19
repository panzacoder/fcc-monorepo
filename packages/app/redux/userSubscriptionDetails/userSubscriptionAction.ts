import {
  GET_SUBSCRIPTION_DETAILS,
  SET_SUBSCRIPTION_DETAILS
} from './userSubscriptionTypes'

const getSubscriptionDetails = () => {
  return {
    type: GET_SUBSCRIPTION_DETAILS
  }
}

const setSubscriptionDetails = (data) => {
  return {
    type: SET_SUBSCRIPTION_DETAILS,
    payload: data
  }
}

const subcriptionDetailsAction = {
  getSubscriptionDetails,
  setSubscriptionDetails
}

export default subcriptionDetailsAction
