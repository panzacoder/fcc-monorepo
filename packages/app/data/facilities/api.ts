import { fetchData, type AuthHeader } from '../base'
import {
  GET_MEMBER_FACILITIES,
  GET_FACILITY_DETAILS,
  CREATE_FACILITY,
  UPDATE_FACILITY,
  DELETE_FACILITY,
  CREATE_FACILITY_LOCATION,
  UPDATE_FACILITY_LOCATION,
  DELETE_FACILITY_LOCATION,
  GET_PHARMACY_LIST,
  SHARE_CONTACT_INFO
} from 'app/utils/urlConstants'
import type {
  FacilityListResponse,
  FacilityDetailsResponse,
  GetMemberFacilitiesParams,
  GetFacilityDetailsParams,
  CreateFacilityParams,
  UpdateFacilityParams,
  DeleteFacilityParams,
  CreateFacilityLocationParams,
  UpdateFacilityLocationParams,
  DeleteFacilityLocationParams,
  PharmacyListResponse,
  ShareFacilityParams
} from './types'

export async function getMemberFacilities(
  header: AuthHeader,
  params: GetMemberFacilitiesParams
) {
  return fetchData<FacilityListResponse>({
    header,
    route: GET_MEMBER_FACILITIES,
    data: { facility: { member: { id: params.memberId } } }
  })
}

export async function getFacilityDetails(
  header: AuthHeader,
  params: GetFacilityDetailsParams
) {
  return fetchData<FacilityDetailsResponse>({
    header,
    route: GET_FACILITY_DETAILS,
    data: { facility: { id: params.id } }
  })
}

export async function createFacility(
  header: AuthHeader,
  params: CreateFacilityParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_FACILITY,
    data: params
  })
}

export async function updateFacility(
  header: AuthHeader,
  params: UpdateFacilityParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_FACILITY,
    data: params
  })
}

export async function deleteFacility(
  header: AuthHeader,
  params: DeleteFacilityParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_FACILITY,
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

export async function getPharmacyList(
  header: AuthHeader,
  params: GetMemberFacilitiesParams
) {
  return fetchData<PharmacyListResponse>({
    header,
    route: GET_PHARMACY_LIST,
    data: { facility: { member: { id: params.memberId } } }
  })
}

export async function shareFacility(
  header: AuthHeader,
  params: ShareFacilityParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: SHARE_CONTACT_INFO,
    data: params
  })
}
