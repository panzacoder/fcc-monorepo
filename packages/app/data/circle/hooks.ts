import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  findCircle,
  joinCircle,
  createCircle,
  getMemberDetails,
  getMemberMenus,
  acceptSharedInfo,
  rejectSharedInfo,
  acceptMemberRequest,
  rejectMemberRequest
} from './api'
import type {
  FindCircleParams,
  JoinCircleParams,
  CreateCircleParams,
  GetMemberDetailsParams,
  GetMemberMenusParams,
  AcceptSharedInfoParams,
  RejectSharedInfoParams,
  AcceptMemberRequestParams,
  RejectMemberRequestParams
} from './types'

export const circleKeys = {
  all: ['circle'] as const,
  find: (params: FindCircleParams) =>
    [...circleKeys.all, 'find', params] as const,
  allMemberDetails: () => [...circleKeys.all, 'memberDetails'] as const,
  memberDetails: (memberId: number | string) =>
    [...circleKeys.all, 'memberDetails', memberId] as const,
  memberMenus: (memberId: number | string) =>
    [...circleKeys.all, 'memberMenus', memberId] as const
}

export function useFindCircle(header: AuthHeader, params: FindCircleParams) {
  return useQuery({
    queryKey: circleKeys.find(params),
    queryFn: () => findCircle(header, params),
    enabled: !!header && !!(params.email || params.phone)
  })
}

export function useAllMemberDetails(header: AuthHeader) {
  return useQuery({
    queryKey: circleKeys.allMemberDetails(),
    queryFn: () => getMemberDetails(header),
    enabled: !!header
  })
}

export function useMemberDetails(
  header: AuthHeader,
  memberId: number | string
) {
  return useQuery({
    queryKey: circleKeys.memberDetails(memberId),
    queryFn: () => getMemberDetails(header, { member: { id: memberId } }),
    enabled: !!header && !!memberId
  })
}

export function useMemberMenus(header: AuthHeader, memberId: number | string) {
  return useQuery({
    queryKey: circleKeys.memberMenus(memberId),
    queryFn: () => getMemberMenus(header, { member: { id: memberId } }),
    enabled: !!header && !!memberId
  })
}

export function useJoinCircle(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: JoinCircleParams) => joinCircle(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    }
  })
}

export function useCreateCircle(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateCircleParams) => createCircle(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    }
  })
}

export function useAcceptSharedInfo(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AcceptSharedInfoParams) =>
      acceptSharedInfo(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    }
  })
}

export function useRejectSharedInfo(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: RejectSharedInfoParams) =>
      rejectSharedInfo(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    }
  })
}

export function useAcceptMemberRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AcceptMemberRequestParams) =>
      acceptMemberRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    }
  })
}

export function useRejectMemberRequest(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: RejectMemberRequestParams) =>
      rejectMemberRequest(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all })
    }
  })
}
