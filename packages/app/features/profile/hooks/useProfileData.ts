import {
  useUserProfile,
  useAutoSubscription,
  useManualSubscription,
  useCancelSubscription,
  useDeleteAccount,
  useCheckValidCredential,
  useUpdateSponsorCode
} from 'app/data/profile'
import type { AuthHeader } from 'app/data/base'

export function useProfileData(header: AuthHeader) {
  const { data: profileData, isLoading: isQueryLoading } =
    useUserProfile(header)

  const autoSubscription = useAutoSubscription(header)
  const manualSubscription = useManualSubscription(header)
  const cancelSubscription = useCancelSubscription(header)
  const deleteAccountMutation = useDeleteAccount(header)
  const checkValidCredential = useCheckValidCredential(header)
  const updateSponsorCode = useUpdateSponsorCode(header)

  const isLoading =
    isQueryLoading ||
    autoSubscription.isPending ||
    manualSubscription.isPending ||
    cancelSubscription.isPending ||
    deleteAccountMutation.isPending ||
    checkValidCredential.isPending ||
    updateSponsorCode.isPending

  return {
    profileData,
    isLoading,
    autoSubscription,
    manualSubscription,
    cancelSubscription,
    deleteAccountMutation,
    checkValidCredential,
    updateSponsorCode
  }
}

export type ProfileDataReturn = ReturnType<typeof useProfileData>
