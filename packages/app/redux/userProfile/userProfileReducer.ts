import { GET_USER_PROFILE, SET_USER_PROFILE } from './userProfileTypes'
import type { AnyAction } from 'redux'

const initialState = {
  header: {}
}

const userProfileReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {
        ...state
      }
    case SET_USER_PROFILE:
      return {
        ...state,
        header: action.payload
      }
    default:
      return state
  }
}

export default userProfileReducer
