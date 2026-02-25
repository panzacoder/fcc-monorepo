import {
  GET_CURRENT_MEMBER_ADDRESS,
  SET_CURRENT_MEMBER_ADDRESS
} from './currentMemberAddressTypes'

const getMemberAddress = () => {
  return {
    type: GET_CURRENT_MEMBER_ADDRESS
  } as const
}

const setMemberAddress = (data: Record<string, unknown>) => {
  return {
    type: SET_CURRENT_MEMBER_ADDRESS,
    payload: data
  } as const
}

export type CurrentMemberAddressAction =
  | ReturnType<typeof getMemberAddress>
  | ReturnType<typeof setMemberAddress>

const currentMemberAddressAction = { getMemberAddress, setMemberAddress }

export default currentMemberAddressAction
