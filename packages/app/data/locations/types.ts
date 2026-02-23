import type { Address, Country, State, Timezone } from '../types.d'

export interface StatesAndTimezonesResponse {
  country: Country
  stateList: State[]
  timeZoneList: Timezone[]
}

export interface GetStatesAndTimezonesParams {
  countryId: number
}

export interface LocationData {
  shortDescription: string
  nickName: string
  fax?: string
  website?: string
  phone?: string
  operation?: string
  id?: number | string
  address: Partial<Address> & { id?: number | string }
}

export interface DoctorLocationData extends LocationData {
  doctor: {
    id: number | string
    member?: { id: number | string }
  }
}

export interface FacilityLocationData extends LocationData {
  facility: {
    id: number | string
    member?: { id: number | string }
  }
}

export interface CreateDoctorLocationResponse {
  doctor: {
    id: number
    [key: string]: unknown
  }
}

export interface CreateFacilityLocationResponse {
  facility: {
    id: number
    [key: string]: unknown
  }
}

export interface CreateDoctorLocationParams {
  doctorLocation: DoctorLocationData
}

export interface CreateFacilityLocationParams {
  facilityLocation: FacilityLocationData
}

export interface UpdateDoctorLocationParams {
  doctorLocation: DoctorLocationData
}

export interface UpdateFacilityLocationParams {
  facilityLocation: FacilityLocationData
}

export interface DeleteDoctorLocationParams {
  doctorLocation: {
    id: number
    doctor: { id: number }
  }
}

export interface DeleteFacilityLocationParams {
  facilityLocation: { id: number | string }
}
