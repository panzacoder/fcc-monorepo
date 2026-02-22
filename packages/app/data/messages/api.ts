import { fetchData, type AuthHeader } from '../base'
import {
  GET_MEMBER_THREADS,
  GET_THREAD,
  CREATE_MESSAGE_THREAD,
  UPDATE_MESSAGE_THREAD,
  GET_THREAD_PARTICIPANTS,
  UPDATE_THREAD_PARTICIPANTS
} from 'app/utils/urlConstants'
import type {
  GetMemberThreadsResponse,
  GetMemberThreadsParams,
  GetThreadResponse,
  GetThreadParams,
  CreateMessageThreadParams,
  CreateMessageThreadResponse,
  UpdateMessageThreadParams,
  GetThreadParticipantsParams,
  GetThreadParticipantsResponse,
  UpdateThreadParticipantsParams
} from './types'

export async function getMemberThreads(
  header: AuthHeader,
  params: GetMemberThreadsParams
) {
  return fetchData<GetMemberThreadsResponse>({
    header,
    route: GET_MEMBER_THREADS,
    data: params
  })
}

export async function getThread(header: AuthHeader, params: GetThreadParams) {
  return fetchData<GetThreadResponse>({
    header,
    route: GET_THREAD,
    data: params
  })
}

export async function createMessageThread(
  header: AuthHeader,
  params: CreateMessageThreadParams
) {
  return fetchData<CreateMessageThreadResponse>({
    header,
    route: CREATE_MESSAGE_THREAD,
    data: params
  })
}

export async function updateMessageThread(
  header: AuthHeader,
  params: UpdateMessageThreadParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MESSAGE_THREAD,
    data: params
  })
}

export async function getThreadParticipants(
  header: AuthHeader,
  params: GetThreadParticipantsParams
) {
  return fetchData<GetThreadParticipantsResponse>({
    header,
    route: GET_THREAD_PARTICIPANTS,
    data: params
  })
}

export async function updateThreadParticipants(
  header: AuthHeader,
  params: UpdateThreadParticipantsParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_THREAD_PARTICIPANTS,
    data: params
  })
}
