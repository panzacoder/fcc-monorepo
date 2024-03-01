import {
  StaticDataState,
  StaticDataActionProps,
  StaticDataActionTypes
} from './staticTypes'

const initialState = {
  staticData: {}
}

const staticReducer = (
  state: StaticDataState = initialState,
  action: StaticDataActionProps
): StaticDataState => {
  switch (action.type) {
    case StaticDataActionTypes.GET_STATIC_DATA:
      return {
        ...state
      }
    case StaticDataActionTypes.SET_STATIC_DATA:
      return {
        ...state,
        staticData: action.payload
      }
    default:
      return state
  }
}

export default staticReducer
