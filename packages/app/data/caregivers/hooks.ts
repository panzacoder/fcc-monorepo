import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getMemberCaregivers,
  getCaregiverDetails,
  createCaregiver,
  updateCaregiver,
  deleteCaregiver,
  findCaregiverByEmailPhone,
  resendCaregiverRequest
} from './api'
import type {
  GetMemberCaregiversParams,
  GetCaregiverDetailsParams,
  CreateCaregiverParams,
  UpdateCaregiverParams,
  DeleteCaregiverParams,
  FindCaregiverByEmailPhoneParams,
  ResendCaregiverRequestParams
} from './types'

export const caregiverKeys = {
  all: ['caregivers'] as const,
  lists: () => [...caregiverKeys.all, 'list'] as const,
  list: (params: GetMemberCaregiversParams) =>
    [...caregiverKeys.lists(), params] as const,
  details: () => [...caregiverKeys.all, 'detail'] as const,
  detail: (params: GetCaregiverDetailsParams) =>
    [...caregiverKeys.details(), params] as const,
  findByEmailPhone: (params: FindCaregiverByEmailPhoneParams) =>
    [...caregiverKeys.all, 'findByEmailPhone', params] as const
}

export function useMemberCaregivers(
  header: AuthHeader,
  params: GetMemberCaregiversParams
) {
  return useQuery({
    queryKey: caregiverKeys.list(params),
    queryFn: () => getMemberCaregivers(header, params),
    enabled: !!header
  })
}

export function useCaregiverDetails(
  header: AuthHeader,
  params: GetCaregiverDetailsParams
) {
  return useQuery({
    queryKey: caregiverKeys.detail(params),
    queryFn: () => getCaregiverDetails(header, params),
    enabled: !!header && !!params.id
  })
}

export function useFindCaregiverByEmailPhone(
  header: AuthHeader,
  params: FindCaregiverByEmailPhoneParams
) {
  return useQuery({
    queryKey: caregiverKeys.findByEmailPhone(params),
    queryFn: () => findCaregiverByEmailPhone(header, params),
    enabled: !!header && !!params.email
  })
}

export function useCreateCaregiver(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateCaregiverParams) =>
      createCaregiver(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.lists() })
    }
  })
}

export function useUpdateCaregiver(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateCaregiverParams) =>
      updateCaregiver(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.all })
    }
  })
}

export function useDeleteCaregiver(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteCaregiverParams) =>
      deleteCaregiver(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.lists() })
    }
  })
}

export function useResendCaregiverRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: ResendCaregiverRequestParams) =>
      resendCaregiverRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caregiverKeys.all })
    }
  })
}
