import { GET_MESSAGE_LIST, SET_MESSAGE_LIST } from './messageListTypes'

const getMessageList = () => {
  return {
    type: GET_MESSAGE_LIST
  } as const
}

const setMessageList = (data: Record<string, unknown>[]) => {
  return {
    type: SET_MESSAGE_LIST,
    payload: data
  } as const
}

export type MessageListAction =
  | ReturnType<typeof getMessageList>
  | ReturnType<typeof setMessageList>

const messageProfileAction = { getMessageList, setMessageList }

export default messageProfileAction
