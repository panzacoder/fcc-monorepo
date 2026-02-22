import type { DomainPrivileges } from '../types.d'

export interface EventListItem {
  id: number
  date: string
  status: string
  title: string
  location: string
  hasNotes: boolean
  hasReminders: boolean
  hasTransportation: boolean
  unreadMessageCount: number
  activeReminderCount: number
  transportationStatus: string
  markCompleteCancel: boolean
}

export interface EventListResponse {
  domainObjectPrivileges: DomainPrivileges
  eventList: EventListItem[]
}

export interface EventDetail {
  id: number
  date: string
  title: string
  description: string
  status: { id: number; status: string; description: string | null }
  location: Record<string, unknown>
  noteList: Record<string, unknown>[]
  reminderList: Record<string, unknown>[]
  transportationList: Record<string, unknown>[]
}

export interface EventDetailResponse {
  domainObjectPrivileges: DomainPrivileges
  event: EventDetail
}

export interface GetEventsParams {
  memberId: number | string
  month?: string
  year?: string
}

export interface GetEventDetailsParams {
  eventId: number | string
  memberId: number | string
}

export interface CreateEventParams {
  event: Record<string, unknown>
}

export interface UpdateEventParams {
  event: Record<string, unknown>
}

export interface DeleteEventParams {
  event: { id: number }
}

export interface EventNoteParams {
  note: Record<string, unknown>
}

export interface GetEventNoteParams {
  note: { id: number }
}

export interface EventReminderParams {
  reminder: Record<string, unknown>
}

export interface DeleteEventReminderParams {
  reminder: { id: number; event: { id: number } }
}

export interface UpdateEventStatusParams {
  event: {
    id: number
    status: { status: string }
    member: { id: number | string }
  }
}
