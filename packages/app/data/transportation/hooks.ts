import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getTransportationRequests,
  getTransportationMemberList,
  createTransportation,
  updateTransportation,
  deleteTransportation,
  createTransportationEvent,
  updateTransportationEvent,
  deleteTransportationEvent,
  approveTransport,
  rejectTransport,
  eventAcceptTransportationRequest,
  eventRejectTransportationRequest,
  resendTransportationRequest,
  resendTransportationRequestEvent,
  cancelTransportationRequest,
  cancelTransportationRequestEvent,
  createTransportationReminder,
  updateTransportationReminder,
  deleteTransportationReminder,
  createTransportationReminderEvent,
  updateTransportationReminderEvent,
  deleteTransportationReminderEvent
} from './api'
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

export const transportationKeys = {
  all: ['transportation'] as const,
  requests: () => [...transportationKeys.all, 'requests'] as const,
  request: (params: TransportationRequestsParams) =>
    [...transportationKeys.requests(), params] as const,
  memberLists: () => [...transportationKeys.all, 'memberList'] as const,
  memberList: (params: TransportationMemberListParams) =>
    [...transportationKeys.memberLists(), params] as const
}

export function useTransportationRequests(
  header: AuthHeader,
  params: TransportationRequestsParams
) {
  return useQuery({
    queryKey: transportationKeys.request(params),
    queryFn: () => getTransportationRequests(header, params),
    enabled: !!header
  })
}

export function useTransportationMemberList(
  header: AuthHeader,
  params: TransportationMemberListParams
) {
  return useQuery({
    queryKey: transportationKeys.memberList(params),
    queryFn: () => getTransportationMemberList(header, params),
    enabled: !!header
  })
}

export function useCreateTransportation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateTransportationParams) =>
      createTransportation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useUpdateTransportation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateTransportationParams) =>
      updateTransportation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useDeleteTransportation(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteTransportationParams) =>
      deleteTransportation(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useCreateTransportationEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateTransportationEventParams) =>
      createTransportationEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useUpdateTransportationEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateTransportationEventParams) =>
      updateTransportationEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useDeleteTransportationEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteTransportationEventParams) =>
      deleteTransportationEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useApproveTransport(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: ApproveTransportParams) =>
      approveTransport(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useRejectTransport(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: RejectTransportParams) =>
      rejectTransport(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useEventAcceptTransportationRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: EventAcceptTransportationRequestParams) =>
      eventAcceptTransportationRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useEventRejectTransportationRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: EventRejectTransportationRequestParams) =>
      eventRejectTransportationRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useResendTransportationRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: ResendTransportationRequestParams) =>
      resendTransportationRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useResendTransportationRequestEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: ResendTransportationRequestEventParams) =>
      resendTransportationRequestEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useCancelTransportationRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CancelTransportationRequestParams) =>
      cancelTransportationRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useCancelTransportationRequestEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CancelTransportationRequestEventParams) =>
      cancelTransportationRequestEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useCreateTransportationReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateTransportationReminderParams) =>
      createTransportationReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useUpdateTransportationReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateTransportationReminderParams) =>
      updateTransportationReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useDeleteTransportationReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteTransportationReminderParams) =>
      deleteTransportationReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useCreateTransportationReminderEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateTransportationReminderEventParams) =>
      createTransportationReminderEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useUpdateTransportationReminderEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateTransportationReminderEventParams) =>
      updateTransportationReminderEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}

export function useDeleteTransportationReminderEvent(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteTransportationReminderEventParams) =>
      deleteTransportationReminderEvent(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportationKeys.all })
    }
  })
}
