import { GET_PAID_AD, SET_PAID_AD } from './paidAdTypes'
import type { AnyAction } from 'redux'

const initialState = {
  header: {}
}

const paidAdReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_PAID_AD:
      return {
        ...state
      }
    case SET_PAID_AD:
      return {
        ...state,
        header: action.payload
      }
    default:
      return state
  }
}

export default paidAdReducer
