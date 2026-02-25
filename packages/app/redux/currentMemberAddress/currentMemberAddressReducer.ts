import {
  GET_CURRENT_MEMBER_ADDRESS,
  SET_CURRENT_MEMBER_ADDRESS
} from './currentMemberAddressTypes'
import type { CurrentMemberAddressAction } from './currentMemberAddressAction'

interface CurrentMemberAddressState {
  currentMemberAddress: Record<string, unknown>
}

const initalState: CurrentMemberAddressState = {
  currentMemberAddress: {}
}

const currentMemberAddressReducer = (
  state = initalState,
  action: CurrentMemberAddressAction
): CurrentMemberAddressState => {
  switch (action.type) {
    case GET_CURRENT_MEMBER_ADDRESS:
      return {
        ...state
      }
    case SET_CURRENT_MEMBER_ADDRESS:
      return {
        ...state,
        currentMemberAddress: action.payload
      }
    default:
      return state
  }
}

export default currentMemberAddressReducer
