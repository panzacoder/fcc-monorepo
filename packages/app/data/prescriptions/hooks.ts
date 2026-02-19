import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getPrescriptionList,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription
} from './api'
import type {
  GetPrescriptionListParams,
  GetPrescriptionParams,
  CreatePrescriptionParams,
  UpdatePrescriptionParams,
  DeletePrescriptionParams
} from './types'

export const prescriptionKeys = {
  all: ['prescriptions'] as const,
  lists: () => [...prescriptionKeys.all, 'list'] as const,
  list: (params: GetPrescriptionListParams) =>
    [...prescriptionKeys.lists(), params] as const,
  details: () => [...prescriptionKeys.all, 'detail'] as const,
  detail: (params: GetPrescriptionParams) =>
    [...prescriptionKeys.details(), params] as const
}

export function usePrescriptionList(
  header: AuthHeader,
  params: GetPrescriptionListParams
) {
  return useQuery({
    queryKey: prescriptionKeys.list(params),
    queryFn: () => getPrescriptionList(header, params),
    enabled: !!header
  })
}

export function usePrescription(
  header: AuthHeader,
  params: GetPrescriptionParams
) {
  return useQuery({
    queryKey: prescriptionKeys.detail(params),
    queryFn: () => getPrescription(header, params),
    enabled: !!header
  })
}

export function useCreatePrescription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreatePrescriptionParams) =>
      createPrescription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
    }
  })
}

export function useUpdatePrescription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdatePrescriptionParams) =>
      updatePrescription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all })
    }
  })
}

export function useDeletePrescription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeletePrescriptionParams) =>
      deletePrescription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
    }
  })
}
