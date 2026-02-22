import { fetchData, type AuthHeader } from '../base'
import {
  GET_PRESCRIPTION_LIST,
  GET_PRESCRIPTION,
  CREATE_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
  DELETE_PRESCRIPTION
} from 'app/utils/urlConstants'
import type {
  PrescriptionListResponse,
  PrescriptionDetailResponse,
  GetPrescriptionListParams,
  GetPrescriptionParams,
  CreatePrescriptionParams,
  UpdatePrescriptionParams,
  DeletePrescriptionParams
} from './types'

export async function getPrescriptionList(
  header: AuthHeader,
  params: GetPrescriptionListParams
) {
  const { memberId, ...filters } = params
  return fetchData<PrescriptionListResponse>({
    header,
    route: GET_PRESCRIPTION_LIST,
    data: {
      member: { id: memberId },
      ...filters
    }
  })
}

export async function getPrescription(
  header: AuthHeader,
  params: GetPrescriptionParams
) {
  return fetchData<PrescriptionDetailResponse>({
    header,
    route: GET_PRESCRIPTION,
    data: {
      medicine: {
        id: params.id,
        member: { id: params.memberId }
      }
    }
  })
}

export async function createPrescription(
  header: AuthHeader,
  params: CreatePrescriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_PRESCRIPTION,
    data: params
  })
}

export async function updatePrescription(
  header: AuthHeader,
  params: UpdatePrescriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_PRESCRIPTION,
    data: params
  })
}

export async function deletePrescription(
  header: AuthHeader,
  params: DeletePrescriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_PRESCRIPTION,
    data: {
      medicine: {
        id: params.id,
        member: { id: params.memberId }
      }
    }
  })
}
