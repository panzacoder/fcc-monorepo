import { fetchData, type AuthHeader } from '../base'
import {
  GET_TRANSPORTATION_REQUESTS,
  GET_TRANSPORTATION_MEMBER_LIST,
  CREATE_TRANSPORTATION,
  UPDATE_TRANSPORTATION,
  DELETE_TRANSPORTATION,
  CREATE_TRANSPORTATION_EVENT,
  UPDATE_TRANSPORTATION_EVENT,
  DELETE_TRANSPORTATION_EVENT,
  APPROVE_TRANSPORT,
  REJECT_TRANSPORT,
  EVENT_ACCEPT_TRANSPORTATION_REQUEST,
  EVENT_REJECT_TRANSPORTATION_REQUEST,
  RESEND_TRANSPORTATION_REQUEST,
  RESEND_TRANSPORTATION_REQUEST_EVENT,
  CANCEL_TRANSPORTATION_REQUEST,
  CANCEL_TRANSPORTATION_REQUEST_EVENT,
  CREATE_TRANSPORTATION_REMINDER,
  UPDATE_TRANSPORTATION_REMINDER,
  DELETE_TRANSPORTATION_REMINDER,
  CREATE_TRANSPORTATION_REMINDER_EVENT,
  UPDATE_TRANSPORTATION_REMINDER_EVENT,
  DELETE_TRANSPORTATION_REMINDER_EVENT
} from 'app/utils/urlConstants'
import type {
  TransportationRequestsParams,
  TransportationMemberListParams,
  CreateTransportationParams,
  UpdateTransportationParams,
  DeleteTransportationParams,
  CreateTransportationEventParams,
  UpdateTransportationEventParams,
  DeleteTransportationEventParams,
  ApproveTransportParams,
  RejectTransportParams,
  EventAcceptTransportationRequestParams,
  EventRejectTransportationRequestParams,
  ResendTransportationRequestParams,
  ResendTransportationRequestEventParams,
  CancelTransportationRequestParams,
  CancelTransportationRequestEventParams,
  CreateTransportationReminderParams,
  UpdateTransportationReminderParams,
  DeleteTransportationReminderParams,
  CreateTransportationReminderEventParams,
  UpdateTransportationReminderEventParams,
  DeleteTransportationReminderEventParams
} from './types'

export async function getTransportationRequests(
  header: AuthHeader,
  params: TransportationRequestsParams
) {
  return fetchData<any>({
    header,
    route: GET_TRANSPORTATION_REQUESTS,
    data: {
      member: { id: params.memberId }
    }
  })
}

export async function getTransportationMemberList(
  header: AuthHeader,
  params: TransportationMemberListParams
) {
  return fetchData<any>({
    header,
    route: GET_TRANSPORTATION_MEMBER_LIST,
    data: {
      member: { id: params.memberId }
    }
  })
}

export async function createTransportation(
  header: AuthHeader,
  params: CreateTransportationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_TRANSPORTATION,
    data: params
  })
}

export async function updateTransportation(
  header: AuthHeader,
  params: UpdateTransportationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_TRANSPORTATION,
    data: params
  })
}

export async function deleteTransportation(
  header: AuthHeader,
  params: DeleteTransportationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_TRANSPORTATION,
    data: params
  })
}

export async function createTransportationEvent(
  header: AuthHeader,
  params: CreateTransportationEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_TRANSPORTATION_EVENT,
    data: params
  })
}

export async function updateTransportationEvent(
  header: AuthHeader,
  params: UpdateTransportationEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_TRANSPORTATION_EVENT,
    data: params
  })
}

export async function deleteTransportationEvent(
  header: AuthHeader,
  params: DeleteTransportationEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_TRANSPORTATION_EVENT,
    data: params
  })
}

export async function approveTransport(
  header: AuthHeader,
  params: ApproveTransportParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: APPROVE_TRANSPORT,
    data: params
  })
}

export async function rejectTransport(
  header: AuthHeader,
  params: RejectTransportParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: REJECT_TRANSPORT,
    data: params
  })
}

export async function eventAcceptTransportationRequest(
  header: AuthHeader,
  params: EventAcceptTransportationRequestParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: EVENT_ACCEPT_TRANSPORTATION_REQUEST,
    data: params
  })
}

export async function eventRejectTransportationRequest(
  header: AuthHeader,
  params: EventRejectTransportationRequestParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: EVENT_REJECT_TRANSPORTATION_REQUEST,
    data: params
  })
}

export async function resendTransportationRequest(
  header: AuthHeader,
  params: ResendTransportationRequestParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: RESEND_TRANSPORTATION_REQUEST,
    data: params
  })
}

export async function resendTransportationRequestEvent(
  header: AuthHeader,
  params: ResendTransportationRequestEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: RESEND_TRANSPORTATION_REQUEST_EVENT,
    data: params
  })
}

export async function cancelTransportationRequest(
  header: AuthHeader,
  params: CancelTransportationRequestParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CANCEL_TRANSPORTATION_REQUEST,
    data: params
  })
}

export async function cancelTransportationRequestEvent(
  header: AuthHeader,
  params: CancelTransportationRequestEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CANCEL_TRANSPORTATION_REQUEST_EVENT,
    data: params
  })
}

export async function createTransportationReminder(
  header: AuthHeader,
  params: CreateTransportationReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_TRANSPORTATION_REMINDER,
    data: params
  })
}

export async function updateTransportationReminder(
  header: AuthHeader,
  params: UpdateTransportationReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_TRANSPORTATION_REMINDER,
    data: params
  })
}

export async function deleteTransportationReminder(
  header: AuthHeader,
  params: DeleteTransportationReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_TRANSPORTATION_REMINDER,
    data: params
  })
}

export async function createTransportationReminderEvent(
  header: AuthHeader,
  params: CreateTransportationReminderEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_TRANSPORTATION_REMINDER_EVENT,
    data: params
  })
}

export async function updateTransportationReminderEvent(
  header: AuthHeader,
  params: UpdateTransportationReminderEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_TRANSPORTATION_REMINDER_EVENT,
    data: params
  })
}

export async function deleteTransportationReminderEvent(
  header: AuthHeader,
  params: DeleteTransportationReminderEventParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_TRANSPORTATION_REMINDER_EVENT,
    data: params
  })
}
