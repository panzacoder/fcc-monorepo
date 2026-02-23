import type { Address, DomainPrivileges } from '../types.d'

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
  address: Partial<Address> & { id?: number | string }
}

export interface AppointmentListItem {
  date: string
  status: string
  purpose: string
  type: string
  appointment: string
  hasNotes: boolean
  hasReminders: boolean
  hasTransportation: boolean
  unreadMessageCount: number
  activeReminderCount: number
  transportationStatus: string
  markCompleteCancel: boolean
}

export interface Facility {
  id: number
  name: string
  description: string | null
  website: string | null
  websiteuser: string | null
  ispharmacy: boolean
  type: string | { id: number; type: string }
  status: { id: number; status: string }
  member: { id: number }
  facilityLocationList: FacilityLocation[]
}

export interface FacilityWithAppointment {
  facility: Facility
  facilityAppointmentList: AppointmentListItem[]
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

export interface FacilityLocationData {
  shortDescription: string
  nickName: string
  fax?: string
  website?: string
  phone?: string
  address: Partial<Address> & { id?: number | string }
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
    facilityLocationList: FacilityLocationData[]
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
  facilityLocation: FacilityLocationData & {
    id?: number | string
    facility: {
      id: number | string
      member?: { id: number | string }
    }
  }
}

export interface UpdateFacilityLocationParams {
  facilityLocation: FacilityLocationData & {
    id?: number | string
    facility: {
      id: number | string
      member?: { id: number | string }
    }
  }
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

export interface ShareFacilityParams {
  doctorSharingInfo: {
    facilityid: number | string
    targetemail: string
  }
}
