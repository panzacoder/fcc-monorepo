import { GET_PAID_AD, SET_PAID_AD } from './paidAdTypes'

const getPaidAd = () => {
  return {
    type: GET_PAID_AD
  }
}

const setPaidAd = (data: unknown) => {
  return {
    type: SET_PAID_AD,
    payload: data
  }
}

const paidAdAction = { getPaidAd, setPaidAd }

export default paidAdAction
