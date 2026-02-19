import { fetchData, type AuthHeader } from '../base'
import {
  GET_EVENTS,
  GET_EVENT_DETAILS,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  CREATE_EVENT_NOTE,
  UPDATE_EVENT_NOTE,
  DELETE_EVENT_NOTE,
  GET_EVENT_NOTE,
  CREATE_EVENT_REMINDER,
  UPDATE_EVENT_REMINDER,
  DELETE_EVENT_REMINDER,
  UPDATE_EVENT_STATUS
} from 'app/utils/urlConstants'
import type {
  EventListResponse,
  EventDetailResponse,
  GetEventsParams,
  GetEventDetailsParams,
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  EventNoteParams,
  GetEventNoteParams,
  EventReminderParams,
  DeleteEventReminderParams,
  UpdateEventStatusParams
} from './types'

export async function getEvents(header: AuthHeader, params: GetEventsParams) {
  return fetchData<EventListResponse>({
    header,
    route: GET_EVENTS,
    data: {
      member: { id: params.memberId },
      month: params.month,
      year: params.year
    }
  })
}

export async function getEventDetails(
  header: AuthHeader,
  params: GetEventDetailsParams
) {
  return fetchData<EventDetailResponse>({
    header,
    route: GET_EVENT_DETAILS,
    data: {
      event: {
        id: params.eventId,
        member: { id: params.memberId }
      }
    }
  })
}

export async function createEvent(
  header: AuthHeader,
  params: CreateEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_EVENT,
    data: params
  })
}

export async function updateEvent(
  header: AuthHeader,
  params: UpdateEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_EVENT,
    data: params
  })
}

export async function deleteEvent(
  header: AuthHeader,
  params: DeleteEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_EVENT,
    data: params
  })
}

export async function createEventNote(
  header: AuthHeader,
  params: EventNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_EVENT_NOTE,
    data: params
  })
}

export async function updateEventNote(
  header: AuthHeader,
  params: EventNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_EVENT_NOTE,
    data: params
  })
}

export async function deleteEventNote(
  header: AuthHeader,
  params: { note: { id: number } }
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_EVENT_NOTE,
    data: params
  })
}

export async function getEventNote(
  header: AuthHeader,
  params: GetEventNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: GET_EVENT_NOTE,
    data: params
  })
}

export async function createEventReminder(
  header: AuthHeader,
  params: EventReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_EVENT_REMINDER,
    data: params
  })
}

export async function updateEventReminder(
  header: AuthHeader,
  params: EventReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_EVENT_REMINDER,
    data: params
  })
}

export async function deleteEventReminder(
  header: AuthHeader,
  params: DeleteEventReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_EVENT_REMINDER,
    data: params
  })
}

export async function updateEventStatus(
  header: AuthHeader,
  params: UpdateEventStatusParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_EVENT_STATUS,
    data: params
  })
}
