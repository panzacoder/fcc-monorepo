import {
  GET_CURRENT_MEMBER_ADDRESS,
  SET_CURRENT_MEMBER_ADDRESS
} from './currentMemberAddressTypes'

const initalState = {
  currentMemberAddress: {}
}

const currentMemberAddressReducer = (state = initalState, action) => {
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
