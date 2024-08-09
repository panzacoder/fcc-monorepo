import { GET_MEMBER_NAMES, SET_MEMBER_NAMES } from './memberNamesTypes'

const initialState = {
  memberNames: []
}

const memberNamesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_MEMBER_NAMES:
      return {
        ...state
      }
    case SET_MEMBER_NAMES:
      return {
        ...state,
        memberNamesList: action.payload
      }
    default:
      return state
  }
}

export default memberNamesReducer
