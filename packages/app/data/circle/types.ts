import type { Address, Member } from '../types.d'

export interface FindCircleParams {
  email?: string
  phone?: string
}

export type FindCircleResponse = Member | null

export interface JoinCircleParams {
  memberVo: Record<string, unknown>
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

export type GetMemberDetailsResponse = Record<string, any>

export interface GetMemberMenusParams {
  member: { id: number | string }
}

export type GetMemberMenusResponse = Record<string, any>

export interface AcceptSharedInfoParams {
  infoSharing: Record<string, unknown>
}

export type AcceptSharedInfoResponse = Record<string, any>

export interface RejectSharedInfoParams {
  infoSharing: Record<string, unknown>
}

export type RejectSharedInfoResponse = Record<string, any>

export interface AcceptMemberRequestParams {
  memberVo: Record<string, unknown>
}

export type AcceptMemberRequestResponse = Record<string, any>

export interface RejectMemberRequestParams {
  memberVo: Record<string, unknown>
}

export type RejectMemberRequestResponse = Record<string, any>
