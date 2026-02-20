import { fetchData, type AuthHeader } from '../base'
import {
  GET_WEEK_DETAILS,
  UPDATE_FCM_TOKEN,
  GET_CALENDER_ITEMS,
  GET_CONSOLIDATED_FILTER_OPTIONS,
  GET_CONSOLIDATED_DETAILS,
  GET_FILTER_CONSOLIDATED_DETAILS
} from 'app/utils/urlConstants'
import type {
  GetWeekDetailsResponse,
  UpdateFcmTokenParams,
  GetCalendarItemsParams,
  GetCalendarItemsResponse,
  GetConsolidatedFilterOptionsResponse,
  GetConsolidatedDetailsParams,
  GetConsolidatedDetailsResponse,
  GetFilterConsolidatedDetailsParams
} from './types'

export async function getWeekDetails(header: AuthHeader) {
  return fetchData<GetWeekDetailsResponse>({
    header,
    route: GET_WEEK_DETAILS
  })
}

export async function updateFcmToken(
  header: AuthHeader,
  params: UpdateFcmTokenParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_FCM_TOKEN,
    data: params
  })
}

export async function getCalendarItems(
  header: AuthHeader,
  params: GetCalendarItemsParams
) {
  return fetchData<GetCalendarItemsResponse>({
    header,
    route: GET_CALENDER_ITEMS,
    data: {
      member: {
        id: params.memberId
      },
      month: params.month,
      year: params.year
    }
  })
}

export async function getConsolidatedFilterOptions(header: AuthHeader) {
  return fetchData<GetConsolidatedFilterOptionsResponse>({
    header,
    route: GET_CONSOLIDATED_FILTER_OPTIONS
  })
}

export async function getConsolidatedDetails(
  header: AuthHeader,
  params: GetConsolidatedDetailsParams
) {
  return fetchData<GetConsolidatedDetailsResponse>({
    header,
    route: GET_CONSOLIDATED_DETAILS,
    data: params
  })
}

export async function getFilterConsolidatedDetails(
  header: AuthHeader,
  params: GetFilterConsolidatedDetailsParams
) {
  return fetchData<GetConsolidatedDetailsResponse>({
    header,
    route: GET_FILTER_CONSOLIDATED_DETAILS,
    data: params
  })
}
