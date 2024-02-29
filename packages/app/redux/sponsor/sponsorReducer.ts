import { GET_SPONSOR, SET_SPONSOR } from './sponsorTypes'

const initialState = {
  header: {}
}

const sponsorReducer = (state = initialState, action) => {
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
