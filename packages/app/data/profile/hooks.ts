import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getUserProfile,
  updateProfile,
  getMemberProfile,
  autoSubscription,
  manualSubscription,
  cancelSubscription,
  deleteAccount,
  checkValidCredential,
  updateSponsorCode,
  updateMemberAuthorizedCaregiver,
  updateMemberAddress,
  updateMemberAuthorizedCaregiverAddress,
  deleteAuthorizedCaregiver,
  deleteCaregiver,
  deleteMember
} from './api'
import type {
  GetUserProfileParams,
  GetMemberProfileParams,
  UpdateProfileParams,
  AutoSubscriptionParams,
  ManualSubscriptionParams,
  CancelSubscriptionParams,
  DeleteAccountParams,
  CheckValidCredentialParams,
  UpdateSponsorCodeParams,
  UpdateMemberAuthorizedCaregiverParams,
  UpdateMemberAddressParams,
  UpdateMemberAuthorizedCaregiverAddressParams,
  DeleteAuthorizedCaregiverParams,
  DeleteCaregiverParams,
  DeleteMemberParams
} from './types'

export const profileKeys = {
  all: ['profile'] as const,
  user: () => [...profileKeys.all, 'user'] as const,
  userDetail: (params: GetUserProfileParams) =>
    [...profileKeys.user(), params] as const,
  members: () => [...profileKeys.all, 'member'] as const,
  member: (params: GetMemberProfileParams) =>
    [...profileKeys.members(), params] as const
}

export function useUserProfile(
  header: AuthHeader,
  params: GetUserProfileParams
) {
  return useQuery({
    queryKey: profileKeys.userDetail(params),
    queryFn: () => getUserProfile(header, params),
    enabled: !!header && !!params.member.id
  })
}

export function useMemberProfile(
  header: AuthHeader,
  params: GetMemberProfileParams
) {
  return useQuery({
    queryKey: profileKeys.member(params),
    queryFn: () => getMemberProfile(header, params),
    enabled: !!header && !!params.member.id
  })
}

export function useUpdateProfile(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateProfile(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useAutoSubscription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AutoSubscriptionParams) =>
      autoSubscription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useManualSubscription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: ManualSubscriptionParams) =>
      manualSubscription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useCancelSubscription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CancelSubscriptionParams) =>
      cancelSubscription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useDeleteAccount(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: DeleteAccountParams) => deleteAccount(header, params)
  })
}

export function useCheckValidCredential(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: CheckValidCredentialParams) =>
      checkValidCredential(header, params)
  })
}

export function useUpdateSponsorCode(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateSponsorCodeParams) =>
      updateSponsorCode(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useUpdateMemberAuthorizedCaregiver(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateMemberAuthorizedCaregiverParams) =>
      updateMemberAuthorizedCaregiver(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useUpdateMemberAddress(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateMemberAddressParams) =>
      updateMemberAddress(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useUpdateMemberAuthorizedCaregiverAddress(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateMemberAuthorizedCaregiverAddressParams) =>
      updateMemberAuthorizedCaregiverAddress(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useDeleteAuthorizedCaregiver(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteAuthorizedCaregiverParams) =>
      deleteAuthorizedCaregiver(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useDeleteCaregiver(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteCaregiverParams) =>
      deleteCaregiver(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}

export function useDeleteMember(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteMemberParams) => deleteMember(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    }
  })
}
