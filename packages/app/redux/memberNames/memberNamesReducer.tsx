import { GET_MEMBER_NAMES, SET_MEMBER_NAMES } from './memberNamesTypes'
import type { MemberNamesAction } from './memberNamesAction'

interface MemberNamesState {
  memberNames: string[]
  memberNamesList?: string[]
}

const initialState: MemberNamesState = {
  memberNames: []
}

const memberNamesReducer = (
  state = initialState,
  action: MemberNamesAction
): MemberNamesState => {
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
