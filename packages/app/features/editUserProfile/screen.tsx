'use client'

import { View } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import _ from 'lodash'
import { formatUrl } from 'app/utils/format-url'
import { Button } from 'app/ui/button'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import {
  useUpdateProfile,
  useUpdateMemberAuthorizedCaregiver
} from 'app/data/profile'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
const phoneSchema = z.object({
  phone: z.string()
})
const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' })
})
export type ProfileSchema = z.infer<typeof profileSchema>
export function EditUserProfileScreen() {
  const dispatch = useAppDispatch()
  let userPhone = ''
  const user = useAppSelector((state) => state.userProfileState.header)
  const header = useAppSelector((state) => state.headerState.header)
  const updateProfileMutation = useUpdateProfile(header)
  const updateCaregiverMutation = useUpdateMemberAuthorizedCaregiver(header)
  const isLoading =
    updateProfileMutation.isPending || updateCaregiverMutation.isPending
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let userDetails = item.userDetails ? JSON.parse(item.userDetails) : {}
  let memberDetails = item.memberDetails ? JSON.parse(item.memberDetails) : {}
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  // console.log('memberData', JSON.stringify(item.memberData))
  if (!_.isEmpty(userDetails)) {
    userPhone = userDetails.phone ? userDetails.phone : ''
  }
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName:
        !_.isEmpty(userDetails) && userDetails.firstName
          ? userDetails.firstName
          : '',
      lastName:
        !_.isEmpty(userDetails) && userDetails.lastName
          ? userDetails.lastName
          : '',
      email:
        !_.isEmpty(userDetails) && userDetails.email ? userDetails.email : ''
    },
    resolver: zodResolver(profileSchema)
  })

  const { control: control3, reset: reset2 } = useForm({
    defaultValues: {
      phone:
        !_.isEmpty(userDetails) && userDetails.phone
          ? convertPhoneNumberToUsaPhoneNumberFormat(userDetails.phone)
          : ''
    },
    resolver: zodResolver(phoneSchema)
  })
  async function updateProfile(formData: ProfileSchema) {
    const memberVo = {
      id: memberDetails.id ? memberDetails.id : '',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: removeAllSpecialCharFromString(userPhone),
      isMemberUpdate: true
    }
    const mutation =
      item.component === 'Profile'
        ? updateProfileMutation
        : updateCaregiverMutation
    mutation.mutate(
      { memberVo },
      {
        onSuccess: (data: any) => {
          logger.debug('datatat ', JSON.stringify(data))
          let fullName = data.firstName ? data.firstName : ''
          fullName += data.lastName ? ' ' + data.lastName : ''
          user.memberName = fullName
          dispatch(userProfileAction.setUserProfile(user))
          router.dismiss(2)
          if (item.component === 'Profile') {
            router.push('/profile')
          } else {
            router.push(
              formatUrl('/memberProfile', {
                memberData: JSON.stringify(memberData),
                userDetails: JSON.stringify(userDetails)
              })
            )
          }
        },
        onError: (error) => {
          logger.debug('error', error)
        }
      }
    )
  }
  return (
    <View className="flex-1">
      <PtsBackHeader title="Edit Profile" memberData={{}} />

      <PtsLoader loading={isLoading} />
      <SafeAreaView>
        <ScrollView className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
          <ControlledTextField
            control={control}
            name="firstName"
            placeholder={'First Name'}
            className="w-[95%] self-center"
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="lastName"
            placeholder="Last Name*"
            className="w-[95%] self-center"
          />
          <ControlledTextField
            control={control3}
            name="phone"
            placeholder={'Phone'}
            className="w-[95%] self-center"
            keyboard="number-pad"
            onChangeText={(value) => {
              userPhone = convertPhoneNumberToUsaPhoneNumberFormat(value)
              reset2({
                phone: userPhone
              })
            }}
          />
          <ControlledTextField
            name="email"
            className="w-[95%] self-center"
            control={control}
            placeholder={'Email*'}
            autoCapitalize="none"
          />
          <View className="my-5 flex-row self-center pb-5 ">
            <Button
              className="bg-[#86939e]"
              title={'Cancel'}
              variant="default"
              leadingIcon="x"
              onPress={() => {
                router.dismiss(2)
                if (item.component === 'Profile') {
                  router.push('/profile')
                } else {
                  router.push(
                    formatUrl('/memberProfile', {
                      memberData: JSON.stringify(memberData),
                      userDetails: JSON.stringify(userDetails)
                    })
                  )
                }
              }}
            />
            <Button
              className="ml-5 bg-[#287CFA]"
              title={'Save'}
              variant="default"
              leadingIcon="save"
              onPress={handleSubmit(updateProfile)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
