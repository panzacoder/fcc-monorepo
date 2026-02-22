import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getIncidents,
  getIncidentDetails,
  createIncident,
  updateIncident,
  deleteIncident,
  createIncidentNote,
  updateIncidentNote,
  deleteIncidentNote,
  getIncidentNote
} from './api'
import type {
  GetIncidentsParams,
  CreateIncidentParams,
  UpdateIncidentParams,
  DeleteIncidentParams,
  IncidentNoteParams,
  DeleteIncidentNoteParams,
  GetIncidentNoteParams
} from './types'

export const incidentKeys = {
  all: ['incidents'] as const,
  lists: () => [...incidentKeys.all, 'list'] as const,
  list: (params: GetIncidentsParams) =>
    [...incidentKeys.lists(), params] as const,
  details: () => [...incidentKeys.all, 'detail'] as const,
  detail: (id: number) => [...incidentKeys.details(), id] as const,
  notes: () => [...incidentKeys.all, 'note'] as const,
  note: (id: number) => [...incidentKeys.notes(), id] as const
}

export function useIncidents(header: AuthHeader, params: GetIncidentsParams) {
  return useQuery({
    queryKey: incidentKeys.list(params),
    queryFn: () => getIncidents(header, params),
    enabled: !!header
  })
}

export function useIncidentDetails(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => getIncidentDetails(header, { id }),
    enabled: !!header && !!id
  })
}

export function useIncidentNote(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: incidentKeys.note(id),
    queryFn: () => getIncidentNote(header, { note: { id } }),
    enabled: !!header && !!id
  })
}

export function useCreateIncident(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateIncidentParams) =>
      createIncident(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
    }
  })
}

export function useUpdateIncident(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateIncidentParams) =>
      updateIncident(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.all })
    }
  })
}

export function useDeleteIncident(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteIncidentParams) =>
      deleteIncident(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
    }
  })
}

export function useCreateIncidentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: IncidentNoteParams) =>
      createIncidentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.all })
    }
  })
}

export function useUpdateIncidentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: IncidentNoteParams) =>
      updateIncidentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.all })
    }
  })
}

export function useDeleteIncidentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteIncidentNoteParams) =>
      deleteIncidentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.all })
    }
  })
}
