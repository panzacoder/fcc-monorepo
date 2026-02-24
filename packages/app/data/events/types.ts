import type { Address, DomainPrivileges } from '../types.d'

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

export interface EventLocation {
  shortDescription: string
  nickName: string
  address: Address
}

export interface EventNote {
  id: number
  shortDescription: string
  note: string
  occurance: { occurance: string }
  hasMsgThread: boolean
}

export interface EventReminder {
  id: number
  content: string
  date: string
}

export interface EventTransportation {
  id: number
  status: string
  date: string
  pickupLocation: string
  dropoffLocation: string
}

export interface EventDetail {
  id: number
  date: string
  title: string
  description: string
  status: { id: number; status: string; description: string | null }
  location: EventLocation
  noteList: EventNote[]
  reminderList: EventReminder[]
  transportationList: EventTransportation[]
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
  event: {
    date: string | Date
    title: string
    description: string
    member: { id: number | string }
    location: EventLocation
    contactList: unknown[]
    reminderList: unknown[]
  }
}

export interface UpdateEventParams {
  event: {
    id: number
    date: string | Date
    title: string
    description: string
    member: { id: number | string }
    location: EventLocation
    contactList: unknown[]
    reminderList: unknown[]
  }
}

export interface DeleteEventParams {
  event: { id: number }
}

export interface EventNoteParams {
  note: {
    id?: number | string
    event: { id: number | string }
    note: string
    shortDescription: string
  }
}

export interface GetEventNoteParams {
  note: { id: number }
}

export interface EventReminderParams {
  reminder: {
    id?: number
    content: string
    date: string
    event: { id: number | string }
  }
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
