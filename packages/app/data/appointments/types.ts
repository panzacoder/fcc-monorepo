import type { DomainPrivileges } from '../types.d'

export interface AppointmentListItem {
  id: number
  date: string
  status: string
  purpose: string
  appointment: string
  type: string
  hasNotes: boolean
  hasReminders: boolean
  hasTransportation: boolean
  unreadMessageCount: number
  activeReminderCount: number
  transportationStatus: string
  markCompleteCancel: boolean
}

export interface AppointmentListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: AppointmentListItem[]
}

export interface GetAppointmentsParams {
  id: number | string
  month?: string
  year?: string
  type?: string
  doctorId?: string | number
  facilityId?: string | number
}

export interface DoctorFacilityItem {
  name: string
  doctorId: number | null
  facilityId: number | null
}

export type DoctorFacilityListResponse = DoctorFacilityItem[]

export interface GetDoctorFacilitiesParams {
  memberId: number | string
  appointmentType: string
}

export interface CreateAppointmentParams {
  appointment: Record<string, unknown>
}

export interface UpdateAppointmentParams {
  appointment: Record<string, unknown>
}

export interface DeleteAppointmentParams {
  appointment: { id: number }
}

export interface AppointmentNoteParams {
  note: Record<string, unknown>
}

export interface AppointmentReminderParams {
  reminder: Record<string, unknown>
}

export interface UpdateAppointmentStatusParams {
  appointment: { id: number; status: string }
}
