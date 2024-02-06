import { GET_HEADER, SET_HEADER } from './headerTypes'

const initialState = {
  header: {}
}

const headerReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_HEADER:
      return {
        ...state
      }
    case SET_HEADER:
      return {
        ...state,
        header: action.payload
      }
    default:
      return state
  }
}

export default headerReducer
