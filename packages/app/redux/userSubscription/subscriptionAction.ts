import { GET_SUBSCRIPTION, SET_SUBSCRIPTION } from './subscriptionTypes'

const getSubscription = () => {
  return {
    type: GET_SUBSCRIPTION
  }
}

const setSubscription = (data: unknown) => {
  return {
    type: SET_SUBSCRIPTION,
    payload: data
  }
}

const subscriptionAction = { getSubscription, setSubscription }

export default subscriptionAction
