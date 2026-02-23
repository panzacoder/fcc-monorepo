import { GET_HEADER, SET_HEADER } from './headerTypes'
import type { HeaderAction } from './headerAction'

interface HeaderState {
  header: Record<string, unknown>
}

const initialState: HeaderState = {
  header: {}
}

const headerReducer = (
  state = initialState,
  action: HeaderAction
): HeaderState => {
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
