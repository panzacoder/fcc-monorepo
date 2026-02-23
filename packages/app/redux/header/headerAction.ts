import { GET_HEADER, SET_HEADER } from './headerTypes'

const getHeader = () => {
  return {
    type: GET_HEADER
  } as const
}

const setHeader = (data: Record<string, unknown>) => {
  return {
    type: SET_HEADER,
    payload: data
  } as const
}

export type HeaderAction =
  | ReturnType<typeof getHeader>
  | ReturnType<typeof setHeader>

const headerAction = { getHeader, setHeader }

export default headerAction
