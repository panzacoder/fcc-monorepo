import { fetchData, type AuthHeader } from '../base'
import {
  GET_MEMBER_CAREGIVERS,
  GET_CAREGIVER_DETAILS,
  CREATE_CAREGIVER,
  UPDATE_CAREGIVER,
  DELETE_CAREGIVER,
  FIND_CAREGIVER_BY_EMAIL_PHONE,
  RESEND_CAREGIVER_REQEST
} from 'app/utils/urlConstants'
import type {
  CaregiverListResponse,
  CaregiverDetailResponse,
  GetMemberCaregiversParams,
  GetCaregiverDetailsParams,
  CreateCaregiverParams,
  UpdateCaregiverParams,
  DeleteCaregiverParams,
  FindCaregiverByEmailPhoneParams,
  ResendCaregiverRequestParams
} from './types'

export async function getMemberCaregivers(
  header: AuthHeader,
  params: GetMemberCaregiversParams
) {
  return fetchData<CaregiverListResponse>({
    header,
    route: GET_MEMBER_CAREGIVERS,
    data: {
      familyMember: {
        memberId: params.memberId
      }
    }
  })
}

export async function getCaregiverDetails(
  header: AuthHeader,
  params: GetCaregiverDetailsParams
) {
  return fetchData<CaregiverDetailResponse>({
    header,
    route: GET_CAREGIVER_DETAILS,
    data: {
      familyMember: {
        id: params.id,
        memberId: params.memberId
      }
    }
  })
}

export async function createCaregiver(
  header: AuthHeader,
  params: CreateCaregiverParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_CAREGIVER,
    data: params
  })
}

export async function updateCaregiver(
  header: AuthHeader,
  params: UpdateCaregiverParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_CAREGIVER,
    data: params
  })
}

export async function deleteCaregiver(
  header: AuthHeader,
  params: DeleteCaregiverParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_CAREGIVER,
    data: {
      familyMember: {
        id: params.id,
        memberId: params.memberId
      }
    }
  })
}

export async function findCaregiverByEmailPhone(
  header: AuthHeader,
  params: FindCaregiverByEmailPhoneParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: FIND_CAREGIVER_BY_EMAIL_PHONE,
    data: {
      member: {
        email: params.email
      }
    }
  })
}

export async function resendCaregiverRequest(
  header: AuthHeader,
  params: ResendCaregiverRequestParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: RESEND_CAREGIVER_REQEST,
    data: {
      memberVo: {
        id: params.id,
        familyMemberMemberId: params.familyMemberMemberId
      }
    }
  })
}
