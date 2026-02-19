import {
  GET_CURRENT_MEMBER_ADDRESS,
  SET_CURRENT_MEMBER_ADDRESS
} from './currentMemberAddressTypes'

const getMemberAddress = () => {
  return {
    type: GET_CURRENT_MEMBER_ADDRESS
  }
}

const setMemberAddress = (data) => {
  return {
    type: SET_CURRENT_MEMBER_ADDRESS,
    payload: data
  }
}

const currentMemberAddressAction = { getMemberAddress, setMemberAddress }

export default currentMemberAddressAction
