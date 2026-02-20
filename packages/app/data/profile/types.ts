export interface GetUserProfileParams {
  member: { id: number | string }
}

export interface UserProfileResponse {
  [key: string]: any
}

export interface UpdateProfileParams {
  member: Record<string, unknown>
}

export interface GetMemberProfileParams {
  member: { id: number | string }
}

export interface MemberProfileResponse {
  [key: string]: any
}

export interface AutoSubscriptionParams {
  [key: string]: any
}

export interface ManualSubscriptionParams {
  [key: string]: any
}

export interface CancelSubscriptionParams {
  [key: string]: any
}

export interface DeleteAccountParams {
  [key: string]: any
}

export interface CheckValidCredentialParams {
  credential: Record<string, unknown>
}

export interface UpdateSponsorCodeParams {
  member: Record<string, unknown>
}

export interface UpdateMemberAuthorizedCaregiverParams {
  member: Record<string, unknown>
}

export interface UpdateMemberAddressParams {
  member: Record<string, unknown>
}

export interface UpdateMemberAuthorizedCaregiverAddressParams {
  member: Record<string, unknown>
}

export interface DeleteAuthorizedCaregiverParams {
  member: { id: number | string }
}

export interface DeleteCaregiverParams {
  caregiver: { id: number | string }
}

export interface DeleteMemberParams {
  member: { id: number | string }
}
