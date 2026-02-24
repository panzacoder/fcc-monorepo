import type { Address, Member } from '../types.d'

export interface FindCircleParams {
  email?: string
  phone?: string
}

export type FindCircleResponse = Member | null

export interface JoinCircleParams {
  memberVo: {
    id: number | string
    firstName?: string
    lastName?: string
    phone?: string
    email?: string
    address?: Address
  }
}

export interface JoinCircleResponse {
  version: number
  id: number
  memberEmail: string
  caregiverEmail: string
  phone: string | null
  requestRaisedBy: string
  caregiverFname: string
  caregiverLname: string
  memberFname: string
  memberLname: string
  consentFormVersionDate: null
  familyMember: number
  member: number
  isActive: boolean
}

export interface CreateCircleParams {
  memberVo: {
    description?: string
    email?: string | null
    firstName: string
    lastName: string
    phone?: string
    address: Address
  }
}

export interface CreateCircleResponse {
  version: number
  id: number
  email: string
  phone: string | null
  caregiverEmail: string
  requestRaisedBy: string
  caregiverFname: string
  caregiverLname: string
  memberFname: string
  memberLname: string
  consentFormVersionDate: null
  familyMember: number
  member: number
  isActive: boolean
}

export interface GetMemberDetailsParams {
  member: { id: number | string }
}

export interface GetMemberDetailsResponse {
  memberList: unknown[]
}

export interface GetMemberMenusParams {
  member: { id: number | string }
}

export interface MemberMenu {
  menuid: string
}

export interface GetMemberMenusResponse {
  member: {
    address: Address
    menuList: MemberMenu[]
  }
}

export interface AcceptSharedInfoParams {
  doctorSharingInfo: {
    id: number | string
  }
}

export type AcceptSharedInfoResponse = unknown

export interface RejectSharedInfoParams {
  doctorSharingInfo: {
    id: number | string
  }
}

export type RejectSharedInfoResponse = unknown

export interface AcceptMemberRequestParams {
  memberVo: {
    familyMemberMemberId: number | string
    isActive: boolean
  }
}

export type AcceptMemberRequestResponse = unknown

export interface RejectMemberRequestParams {
  memberVo: {
    familyMemberMemberId: number | string
    isActive: boolean
  }
}

export type RejectMemberRequestResponse = unknown
