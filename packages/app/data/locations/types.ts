import type { Country, State, Timezone } from '../types.d'

export interface StatesAndTimezonesResponse {
  country: Country
  stateList: State[]
  timeZoneList: Timezone[]
}

export interface GetStatesAndTimezonesParams {
  countryId: number
}

export interface CreateDoctorLocationParams {
  doctorLocation: Record<string, unknown>
}

export interface CreateFacilityLocationParams {
  facilityLocation: Record<string, unknown>
}

export interface UpdateDoctorLocationParams {
  doctorLocation: Record<string, unknown>
}

export interface UpdateFacilityLocationParams {
  facilityLocation: Record<string, unknown>
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
