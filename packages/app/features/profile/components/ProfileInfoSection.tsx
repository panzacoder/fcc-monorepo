'use client'
import { View, TouchableOpacity, Linking, Alert } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  getAddressFromObject
} from 'app/ui/utils'
import type { ProfileAppUser, ProfileMember } from 'app/data/profile'

const titleStyle = 'ml-2 font-400 w-[25%] text-[15px] text-[#1A1A1A]'
const valueStyle = 'font-400 ml-2 w-[70%] text-[15px] font-bold text-[#1A1A1A]'

function DetailRow({ title, value }: { title: string; value: string }) {
  return (
    <View className="mt-2 w-full flex-row items-center">
      <View className="w-full flex-row">
        <Typography className={titleStyle}>{title}</Typography>
        <Typography className={valueStyle}>{value}</Typography>
      </View>
    </View>
  )
}

interface ProfileInfoSectionProps {
  appuserDetails: Partial<ProfileAppUser>
  memberDetails: Partial<ProfileMember>
  onDeleteAccount: () => void
}

export function ProfileInfoSection({
  appuserDetails,
  memberDetails,
  onDeleteAccount
}: ProfileInfoSectionProps) {
  const router = useRouter()

  return (
    <>
      <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
        <View className="flex-row">
          <Typography className="ml-2 w-[85%] self-center font-bold">
            {'User Profile'}
          </Typography>
          <TouchableOpacity
            onPress={() => {
              router.push(
                formatUrl('/circles/editUserProfile', {
                  component: 'Profile',
                  userDetails: JSON.stringify(appuserDetails),
                  memberDetails: JSON.stringify(memberDetails)
                })
              )
            }}
            className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]"
          >
            <Feather className="" name={'edit-2'} size={15} color={'white'} />
          </TouchableOpacity>
        </View>
        <DetailRow
          title="Name"
          value={`${appuserDetails.firstName ? appuserDetails.firstName : ''} ${appuserDetails.lastName ? appuserDetails.lastName : ''}`}
        />
        <DetailRow
          title="Email"
          value={appuserDetails.email ? appuserDetails.email : ''}
        />
        <View className="mt-2 w-full flex-row items-center">
          <View className="w-full flex-row">
            <Typography className={titleStyle}>{'Phone'}</Typography>
            <Typography
              onPress={() => {
                Linking.openURL(`tel:${appuserDetails.phone}`)
              }}
              className="font-400 text-primary ml-2 w-[70%] text-[15px] font-bold"
            >
              {convertPhoneNumberToUsaPhoneNumberFormat(appuserDetails.phone)}
            </Typography>
          </View>
        </View>
        <Button
          className="my-2 w-[50%] self-center bg-[#c43416]"
          title={'Delete Account'}
          variant="default"
          onPress={() => {
            Alert.alert(
              `Dear ${appuserDetails.firstName} ${appuserDetails.lastName}`,
              `You are about to delete your account permanently. If you are ready to delete, enter your password and click CONFIRM. Once you confirm your account for deletion, you will not be able to retrieve any information you have added here. You will be deleted from other Family Care Circles.`,
              [
                {
                  text: 'Confirm',
                  onPress: onDeleteAccount
                },
                { text: 'Cancel' }
              ]
            )
          }}
        />
      </View>

      <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
        <View className="flex-row">
          <Typography className="ml-2 w-[85%] self-center font-bold">
            {'Address'}
          </Typography>
          <TouchableOpacity
            onPress={() => {
              router.push(
                formatUrl('/circles/editUserAddress', {
                  component: 'Profile',
                  memberDetails: JSON.stringify(memberDetails)
                })
              )
            }}
            className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]"
          >
            <Feather className="" name={'edit-2'} size={15} color={'white'} />
          </TouchableOpacity>
        </View>
        <DetailRow
          title="Address"
          value={getAddressFromObject(
            memberDetails.address ? memberDetails.address : {}
          )}
        />
        <DetailRow
          title="Timezone"
          value={
            memberDetails.address && memberDetails.address.timezone
              ? `${memberDetails.address.timezone.name} (${memberDetails.address.timezone.abbreviation})`
              : ''
          }
        />
      </View>
    </>
  )
}
