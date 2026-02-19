import { GET_HEADER, SET_HEADER } from './headerTypes'

const getHeader = () => {
  return {
    type: GET_HEADER
  }
}

const setHeader = (data: any) => {
  return {
    type: SET_HEADER,
    payload: data
  }
}

const headerAction = { getHeader, setHeader }

export default headerAction
