import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getMemberFacilities,
  getFacilityDetails,
  createFacility,
  updateFacility,
  deleteFacility,
  createFacilityLocation,
  updateFacilityLocation,
  deleteFacilityLocation,
  getPharmacyList,
  shareFacility
} from './api'
import type {
  GetMemberFacilitiesParams,
  GetFacilityDetailsParams,
  CreateFacilityParams,
  UpdateFacilityParams,
  DeleteFacilityParams,
  CreateFacilityLocationParams,
  UpdateFacilityLocationParams,
  DeleteFacilityLocationParams,
  ShareFacilityParams
} from './types'

export const facilityKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilityKeys.all, 'list'] as const,
  list: (params: GetMemberFacilitiesParams) =>
    [...facilityKeys.lists(), params] as const,
  details: () => [...facilityKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...facilityKeys.details(), id] as const,
  pharmacies: () => [...facilityKeys.all, 'pharmacy'] as const,
  pharmacyList: (params: GetMemberFacilitiesParams) =>
    [...facilityKeys.pharmacies(), params] as const
}

export function useMemberFacilities(
  header: AuthHeader,
  params: GetMemberFacilitiesParams
) {
  return useQuery({
    queryKey: facilityKeys.list(params),
    queryFn: () => getMemberFacilities(header, params),
    enabled: !!header
  })
}

export function useFacilityDetails(
  header: AuthHeader,
  params: GetFacilityDetailsParams
) {
  return useQuery({
    queryKey: facilityKeys.detail(params.id),
    queryFn: () => getFacilityDetails(header, params),
    enabled: !!header && !!params.id
  })
}

export function usePharmacyList(
  header: AuthHeader,
  params: GetMemberFacilitiesParams
) {
  return useQuery({
    queryKey: facilityKeys.pharmacyList(params),
    queryFn: () => getPharmacyList(header, params),
    enabled: !!header
  })
}

export function useCreateFacility(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateFacilityParams) =>
      createFacility(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() })
    }
  })
}

export function useUpdateFacility(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateFacilityParams) =>
      updateFacility(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.all })
    }
  })
}

export function useDeleteFacility(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteFacilityParams) =>
      deleteFacility(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() })
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

export function useShareFacility(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ShareFacilityParams) => shareFacility(header, params)
  })
}
