import { GET_STATIC_DATA, SET_STATIC_DATA } from './staticTypes'

const initialState = {
  staticData: {}
}

const staticReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_STATIC_DATA:
      return {
        ...state
      }
    case SET_STATIC_DATA:
      return {
        ...state,
        staticData: action.payload
      }
    default:
      return state
  }
}

export default staticReducer
