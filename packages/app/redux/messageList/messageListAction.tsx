import { GET_MESSAGE_LIST, SET_MESSAGE_LIST } from './messageListTypes'

const getMessageList = () => {
  return {
    type: GET_MESSAGE_LIST
  }
}

const setMessageList = (data: any) => {
  return {
    type: SET_MESSAGE_LIST,
    payload: data
  }
}

const messageProfileAction = { getMessageList, setMessageList }

export default messageProfileAction
