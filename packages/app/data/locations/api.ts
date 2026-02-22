import { fetchData, type AuthHeader } from '../base'
import {
  GET_STATES_AND_TIMEZONES,
  CREATE_DOCTOR_LOCATION,
  CREATE_FACILITY_LOCATION,
  UPDATE_DOCTOR_LOCATION,
  UPDATE_FACILITY_LOCATION,
  DELETE_DOCTOR_LOCATION,
  DELETE_FACILITY_LOCATION
} from 'app/utils/urlConstants'
import type {
  StatesAndTimezonesResponse,
  GetStatesAndTimezonesParams,
  CreateDoctorLocationParams,
  CreateFacilityLocationParams,
  UpdateDoctorLocationParams,
  UpdateFacilityLocationParams,
  DeleteDoctorLocationParams,
  DeleteFacilityLocationParams
} from './types'

export async function getStatesAndTimezones(
  header: AuthHeader,
  params: GetStatesAndTimezonesParams
) {
  return fetchData<StatesAndTimezonesResponse>({
    header,
    route: GET_STATES_AND_TIMEZONES,
    data: { country: { id: params.countryId } }
  })
}

export async function createDoctorLocation(
  header: AuthHeader,
  params: CreateDoctorLocationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_DOCTOR_LOCATION,
    data: params
  })
}

export async function createFacilityLocation(
  header: AuthHeader,
  params: CreateFacilityLocationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_FACILITY_LOCATION,
    data: params
  })
}

export async function updateDoctorLocation(
  header: AuthHeader,
  params: UpdateDoctorLocationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_DOCTOR_LOCATION,
    data: params
  })
}

export async function updateFacilityLocation(
  header: AuthHeader,
  params: UpdateFacilityLocationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_FACILITY_LOCATION,
    data: params
  })
}

export async function deleteDoctorLocation(
  header: AuthHeader,
  params: DeleteDoctorLocationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_DOCTOR_LOCATION,
    data: params
  })
}

export async function deleteFacilityLocation(
  header: AuthHeader,
  params: DeleteFacilityLocationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_FACILITY_LOCATION,
    data: params
  })
}
