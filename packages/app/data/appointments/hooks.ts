import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getAppointments,
  getDoctorFacilities,
  getAppointmentDetails,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createAppointmentNote,
  updateAppointmentNote,
  deleteAppointmentNote,
  getAppointmentNote,
  createAppointmentReminder,
  updateAppointmentReminder,
  deleteAppointmentReminder,
  updateAppointmentStatus,
  getAppointmentDoctors,
  getAppointmentFacilities,
  sendCalendarInvite
} from './api'
import type {
  GetAppointmentsParams,
  GetDoctorFacilitiesParams,
  CreateAppointmentParams,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
  AppointmentNoteParams,
  AppointmentReminderParams,
  UpdateAppointmentStatusParams,
  SendCalendarInviteParams
} from './types'

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: GetAppointmentsParams) =>
    [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  notes: () => [...appointmentKeys.all, 'note'] as const,
  note: (id: number) => [...appointmentKeys.notes(), id] as const,
  doctorFacilities: (params: GetDoctorFacilitiesParams) =>
    [...appointmentKeys.all, 'doctorFacilities', params] as const,
  doctors: (memberId: number) =>
    [...appointmentKeys.all, 'doctors', memberId] as const,
  facilities: (memberId: number) =>
    [...appointmentKeys.all, 'facilities', memberId] as const
}

export function useAppointments(
  header: AuthHeader,
  params: GetAppointmentsParams
) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => getAppointments(header, params),
    enabled: !!header
  })
}

export function useDoctorFacilities(
  header: AuthHeader,
  params: GetDoctorFacilitiesParams
) {
  return useQuery({
    queryKey: appointmentKeys.doctorFacilities(params),
    queryFn: () => getDoctorFacilities(header, params),
    enabled: !!header
  })
}

export function useAppointmentDetails(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointmentDetails(header, { id }),
    enabled: !!header && !!id
  })
}

export function useAppointmentDoctors(header: AuthHeader, memberId: number) {
  return useQuery({
    queryKey: appointmentKeys.doctors(memberId),
    queryFn: () => getAppointmentDoctors(header, { memberId }),
    enabled: !!header && !!memberId
  })
}

export function useAppointmentFacilities(header: AuthHeader, memberId: number) {
  return useQuery({
    queryKey: appointmentKeys.facilities(memberId),
    queryFn: () => getAppointmentFacilities(header, { memberId }),
    enabled: !!header && !!memberId
  })
}

export function useAppointmentNote(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: appointmentKeys.note(id),
    queryFn: () => getAppointmentNote(header, { appointmentNote: { id } }),
    enabled: !!header && !!id
  })
}

export function useCreateAppointment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateAppointmentParams) =>
      createAppointment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
    }
  })
}

export function useUpdateAppointment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateAppointmentParams) =>
      updateAppointment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useDeleteAppointment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteAppointmentParams) =>
      deleteAppointment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
    }
  })
}

export function useCreateAppointmentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentNoteParams) =>
      createAppointmentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useUpdateAppointmentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentNoteParams) =>
      updateAppointmentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useDeleteAppointmentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { appointmentNote: { id: number } }) =>
      deleteAppointmentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useCreateAppointmentReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentReminderParams) =>
      createAppointmentReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useUpdateAppointmentReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentReminderParams) =>
      updateAppointmentReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useDeleteAppointmentReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { reminder: Record<string, unknown> }) =>
      deleteAppointmentReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useUpdateAppointmentStatus(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateAppointmentStatusParams) =>
      updateAppointmentStatus(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useSendCalendarInvite(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: SendCalendarInviteParams) =>
      sendCalendarInvite(header, params)
  })
}
