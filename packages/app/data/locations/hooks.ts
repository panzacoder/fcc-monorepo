import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getStatesAndTimezones,
  createDoctorLocation,
  createFacilityLocation,
  updateDoctorLocation,
  updateFacilityLocation,
  deleteDoctorLocation,
  deleteFacilityLocation
} from './api'
import { doctorKeys } from '../doctors/hooks'
import { facilityKeys } from '../facilities/hooks'
import type {
  GetStatesAndTimezonesParams,
  CreateDoctorLocationParams,
  CreateFacilityLocationParams,
  UpdateDoctorLocationParams,
  UpdateFacilityLocationParams,
  DeleteDoctorLocationParams,
  DeleteFacilityLocationParams
} from './types'

export const locationKeys = {
  all: ['locations'] as const,
  statesAndTimezones: (countryId: number) =>
    [...locationKeys.all, 'statesAndTimezones', countryId] as const
}

export function useStatesAndTimezones(
  header: AuthHeader,
  params: GetStatesAndTimezonesParams
) {
  return useQuery({
    queryKey: locationKeys.statesAndTimezones(params.countryId),
    queryFn: () => getStatesAndTimezones(header, params),
    enabled: !!header && !!params.countryId
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

export function useCreateFacilityLocation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateFacilityLocationParams) =>
      createFacilityLocation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
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

export function useUpdateFacilityLocation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateFacilityLocationParams) =>
      updateFacilityLocation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
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

export function useDeleteFacilityLocation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteFacilityLocationParams) =>
      deleteFacilityLocation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
    }
  })
}
