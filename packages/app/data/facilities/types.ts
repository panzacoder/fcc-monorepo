import type { DomainPrivileges } from '../types.d'

export interface FacilityListItem {
  id: number
  name: string
  type: string
  status: string
  locations: string
}

export interface FacilityListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: FacilityListItem[]
}

export interface FacilityLocation {
  id: number
  nickName: string
  shortDescription: string
  phone: string | null
  fax: string | null
  website: string | null
  address: Record<string, unknown>
}

export interface Facility {
  id: number
  name: string
  description: string | null
  website: string | null
  websiteuser: string | null
  ispharmacy: boolean
  type: string | Record<string, unknown>
  status: { id: number; status: string }
  member: { id: number }
  facilityLocationList: FacilityLocation[]
}

export interface FacilityWithAppointment {
  facility: Facility
  facilityAppointmentList: Record<string, unknown>[]
}

export interface FacilityDetailsResponse {
  domainObjectPrivileges: DomainPrivileges
  facilityWithAppointment: FacilityWithAppointment
}

export interface GetMemberFacilitiesParams {
  memberId: number | string
}

export interface GetFacilityDetailsParams {
  id: number | string
}

export interface CreateFacilityParams {
  facility: {
    member: { id: number | string }
    name: string
    ispharmacy: boolean
    description: string
    website: string
    websiteuser: string
    type: string
    facilityLocationList: Record<string, unknown>[]
  }
}

export interface UpdateFacilityParams {
  facility: {
    id: number | string
    member: { id: number | string }
    name: string
    ispharmacy: boolean
    description: string
    website: string
    websiteuser: string
    type: string
    status: { status: string; id: number }
  }
}

export interface DeleteFacilityParams {
  facility: { id: number | string }
}

export interface CreateFacilityLocationParams {
  facilityLocation: Record<string, unknown>
}

export interface UpdateFacilityLocationParams {
  facilityLocation: Record<string, unknown>
}

export interface DeleteFacilityLocationParams {
  facilityLocation: { id: number | string }
}

export interface PharmacyListItem {
  id: number
  name: string
}

export interface PharmacyListResponse {
  list: PharmacyListItem[]
}
