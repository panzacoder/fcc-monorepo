import { GET_MEMBER_NAMES, SET_MEMBER_NAMES } from './memberNamesTypes'

const getMemberNames = () => {
  return {
    type: GET_MEMBER_NAMES
  } as const
}

const setMemberNames = (data: string[]) => {
  return {
    type: SET_MEMBER_NAMES,
    payload: data
  } as const
}

export type MemberNamesAction =
  | ReturnType<typeof getMemberNames>
  | ReturnType<typeof setMemberNames>

const memberProfileAction = { getMemberNames, setMemberNames }

export default memberProfileAction
