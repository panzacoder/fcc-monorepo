import { fetchData, type AuthHeader } from '../base'
import {
  FIND_CIRCLE,
  JOIN_CIRCLE,
  CREATE_CIRCLE,
  CREATE_CIRCLE_NO_EMAIL,
  GET_MEMBER_DETAILS,
  GET_MEMBER_MENUS,
  ACCEPT_SHARED_INFO,
  REJECT_SHARED_INFO,
  ACCEPT_MEMBER_REQUEST,
  REJECT_MEMBER_REQUEST
} from 'app/utils/urlConstants'
import type {
  FindCircleParams,
  FindCircleResponse,
  JoinCircleParams,
  JoinCircleResponse,
  CreateCircleParams,
  CreateCircleResponse,
  GetMemberDetailsParams,
  GetMemberDetailsResponse,
  GetMemberMenusParams,
  GetMemberMenusResponse,
  AcceptSharedInfoParams,
  AcceptSharedInfoResponse,
  RejectSharedInfoParams,
  RejectSharedInfoResponse,
  AcceptMemberRequestParams,
  AcceptMemberRequestResponse,
  RejectMemberRequestParams,
  RejectMemberRequestResponse
} from './types'

export async function findCircle(header: AuthHeader, params: FindCircleParams) {
  return fetchData<FindCircleResponse>({
    header,
    route: FIND_CIRCLE,
    data: {
      member: {
        ...(params.email ? { email: params.email } : {}),
        ...(params.phone ? { phone: params.phone } : {})
      }
    }
  })
}

export async function joinCircle(header: AuthHeader, params: JoinCircleParams) {
  return fetchData<JoinCircleResponse>({
    header,
    route: JOIN_CIRCLE,
    data: params
  })
}

export async function createCircle(
  header: AuthHeader,
  params: CreateCircleParams
) {
  const hasEmail = !!params.memberVo.email
  return fetchData<CreateCircleResponse>({
    header,
    route: hasEmail ? CREATE_CIRCLE : CREATE_CIRCLE_NO_EMAIL,
    data: params
  })
}

export async function getMemberDetails(
  header: AuthHeader,
  params?: GetMemberDetailsParams
) {
  return fetchData<GetMemberDetailsResponse>({
    header,
    route: GET_MEMBER_DETAILS,
    data: params ?? {}
  })
}

export async function getMemberMenus(
  header: AuthHeader,
  params: GetMemberMenusParams
) {
  return fetchData<GetMemberMenusResponse>({
    header,
    route: GET_MEMBER_MENUS,
    data: params
  })
}

export async function acceptSharedInfo(
  header: AuthHeader,
  params: AcceptSharedInfoParams
) {
  return fetchData<AcceptSharedInfoResponse>({
    header,
    route: ACCEPT_SHARED_INFO,
    data: params
  })
}

export async function rejectSharedInfo(
  header: AuthHeader,
  params: RejectSharedInfoParams
) {
  return fetchData<RejectSharedInfoResponse>({
    header,
    route: REJECT_SHARED_INFO,
    data: params
  })
}

export async function acceptMemberRequest(
  header: AuthHeader,
  params: AcceptMemberRequestParams
) {
  return fetchData<AcceptMemberRequestResponse>({
    header,
    route: ACCEPT_MEMBER_REQUEST,
    data: params
  })
}

export async function rejectMemberRequest(
  header: AuthHeader,
  params: RejectMemberRequestParams
) {
  return fetchData<RejectMemberRequestResponse>({
    header,
    route: REJECT_MEMBER_REQUEST,
    data: params
  })
}
