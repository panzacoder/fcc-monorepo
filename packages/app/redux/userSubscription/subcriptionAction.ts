import { GET_SUBSCRIPTION, SET_SUBSCRIPTION } from './subscriptionTypes'

const getSubscription = () => {
  return {
    type: GET_SUBSCRIPTION
  }
}

const setSubscription = (data) => {
  return {
    type: SET_SUBSCRIPTION,
    payload: data
  }
}

const subcriptionAction = { getSubscription, setSubscription }

export default subcriptionAction
