import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getMedicalDevices,
  getMedicalDeviceDetails,
  createMedicalDevice,
  updateMedicalDevice,
  deleteMedicalDevice,
  createMedicalDeviceNote,
  updateMedicalDeviceNote,
  deleteMedicalDeviceNote,
  getMedicalDeviceNote,
  createMedicalDeviceReminder,
  updateMedicalDeviceReminder,
  deleteMedicalDeviceReminder
} from './api'
import type {
  GetMedicalDevicesParams,
  CreateMedicalDeviceParams,
  UpdateMedicalDeviceParams,
  DeleteMedicalDeviceParams,
  MedicalDeviceNoteParams,
  DeleteMedicalDeviceNoteParams,
  MedicalDeviceReminderParams,
  DeleteMedicalDeviceReminderParams,
  GetMedicalDeviceNoteParams
} from './types'

export const medicalDeviceKeys = {
  all: ['medical-devices'] as const,
  lists: () => [...medicalDeviceKeys.all, 'list'] as const,
  list: (params: GetMedicalDevicesParams) =>
    [...medicalDeviceKeys.lists(), params] as const,
  details: () => [...medicalDeviceKeys.all, 'detail'] as const,
  detail: (id: number) => [...medicalDeviceKeys.details(), id] as const,
  notes: () => [...medicalDeviceKeys.all, 'note'] as const,
  note: (id: number) => [...medicalDeviceKeys.notes(), id] as const
}

export function useMedicalDevices(
  header: AuthHeader,
  params: GetMedicalDevicesParams
) {
  return useQuery({
    queryKey: medicalDeviceKeys.list(params),
    queryFn: () => getMedicalDevices(header, params),
    enabled: !!header
  })
}

export function useMedicalDeviceDetails(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: medicalDeviceKeys.detail(id),
    queryFn: () => getMedicalDeviceDetails(header, { id }),
    enabled: !!header && !!id
  })
}

export function useMedicalDeviceNote(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: medicalDeviceKeys.note(id),
    queryFn: () => getMedicalDeviceNote(header, { note: { id } }),
    enabled: !!header && !!id
  })
}

export function useCreateMedicalDevice(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateMedicalDeviceParams) =>
      createMedicalDevice(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.lists() })
    }
  })
}

export function useUpdateMedicalDevice(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateMedicalDeviceParams) =>
      updateMedicalDevice(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}

export function useDeleteMedicalDevice(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteMedicalDeviceParams) =>
      deleteMedicalDevice(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.lists() })
    }
  })
}

export function useCreateMedicalDeviceNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: MedicalDeviceNoteParams) =>
      createMedicalDeviceNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}

export function useUpdateMedicalDeviceNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: MedicalDeviceNoteParams) =>
      updateMedicalDeviceNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}

export function useDeleteMedicalDeviceNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteMedicalDeviceNoteParams) =>
      deleteMedicalDeviceNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}

export function useCreateMedicalDeviceReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: MedicalDeviceReminderParams) =>
      createMedicalDeviceReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}

export function useUpdateMedicalDeviceReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: MedicalDeviceReminderParams) =>
      updateMedicalDeviceReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}

export function useDeleteMedicalDeviceReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteMedicalDeviceReminderParams) =>
      deleteMedicalDeviceReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalDeviceKeys.all })
    }
  })
}
