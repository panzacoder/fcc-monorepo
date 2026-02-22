import { fetchData, type AuthHeader } from '../base'
import {
  GET_INCIDENTS,
  GET_INCIDENT_DETAILS,
  CREATE_INCIDENT,
  UPDATE_INCIDENT,
  DELETE_INCIDENT,
  CREATE_INCIDENT_NOTE,
  UPDATE_INCIDENT_NOTE,
  DELETE_INCIDENT_NOTE,
  GET_INCIDENT_NOTE
} from 'app/utils/urlConstants'
import type {
  IncidentListResponse,
  GetIncidentsParams,
  IncidentDetailResponse,
  CreateIncidentParams,
  UpdateIncidentParams,
  DeleteIncidentParams,
  IncidentNoteParams,
  DeleteIncidentNoteParams,
  GetIncidentNoteParams
} from './types'

export async function getIncidents(
  header: AuthHeader,
  params: GetIncidentsParams
) {
  return fetchData<IncidentListResponse>({
    header,
    route: GET_INCIDENTS,
    data: {
      incident: {
        member: { id: params.memberId }
      },
      month: params.month,
      year: params.year
    }
  })
}

export async function getIncidentDetails(
  header: AuthHeader,
  params: { id: number }
) {
  return fetchData<IncidentDetailResponse>({
    header,
    route: GET_INCIDENT_DETAILS,
    data: { incident: params }
  })
}

export async function createIncident(
  header: AuthHeader,
  params: CreateIncidentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_INCIDENT,
    data: params
  })
}

export async function updateIncident(
  header: AuthHeader,
  params: UpdateIncidentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_INCIDENT,
    data: params
  })
}

export async function deleteIncident(
  header: AuthHeader,
  params: DeleteIncidentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_INCIDENT,
    data: params
  })
}

export async function createIncidentNote(
  header: AuthHeader,
  params: IncidentNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_INCIDENT_NOTE,
    data: params
  })
}

export async function updateIncidentNote(
  header: AuthHeader,
  params: IncidentNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_INCIDENT_NOTE,
    data: params
  })
}

export async function deleteIncidentNote(
  header: AuthHeader,
  params: DeleteIncidentNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_INCIDENT_NOTE,
    data: params
  })
}

export async function getIncidentNote(
  header: AuthHeader,
  params: GetIncidentNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: GET_INCIDENT_NOTE,
    data: params
  })
}
