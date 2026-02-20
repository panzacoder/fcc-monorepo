import { fetchData, type AuthHeader } from '../base'
import {
  GET_MEMBER_DOCTORS,
  GET_DOCTOR_DETAILS,
  CREATE_DOCTOR,
  UPDATE_DOCTOR,
  DELETE_DOCTOR,
  CREATE_DOCTOR_LOCATION,
  UPDATE_DOCTOR_LOCATION,
  DELETE_DOCTOR_LOCATION,
  GET_ACTIVE_DOCTORS,
  SHARE_CONTACT_INFO
} from 'app/utils/urlConstants'
import type {
  DoctorListResponse,
  GetMemberDoctorsParams,
  DoctorDetailsResponse,
  GetDoctorDetailsParams,
  CreateDoctorParams,
  UpdateDoctorParams,
  DeleteDoctorParams,
  CreateDoctorLocationParams,
  UpdateDoctorLocationParams,
  DeleteDoctorLocationParams,
  GetActiveDoctorsParams,
  ActiveDoctorsResponse,
  ShareDoctorParams
} from './types'

export async function getMemberDoctors(
  header: AuthHeader,
  params: GetMemberDoctorsParams
) {
  return fetchData<DoctorListResponse>({
    header,
    route: GET_MEMBER_DOCTORS,
    data: { doctor: { member: { id: params.memberId } } }
  })
}

export async function getDoctorDetails(
  header: AuthHeader,
  params: GetDoctorDetailsParams
) {
  return fetchData<DoctorDetailsResponse>({
    header,
    route: GET_DOCTOR_DETAILS,
    data: { doctor: { id: params.id } }
  })
}

export async function createDoctor(
  header: AuthHeader,
  params: CreateDoctorParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_DOCTOR,
    data: params
  })
}

export async function updateDoctor(
  header: AuthHeader,
  params: UpdateDoctorParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_DOCTOR,
    data: params
  })
}

export async function deleteDoctor(
  header: AuthHeader,
  params: DeleteDoctorParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_DOCTOR,
    data: params
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

export async function getActiveDoctors(
  header: AuthHeader,
  params: GetActiveDoctorsParams
) {
  return fetchData<ActiveDoctorsResponse>({
    header,
    route: GET_ACTIVE_DOCTORS,
    data: { doctor: { member: { id: params.memberId } } }
  })
}

export async function shareDoctor(
  header: AuthHeader,
  params: ShareDoctorParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: SHARE_CONTACT_INFO,
    data: params
  })
}
