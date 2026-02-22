import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
  createEventNote,
  updateEventNote,
  deleteEventNote,
  getEventNote,
  createEventReminder,
  updateEventReminder,
  deleteEventReminder,
  updateEventStatus
} from './api'
import type {
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

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: GetEventsParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...eventKeys.details(), id] as const,
  notes: () => [...eventKeys.all, 'note'] as const,
  note: (id: number) => [...eventKeys.notes(), id] as const
}

export function useEvents(header: AuthHeader, params: GetEventsParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => getEvents(header, params),
    enabled: !!header
  })
}

export function useEventDetails(
  header: AuthHeader,
  params: GetEventDetailsParams
) {
  return useQuery({
    queryKey: eventKeys.detail(params.eventId),
    queryFn: () => getEventDetails(header, params),
    enabled: !!header && !!params.eventId
  })
}

export function useEventNote(header: AuthHeader, params: GetEventNoteParams) {
  return useQuery({
    queryKey: eventKeys.note(params.note.id),
    queryFn: () => getEventNote(header, params),
    enabled: !!header && !!params.note.id
  })
}

export function useCreateEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateEventParams) => createEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    }
  })
}

export function useUpdateEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateEventParams) => updateEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useDeleteEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteEventParams) => deleteEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() })
    }
  })
}

export function useCreateEventNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: EventNoteParams) => createEventNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useUpdateEventNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: EventNoteParams) => updateEventNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useDeleteEventNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { note: { id: number } }) =>
      deleteEventNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useCreateEventReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: EventReminderParams) =>
      createEventReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useUpdateEventReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: EventReminderParams) =>
      updateEventReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useDeleteEventReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteEventReminderParams) =>
      deleteEventReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}

export function useUpdateEventStatus(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateEventStatusParams) =>
      updateEventStatus(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    }
  })
}
