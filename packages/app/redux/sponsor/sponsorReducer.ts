import { GET_SPONSOR, SET_SPONSOR } from './sponsorTypes'
import type { AnyAction } from 'redux'

const initialState = {
  header: {}
}

const sponsorReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_SPONSOR:
      return {
        ...state
      }
    case SET_SPONSOR:
      return {
        ...state,
        header: action.payload
      }
    default:
      return state
  }
}

export default sponsorReducer
