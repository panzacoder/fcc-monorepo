import { StaticData } from 'app/data/static'

export enum StaticDataActionTypes {
  GET_STATIC_DATA = 'GET_STATIC_DATA',
  SET_STATIC_DATA = 'SET_STATIC_DATA'
}

export interface StaticDataState {
  staticData: StaticData | {}
}
export type StaticDataActionProps =
  | {
    type: StaticDataActionTypes.GET_STATIC_DATA
  }
  | {
    type: StaticDataActionTypes.SET_STATIC_DATA
    payload: StaticData
  }
