import type { DomainPrivileges } from '../types.d'

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
  address: Record<string, unknown>
}

export interface DoctorDetailsResponse {
  domainObjectPrivileges: DomainPrivileges
  doctor: DoctorDetails
  doctorAppointmentList: Record<string, unknown>[]
}

export interface GetDoctorDetailsParams {
  id: number | string
}

export interface CreateDoctorParams {
  doctor: Record<string, unknown>
}

export interface UpdateDoctorParams {
  doctor: Record<string, unknown>
}

export interface DeleteDoctorParams {
  doctor: { id: number }
}

export interface CreateDoctorLocationParams {
  doctorLocation: Record<string, unknown>
}

export interface UpdateDoctorLocationParams {
  doctorLocation: Record<string, unknown>
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

export interface ActiveDoctorsResponse {
  doctorList: Record<string, unknown>[]
}

export interface ShareDoctorParams {
  doctorSharingInfo: {
    doctorid: number | string
    targetemail: string
  }
}
