import { StaticData } from 'app/data/static'
import { StaticDataActionProps, StaticDataActionTypes } from './staticTypes'

const getStaticData = (): StaticDataActionProps => {
  return {
    type: StaticDataActionTypes.GET_STATIC_DATA
  }
}

const setStaticData = (data: StaticData): StaticDataActionProps => {
  return {
    type: StaticDataActionTypes.SET_STATIC_DATA,
    payload: data
  }
}

const staticDataAction = { getStaticData, setStaticData }

export default staticDataAction
