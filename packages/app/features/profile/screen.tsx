'use client'
import { useState } from 'react'
import { View, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { useAppSelector } from 'app/redux/hooks'
import { useProfileData } from './hooks/useProfileData'
import { ProfileInfoSection } from './components/ProfileInfoSection'
import { SubscriptionSection } from './components/SubscriptionSection'
import { SponsorshipSection } from './components/SponsorshipSection'
import { DeleteAccountModal } from './components/DeleteAccountModal'
import type {
  ProfileAppUser,
  ProfileMember,
  ProfileUserSubscription,
  UserProfileResponse
} from 'app/data/profile'

export function ProfileScreen() {
  const header = useAppSelector((state) => state.headerState.header)
  const userProfile = useAppSelector((state) => state.userProfileState.header)
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

  const {
    profileData,
    isLoading,
    autoSubscription,
    manualSubscription,
    cancelSubscription,
    deleteAccountMutation,
    checkValidCredential,
    updateSponsorCode
  } = useProfileData(header)

  const data = profileData as UserProfileResponse | undefined
  const appuserDetails: Partial<ProfileAppUser> = data?.appuser ?? {}
  const memberDetails: Partial<ProfileMember> = data?.member ?? {}
  const orderList = data?.orderList ?? []
  const userSubscription: Partial<ProfileUserSubscription> =
    data?.userSubscription ?? {}
  const isSubscribedUser =
    data?.userSubscription?.status?.toLowerCase() === 'active'

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="mt-[25px]">
        <PtsBackHeader title="Profile" memberData={{}} />
      </View>
      {data ? (
        <ScrollView persistentScrollbar={true} className="flex-1">
          <ProfileInfoSection
            appuserDetails={appuserDetails}
            memberDetails={memberDetails}
            onDeleteAccount={() => setIsShowDeleteModal(true)}
          />

          <SubscriptionSection
            profileData={data}
            appuserDetails={appuserDetails}
            userSubscription={userSubscription}
            orderList={orderList}
            isSubscribedUser={isSubscribedUser}
            userProfile={userProfile}
            autoSubscription={autoSubscription}
            manualSubscription={manualSubscription}
            cancelSubscription={cancelSubscription}
          />

          <SponsorshipSection
            memberDetails={memberDetails}
            updateSponsorCode={updateSponsorCode}
          />

          <DeleteAccountModal
            isOpen={isShowDeleteModal}
            onClose={() => setIsShowDeleteModal(false)}
            appuserDetails={appuserDetails}
            checkValidCredential={checkValidCredential}
            deleteAccountMutation={deleteAccountMutation}
          />
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  )
}
