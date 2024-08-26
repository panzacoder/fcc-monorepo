import { GET_MESSAGE_LIST, SET_MESSAGE_LIST } from './messageListTypes'

const initialState = {
  messageList: []
}

const messageListReducer = (state = initialState, action: any) => {
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
