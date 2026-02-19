import type { DomainPrivileges } from '../types.d'

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
  address: Record<string, unknown>
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

export interface CreateIncidentParams {
  incident: Record<string, unknown>
}

export interface UpdateIncidentParams {
  incident: Record<string, unknown>
}

export interface DeleteIncidentParams {
  incident: { id: number }
}

export interface IncidentNoteParams {
  note: Record<string, unknown>
}

export interface DeleteIncidentNoteParams {
  note: { id: number }
}

export interface GetIncidentNoteParams {
  note: { id: number }
}
