import type { Address, DomainPrivileges } from '../types.d'

export interface IncidentListItem {
  id: number
  title: string
  date: string
  type: string
  location: string
  hasNotes: boolean
  unreadMessageCount: number
}

export interface IncidentListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: IncidentListItem[]
}

export interface GetIncidentsParams {
  memberId: number | string
  month?: string
  year?: string
}

export interface IncidentLocation {
  shortDescription: string
  nickName: string
  address: Partial<Address> & { id?: number | string }
}

export interface IncidentNote {
  id: number
  note: string
  shortDescription: string
  hasMsgThread: boolean
}

export interface IncidentDetail {
  id: number
  title: string
  date: string
  type: string
  description: string
  location: IncidentLocation
  noteList: IncidentNote[]
}

export interface IncidentDetailResponse {
  domainObjectPrivileges: DomainPrivileges
  incident: IncidentDetail
}

export interface IncidentData {
  date: string | Date
  title: string
  description?: string
  type: string
  member: { id: number | string }
  location: IncidentLocation
  contactList?: unknown[]
  id?: number | string
}

export interface CreateIncidentParams {
  incident: IncidentData
}

export interface UpdateIncidentParams {
  incident: IncidentData
}

export interface DeleteIncidentParams {
  incident: { id: number }
}

export interface IncidentNoteData {
  incident: { id: number | string }
  note: string
  shortDescription: string
  id?: number | string
}

export interface IncidentNoteParams {
  note: IncidentNoteData
}

export interface DeleteIncidentNoteParams {
  note: { id: number }
}

export interface GetIncidentNoteParams {
  note: { id: number }
}

export interface IncidentNoteResponse {
  messageThread?: {
    id: number
    [key: string]: unknown
  }
}
