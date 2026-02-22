import { fetchData, type AuthHeader } from '../base'
import {
  GET_USER_PROFILE,
  UPDATE_PROFILE,
  GET_MEMBER_PROFILE,
  AUTO_SUBSCRIPTION,
  MANUAL_SUBSCRIPTION,
  CANCEL_SUBSCRIPTION,
  DELETE_ACCOUNT,
  CHECK_VALID_CREDENTIAL,
  UPDATE_SPONSOR_CODE,
  UPDATE_MEMBER_AUTHORIZED_CAREGIVER,
  UPDATE_MEMBER_ADDRESS,
  UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS,
  DELETE_AUTHORIZED_CAREGIVER,
  DELETE_CAREGIVER,
  DELETE_MEMBER,
  REFER_FRIEND
} from 'app/utils/urlConstants'
import type {
  UserProfileResponse,
  GetUserProfileParams,
  UpdateProfileParams,
  GetMemberProfileParams,
  MemberProfileResponse,
  AutoSubscriptionParams,
  ManualSubscriptionParams,
  CancelSubscriptionParams,
  DeleteAccountParams,
  CheckValidCredentialParams,
  UpdateSponsorCodeParams,
  UpdateMemberAuthorizedCaregiverParams,
  UpdateMemberAddressParams,
  UpdateMemberAuthorizedCaregiverAddressParams,
  DeleteAuthorizedCaregiverParams,
  DeleteCaregiverParams,
  DeleteMemberParams,
  ReferFriendParams
} from './types'

export async function getUserProfile(
  header: AuthHeader,
  params?: GetUserProfileParams
) {
  return fetchData<UserProfileResponse>({
    header,
    route: GET_USER_PROFILE,
    data: params
  })
}

export async function updateProfile(
  header: AuthHeader,
  params: UpdateProfileParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_PROFILE,
    data: params
  })
}

export async function getMemberProfile(
  header: AuthHeader,
  params: GetMemberProfileParams
) {
  return fetchData<MemberProfileResponse>({
    header,
    route: GET_MEMBER_PROFILE,
    data: params
  })
}

export async function autoSubscription(
  header: AuthHeader,
  params: AutoSubscriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: AUTO_SUBSCRIPTION,
    data: params
  })
}

export async function manualSubscription(
  header: AuthHeader,
  params: ManualSubscriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: MANUAL_SUBSCRIPTION,
    data: params
  })
}

export async function cancelSubscription(
  header: AuthHeader,
  params: CancelSubscriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CANCEL_SUBSCRIPTION,
    data: params
  })
}

export async function deleteAccount(
  header: AuthHeader,
  params: DeleteAccountParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_ACCOUNT,
    data: params
  })
}

export async function checkValidCredential(
  header: AuthHeader,
  params: CheckValidCredentialParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CHECK_VALID_CREDENTIAL,
    data: params
  })
}

export async function updateSponsorCode(
  header: AuthHeader,
  params: UpdateSponsorCodeParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_SPONSOR_CODE,
    data: params
  })
}

export async function updateMemberAuthorizedCaregiver(
  header: AuthHeader,
  params: UpdateMemberAuthorizedCaregiverParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MEMBER_AUTHORIZED_CAREGIVER,
    data: params
  })
}

export async function updateMemberAddress(
  header: AuthHeader,
  params: UpdateMemberAddressParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MEMBER_ADDRESS,
    data: params
  })
}

export async function updateMemberAuthorizedCaregiverAddress(
  header: AuthHeader,
  params: UpdateMemberAuthorizedCaregiverAddressParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS,
    data: params
  })
}

export async function deleteAuthorizedCaregiver(
  header: AuthHeader,
  params: DeleteAuthorizedCaregiverParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_AUTHORIZED_CAREGIVER,
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
    data: params
  })
}

export async function deleteMember(
  header: AuthHeader,
  params: DeleteMemberParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_MEMBER,
    data: params
  })
}

export async function referFriend(
  header: AuthHeader,
  params: ReferFriendParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: REFER_FRIEND,
    data: params
  })
}
