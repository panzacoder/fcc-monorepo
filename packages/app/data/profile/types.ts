import type { Address } from '../types.d'

export type GetUserProfileParams = object

export interface ProfileAppUser {
  firstName: string
  lastName: string
  email: string
  phone: string
  isFreeUser: boolean
}

export interface ProfileMember {
  id: number
  memberId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: Address
}

export interface ProfileOrder {
  date: string
  price: number
  status: string
  orderItems: { description: string }[]
}

export interface ProfileUserSubscription {
  status: string
  plan: {
    id: number
    description: string
    price: number
    plantype: string
  }
  source: string
  startDate: string
  endDate: string
}

export interface UserProfileResponse {
  appuser: ProfileAppUser
  member: ProfileMember
  orderList: ProfileOrder[]
  userSubscription: ProfileUserSubscription
  expiringSubscription: boolean
  expiredSubscription: boolean
  subscriptionEndDate: string
}

export interface UpdateProfileParams {
  memberVo: {
    id: number | string
    firstName: string
    lastName: string
    email: string
    phone: string
    isMemberUpdate: boolean
  }
}

export interface GetMemberProfileParams {
  member: { id: number | string }
}

export interface MemberProfileResponse {
  id: number
  memberId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: Address
}

export interface AutoSubscriptionParams {
  email: string
}

export interface ManualSubscriptionParams {
  email: string
}

export interface CancelSubscriptionParams {
  email: string
}

export interface DeleteAccountParams {
  appuserVo: { email: string; credential: string }
}

export interface CheckValidCredentialParams {
  appuserVo: { credential: string }
}

export interface UpdateSponsorCodeParams {
  appuserVo: { sponsorCode: string; email: string }
}

export interface UpdateMemberAuthorizedCaregiverParams {
  memberVo: {
    id: number | string
    firstName: string
    lastName: string
    email: string
    phone: string
    isMemberUpdate: boolean
  }
}

export interface UpdateMemberAddressParams {
  memberVo: {
    id: number | string
    isMemberUpdate: boolean
    address: Address
  }
}

export interface UpdateMemberAuthorizedCaregiverAddressParams {
  memberVo: {
    id: number | string
    isMemberUpdate: boolean
    address: Address
  }
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

export interface ReferFriendParams {
  email: string
}
