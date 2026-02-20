import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getMemberDoctors,
  getDoctorDetails,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createDoctorLocation,
  updateDoctorLocation,
  deleteDoctorLocation,
  getActiveDoctors,
  shareDoctor
} from './api'
import type {
  GetMemberDoctorsParams,
  GetDoctorDetailsParams,
  CreateDoctorParams,
  UpdateDoctorParams,
  DeleteDoctorParams,
  CreateDoctorLocationParams,
  UpdateDoctorLocationParams,
  DeleteDoctorLocationParams,
  GetActiveDoctorsParams,
  ShareDoctorParams
} from './types'

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: GetMemberDoctorsParams) =>
    [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...doctorKeys.details(), id] as const,
  active: (memberId: number | string) =>
    [...doctorKeys.all, 'active', memberId] as const
}

export function useMemberDoctors(
  header: AuthHeader,
  params: GetMemberDoctorsParams
) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => getMemberDoctors(header, params),
    enabled: !!header
  })
}

export function useDoctorDetails(
  header: AuthHeader,
  params: GetDoctorDetailsParams
) {
  return useQuery({
    queryKey: doctorKeys.detail(params.id),
    queryFn: () => getDoctorDetails(header, params),
    enabled: !!header && !!params.id
  })
}

export function useActiveDoctors(
  header: AuthHeader,
  params: GetActiveDoctorsParams
) {
  return useQuery({
    queryKey: doctorKeys.active(params.memberId),
    queryFn: () => getActiveDoctors(header, params),
    enabled: !!header
  })
}

export function useCreateDoctor(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateDoctorParams) => createDoctor(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
    }
  })
}

export function useUpdateDoctor(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateDoctorParams) => updateDoctor(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all })
    }
  })
}

export function useDeleteDoctor(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteDoctorParams) => deleteDoctor(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
    }
  })
}

export function useCreateDoctorLocation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateDoctorLocationParams) =>
      createDoctorLocation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all })
    }
  })
}

export function useUpdateDoctorLocation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateDoctorLocationParams) =>
      updateDoctorLocation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all })
    }
  })
}

export function useDeleteDoctorLocation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteDoctorLocationParams) =>
      deleteDoctorLocation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all })
    }
  })
}

export function useShareDoctor(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ShareDoctorParams) => shareDoctor(header, params)
  })
}
