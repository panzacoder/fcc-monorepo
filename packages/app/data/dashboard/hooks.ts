import { useQuery, useMutation } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getWeekDetails,
  updateFcmToken,
  getCalendarItems,
  getConsolidatedFilterOptions,
  getConsolidatedDetails,
  getFilterConsolidatedDetails
} from './api'
import type {
  UpdateFcmTokenParams,
  GetCalendarItemsParams,
  GetConsolidatedDetailsParams,
  GetFilterConsolidatedDetailsParams
} from './types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  weekDetails: () => [...dashboardKeys.all, 'weekDetails'] as const,
  calendarItems: () => [...dashboardKeys.all, 'calendarItems'] as const,
  calendarItem: (params: GetCalendarItemsParams) =>
    [...dashboardKeys.calendarItems(), params] as const,
  consolidatedFilterOptions: () =>
    [...dashboardKeys.all, 'consolidatedFilterOptions'] as const,
  consolidatedDetails: () =>
    [...dashboardKeys.all, 'consolidatedDetails'] as const,
  consolidatedDetail: (params: GetConsolidatedDetailsParams) =>
    [...dashboardKeys.consolidatedDetails(), params] as const,
  filteredConsolidatedDetails: () =>
    [...dashboardKeys.all, 'filteredConsolidatedDetails'] as const,
  filteredConsolidatedDetail: (params: GetFilterConsolidatedDetailsParams) =>
    [...dashboardKeys.filteredConsolidatedDetails(), params] as const
}

export function useWeekDetails(header: AuthHeader) {
  return useQuery({
    queryKey: dashboardKeys.weekDetails(),
    queryFn: () => getWeekDetails(header),
    enabled: !!header
  })
}

export function useUpdateFcmToken(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: UpdateFcmTokenParams) => updateFcmToken(header, params)
  })
}

export function useCalendarItems(
  header: AuthHeader,
  params: GetCalendarItemsParams
) {
  return useQuery({
    queryKey: dashboardKeys.calendarItem(params),
    queryFn: () => getCalendarItems(header, params),
    enabled: !!header && !!params.memberId
  })
}

export function useConsolidatedFilterOptions(header: AuthHeader) {
  return useQuery({
    queryKey: dashboardKeys.consolidatedFilterOptions(),
    queryFn: () => getConsolidatedFilterOptions(header),
    enabled: !!header
  })
}

export function useConsolidatedDetails(
  header: AuthHeader,
  params: GetConsolidatedDetailsParams
) {
  return useQuery({
    queryKey: dashboardKeys.consolidatedDetail(params),
    queryFn: () => getConsolidatedDetails(header, params),
    enabled: !!header && !!params.fromdate && !!params.todate
  })
}

export function useFilterConsolidatedDetails(
  header: AuthHeader,
  params: GetFilterConsolidatedDetailsParams
) {
  return useQuery({
    queryKey: dashboardKeys.filteredConsolidatedDetail(params),
    queryFn: () => getFilterConsolidatedDetails(header, params),
    enabled: !!header && !!params.fromdate && !!params.todate && !!params.type
  })
}
