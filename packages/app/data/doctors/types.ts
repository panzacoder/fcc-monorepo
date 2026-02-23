import type { Address, DomainPrivileges } from '../types.d'
import type { AppointmentListItem } from '../facilities/types'

export interface DoctorListItem {
  id: number
  doctorName: string
  specialist: string
  locations: string
  status: string
  type: {
    type: string
  }
}

export interface DoctorListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: DoctorListItem[]
}

export interface GetMemberDoctorsParams {
  memberId: number | string
}

export interface DoctorDetails {
  id: number
  salutation: string
  firstName: string
  lastName: string
  phone: string
  email: string
  website: string
  websiteuser: string
  specialist: string
  status: {
    id: number
    status: string
  }
  doctorLocationList: DoctorLocation[]
  version?: number
}

export interface DoctorLocation {
  id: number
  nickName: string
  shortDescription: string
  phone: string
  fax: string
  website: string
  address: Partial<Address> & { id?: number | string }
}

export interface DoctorDetailsResponse {
  domainObjectPrivileges: DomainPrivileges
  doctor: DoctorDetails
  doctorAppointmentList: AppointmentListItem[]
}

export interface GetDoctorDetailsParams {
  id: number | string
}

export interface DoctorLocationData {
  shortDescription: string
  nickName: string
  fax?: string
  website?: string
  phone?: string
  address: Partial<Address> & { id?: number | string }
}

export interface CreateDoctorData {
  member: { id: number | string }
  salutation: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  website: string
  websiteuser: string
  specialist: string
  isSelf?: boolean
  doctorLocationList?: DoctorLocationData[]
}

export interface UpdateDoctorData {
  id: number | string
  member: { id: number | string }
  salutation: string
  firstName: string
  lastName: string
  phone: string
  website: string
  websiteuser: string
  specialist: string
  status: { status: string; id: number }
}

export interface CreateDoctorParams {
  doctor: CreateDoctorData
}

export interface UpdateDoctorParams {
  doctor: UpdateDoctorData
}

export interface DeleteDoctorParams {
  doctor: { id: number }
}

export interface CreateDoctorLocationParams {
  doctorLocation: DoctorLocationData & {
    id?: number | string
    doctor: {
      id: number | string
      member?: { id: number | string }
    }
  }
}

export interface UpdateDoctorLocationParams {
  doctorLocation: DoctorLocationData & {
    id?: number | string
    doctor: {
      id: number | string
      member?: { id: number | string }
    }
  }
}

export interface DeleteDoctorLocationParams {
  doctorLocation: {
    id: number
    doctor: { id: number }
  }
}

export interface GetActiveDoctorsParams {
  memberId: number | string
}

export interface ActiveDoctorItem {
  id: number
  name: string
}

export interface ActiveDoctorsResponse {
  doctorList: ActiveDoctorItem[]
}

export interface ShareDoctorParams {
  doctorSharingInfo: {
    doctorid: number | string
    targetemail: string
  }
}
