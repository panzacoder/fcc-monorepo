import { GET_STATIC_DATA, SET_STATIC_DATA } from './staticTypes'

const getStaticData = () => {
  return {
    type: GET_STATIC_DATA
  }
}

const setStaticData = (data: any) => {
  return {
    type: SET_STATIC_DATA,
    payload: data
  }
}

const staticDataAction = { getStaticData, setStaticData }

export default staticDataAction
