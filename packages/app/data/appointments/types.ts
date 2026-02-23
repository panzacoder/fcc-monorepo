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

export interface AppointmentData {
  id?: number | string
  date?: Date | string
  description?: string
  appointmentPreNote?: string
  purpose?: string
  type?: { type: string }
  member?: { id: number | string }
  doctorLocation?: { id?: number | string }
  facilityLocation?: { id?: number | string }
  status?: { status: string }
}

export interface CreateAppointmentParams {
  appointment: AppointmentData
}

export interface UpdateAppointmentParams {
  appointment: AppointmentData
}

export interface DeleteAppointmentParams {
  appointment: { id: number }
}

export interface AppointmentNoteData {
  id?: number | string
  appointment?: { id: number | string }
  occurance?: { occurance: string }
  note?: string
  shortDescription?: string
}

export interface AppointmentNoteParams {
  appointmentNote: AppointmentNoteData
}

export interface AppointmentReminderData {
  id?: number | string
  content?: string
  date?: Date | string
  appointment?: { id: number | string }
}

export interface AppointmentReminderParams {
  reminder: AppointmentReminderData
}

export interface UpdateAppointmentStatusParams {
  appointment: {
    id: number | string
    status: { status: string }
    member: { id: number | string }
  }
}

export interface SendCalendarInviteParams {
  appointment: { id: number | string }
}

export interface AppointmentDetailResponse {
  domainObjectPrivileges: DomainPrivileges
  appointmentWithPreviousAppointment: {
    appointment: AppointmentData & {
      noteList?: unknown[]
      reminderList?: unknown[]
      transportationList?: unknown[]
    }
  }
}

export interface DoctorFacilityLocationItem {
  name: string
  locationId: number
}
