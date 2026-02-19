import type { DomainPrivileges } from '../types.d'

export interface RelationRole {
  name: string
  uid: string
}

export interface FamilyMemberMemberStatus {
  status: string
}

export interface CaregiverListItem {
  id: number
  name: string
  email: string
  phone: string
  role: string
  member: number
  memberStatus: string
  registrationStatus: string
  showResendRequest: boolean
}

export interface CaregiverListResponse {
  domainObjectPrivileges: DomainPrivileges
  familyMemberList: CaregiverListItem[]
}

export interface CaregiverDetail {
  id: number
  firstName: string
  middleName: string | null
  lastName: string
  email: string
  phone: string
  memberId: number
  familyMemberMemberStatus: FamilyMemberMemberStatus
  relationRole: RelationRole
}

export interface CaregiverDetailResponse {
  domainObjectPrivileges: DomainPrivileges
  familyMember: CaregiverDetail
}

export interface GetMemberCaregiversParams {
  memberId: number | string
}

export interface GetCaregiverDetailsParams {
  id: number | string
  memberId: number | string
}

export interface CreateCaregiverParams {
  familyMember: Record<string, unknown>
}

export interface UpdateCaregiverParams {
  familyMember: Record<string, unknown>
}

export interface DeleteCaregiverParams {
  id: number | string
  memberId: number | string
}

export interface FindCaregiverByEmailPhoneParams {
  email: string
}

export interface ResendCaregiverRequestParams {
  id: number | string
  familyMemberMemberId: number | string
}
