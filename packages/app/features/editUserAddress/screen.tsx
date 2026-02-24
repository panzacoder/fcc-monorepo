'use client'

import { useRef } from 'react'
import { View, Alert } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { formatUrl } from 'app/utils/format-url'
import _ from 'lodash'
import { Button } from 'app/ui/button'
import {
  useUpdateMemberAddress,
  useUpdateMemberAuthorizedCaregiverAddress
} from 'app/data/profile'
import { LocationDetails } from 'app/ui/locationDetails'
import { useLocalSearchParams } from 'expo-router'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'

type AddressFormData = {
  shortDescription: string
  nickName: string
  address: {
    id: string
    line: string
    city: string
    zipCode: string
    state: {
      name: string
      code: string
      namecode: string
      description: string
      snum: string
      id: string
      country: {
        name: string
        code: string
        namecode: string
        isoCode: string
        description: string
        id: string
      }
    }
    timezone: {
      id: string
    }
  }
}

export function EditUserAddressScreen() {
  const selectedAddressRef = useRef<AddressFormData>({
    shortDescription: '',
    nickName: '',
    address: {
      id: '',
      line: '',
      city: '',
      zipCode: '',
      state: {
        name: '',
        code: '',
        namecode: '',
        description: '',
        snum: '',
        id: '',
        country: {
          name: '',
          code: '',
          namecode: '',
          isoCode: '',
          description: '',
          id: ''
        }
      },
      timezone: {
        id: ''
      }
    }
  })
  const header = useAppSelector((state) => state.headerState.header)
  const updateMemberAddressMutation = useUpdateMemberAddress(header)
  const updateCaregiverAddressMutation =
    useUpdateMemberAuthorizedCaregiverAddress(header)
  const item = useLocalSearchParams<{
    component?: string
    userDetails?: string
    memberDetails?: string
    memberData?: string
  }>()
  const router = useRouter()
  let userDetails = item.userDetails ? JSON.parse(item.userDetails) : {}
  let memberDetails = item.memberDetails ? JSON.parse(item.memberDetails) : {}
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  if (_.isEmpty(memberData)) {
    let object = {
      member: memberDetails.memberId ? memberDetails.memberId : '',
      component: item.component ? item.component : ''
    }
    memberData = object
  }
  logger.debug('memberData', JSON.stringify(memberData))
  async function setAddressObject(value: unknown, index: number) {
    if (value) {
      const str = value as string
      const obj = value as Record<string, string>
      if (index === 0) {
        selectedAddressRef.current.nickName = str
      }
      if (index === 7) {
        selectedAddressRef.current.shortDescription = str
      }
      if (index === 1) {
        selectedAddressRef.current.address.line = str
      }
      if (index === 2) {
        selectedAddressRef.current.address.city = str
      }
      if (index === 3) {
        selectedAddressRef.current.address.zipCode = str
      }
      if (index === 4) {
        selectedAddressRef.current.address.state.country.id = obj.id
        selectedAddressRef.current.address.state.country.name = obj.name
        selectedAddressRef.current.address.state.country.code = obj.code
        selectedAddressRef.current.address.state.country.namecode = obj.namecode
        selectedAddressRef.current.address.state.country.snum = obj.snum
        selectedAddressRef.current.address.state.country.description =
          obj.description
      }
      if (index === 5) {
        selectedAddressRef.current.address.state.id = obj.id
        selectedAddressRef.current.address.state.name = obj.name
        selectedAddressRef.current.address.state.code = obj.code
        selectedAddressRef.current.address.state.namecode = obj.namecode
        selectedAddressRef.current.address.state.snum = obj.snum
        selectedAddressRef.current.address.state.description = obj.description
      }
      if (index === 6) {
        selectedAddressRef.current = value as AddressFormData
      }
      if (index === 7) {
        selectedAddressRef.current.address.timezone.id = obj.id
      }
    }
  }
  const isLoading =
    updateMemberAddressMutation.isPending ||
    updateCaregiverAddressMutation.isPending
  const navigateBack = () => {
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
  }
  async function updateAddress() {
    const mutation =
      item.component === 'Profile'
        ? updateMemberAddressMutation
        : updateCaregiverAddressMutation
    mutation.mutate(
      {
        memberVo: {
          id: memberDetails.id ? memberDetails.id : '',
          isMemberUpdate: true,
          address: selectedAddressRef.current.address
        }
      },
      {
        onSuccess: () => {
          navigateBack()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to update address')
        }
      }
    )
  }
  return (
    <View className="flex-1">
      <PtsBackHeader title="Edit Location Details " memberData={memberData} />
      <PtsLoader loading={isLoading} />
      <SafeAreaView>
        <ScrollView className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
          <LocationDetails
            component={'Profile'}
            data={
              memberDetails.address
                ? {
                    address: memberDetails.address
                  }
                : {}
            }
            setAddressObject={setAddressObject}
          />
          <View className="my-2 mb-10 flex-row self-center ">
            <Button
              className="bg-[#86939e]"
              title={'Cancel'}
              variant="default"
              leadingIcon="x"
              onPress={navigateBack}
            />
            <Button
              className="ml-5 bg-[#287CFA]"
              title={'Save'}
              variant="default"
              leadingIcon="save"
              onPress={() => {
                updateAddress()
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
