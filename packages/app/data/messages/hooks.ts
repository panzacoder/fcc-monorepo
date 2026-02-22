import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getMemberThreads,
  getThread,
  createMessageThread,
  updateMessageThread,
  getThreadParticipants,
  updateThreadParticipants
} from './api'
import type {
  GetMemberThreadsParams,
  GetThreadParams,
  CreateMessageThreadParams,
  UpdateMessageThreadParams,
  GetThreadParticipantsParams,
  UpdateThreadParticipantsParams
} from './types'

export const messageKeys = {
  all: ['messages'] as const,
  threads: () => [...messageKeys.all, 'threads'] as const,
  threadList: (params: GetMemberThreadsParams) =>
    [...messageKeys.threads(), params] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (params: GetThreadParams) =>
    [...messageKeys.details(), params] as const,
  participants: (params: GetThreadParticipantsParams) =>
    [...messageKeys.all, 'participants', params] as const
}

export function useMemberThreads(
  header: AuthHeader,
  params: GetMemberThreadsParams
) {
  return useQuery({
    queryKey: messageKeys.threadList(params),
    queryFn: () => getMemberThreads(header, params),
    enabled: !!header
  })
}

export function useThread(header: AuthHeader, params: GetThreadParams) {
  return useQuery({
    queryKey: messageKeys.detail(params),
    queryFn: () => getThread(header, params),
    enabled: !!header && !!params.messageThread.id
  })
}

export function useThreadParticipants(
  header: AuthHeader,
  params: GetThreadParticipantsParams
) {
  return useQuery({
    queryKey: messageKeys.participants(params),
    queryFn: () => getThreadParticipants(header, params),
    enabled: !!header
  })
}

export function useCreateMessageThread(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateMessageThreadParams) =>
      createMessageThread(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.threads() })
    }
  })
}

export function useUpdateMessageThread(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateMessageThreadParams) =>
      updateMessageThread(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all })
    }
  })
}

export function useUpdateThreadParticipants(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateThreadParticipantsParams) =>
      updateThreadParticipants(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all })
    }
  })
}
