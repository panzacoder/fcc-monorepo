export interface GetUserProfileParams {
  [key: string]: any
}

export interface UserProfileResponse {
  [key: string]: any
}

export interface UpdateProfileParams {
  memberVo: Record<string, unknown>
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
  appuserVo: { credential: string }
}

export interface UpdateSponsorCodeParams {
  appuserVo: { sponsorCode: string; email: string }
}

export interface UpdateMemberAuthorizedCaregiverParams {
  memberVo: Record<string, unknown>
}

export interface UpdateMemberAddressParams {
  memberVo: Record<string, unknown>
}

export interface UpdateMemberAuthorizedCaregiverAddressParams {
  memberVo: Record<string, unknown>
}

export interface DeleteAuthorizedCaregiverParams {
  appuserVo: { id: number | string }
}

export interface DeleteCaregiverParams {
  familyMember: { id: number | string; memberId: number | string }
}

export interface DeleteMemberParams {
  memberVo: { memberDetailsId: number | string }
}
