import type { DomainPrivileges } from '../types.d'

export interface MedicalDeviceDoctor {
  id: number
  salutation: string | null
  firstName: string | null
  middleName: string | null
  lastName: string | null
  doctorName: string | null
}

export interface MedicalDeviceNote {
  id: number
  shortDescription: string
  note: string
  occurance: { occurance: string }
  hasMsgThread: boolean
}

export interface MedicalDeviceReminder {
  id: number
  content: string
  date: string
}

export interface MedicalDeviceListItem {
  id: number
  date: string
  type: string
  doctor: string | null
  hasNotes: boolean
  hasReminders: boolean
  unreadMessageCount: number
  activeReminderCount: number
}

export interface MedicalDeviceListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: MedicalDeviceListItem[]
}

export interface MedicalDeviceDetails {
  id: number
  date: string
  title: string
  type: string
  description: string
  isPrescribedBy: boolean
  doctor: MedicalDeviceDoctor | null
  location: Record<string, unknown> | null
  noteList: MedicalDeviceNote[]
  reminderList: MedicalDeviceReminder[]
}

export interface MedicalDeviceDetailsResponse {
  domainObjectPrivileges: DomainPrivileges
  purchase: MedicalDeviceDetails
}

export interface GetMedicalDevicesParams {
  memberId: number | string
  month?: string
  year?: string
}

export interface CreateMedicalDeviceParams {
  purchase: Record<string, unknown>
}

export interface UpdateMedicalDeviceParams {
  purchase: Record<string, unknown>
}

export interface DeleteMedicalDeviceParams {
  purchase: { id: number }
}

export interface MedicalDeviceNoteParams {
  note: Record<string, unknown>
}

export interface DeleteMedicalDeviceNoteParams {
  note: { id: number }
}

export interface MedicalDeviceReminderParams {
  reminder: Record<string, unknown>
}

export interface DeleteMedicalDeviceReminderParams {
  reminder: { id: number; purchase: { id: number } }
}

export interface GetMedicalDeviceNoteParams {
  note: { id: number }
}
