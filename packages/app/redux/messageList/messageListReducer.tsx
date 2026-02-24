import { GET_MESSAGE_LIST, SET_MESSAGE_LIST } from './messageListTypes'
import type { MessageListAction } from './messageListAction'

interface MessageListState {
  messageList: Record<string, unknown>[]
}

const initialState: MessageListState = {
  messageList: []
}

const messageListReducer = (
  state = initialState,
  action: MessageListAction
): MessageListState => {
  switch (action.type) {
    case GET_MESSAGE_LIST:
      return {
        ...state
      }
    case SET_MESSAGE_LIST:
      return {
        ...state,
        messageList: action.payload
      }
    default:
      return state
  }
}

export default messageListReducer
