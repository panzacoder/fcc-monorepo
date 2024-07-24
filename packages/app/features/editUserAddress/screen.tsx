'use client'

import { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import store from 'app/redux/store'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { formatUrl } from 'app/utils/format-url'
import _ from 'lodash'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  UPDATE_MEMBER_ADDRESS,
  UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS
} from 'app/utils/urlConstants'
import { LocationDetails } from 'app/ui/locationDetails'
import { useLocalSearchParams } from 'expo-router'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { useRouter } from 'expo-router'
let selectedAddress: any = {
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
}
export function EditUserAddressScreen() {
  const [isLoading, setLoading] = useState(false)
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
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
  console.log('memberData', JSON.stringify(memberData))
  async function setAddressObject(value: any, index: any) {
    if (value) {
      if (index === 0) {
        selectedAddress.nickName = value
      }
      if (index === 7) {
        selectedAddress.shortDescription = value
      }
      if (index === 1) {
        selectedAddress.address.line = value
      }
      if (index === 2) {
        selectedAddress.address.city = value
      }
      if (index === 3) {
        selectedAddress.address.zipCode = value
      }
      if (index === 4) {
        selectedAddress.address.state.country.id = value.id
        selectedAddress.address.state.country.name = value.name
        selectedAddress.address.state.country.code = value.code
        selectedAddress.address.state.country.namecode = value.namecode
        selectedAddress.address.state.country.snum = value.snum
        selectedAddress.address.state.country.description = value.description
      }
      if (index === 5) {
        selectedAddress.address.state.id = value.id
        selectedAddress.address.state.name = value.name
        selectedAddress.address.state.code = value.code
        selectedAddress.address.state.namecode = value.namecode
        selectedAddress.address.state.snum = value.snum
        selectedAddress.address.state.description = value.description
      }
      if (index === 6) {
        selectedAddress = value
      }
      if (index === 7) {
        selectedAddress.address.timezone.id = value.id
      }
    }

    // console.log('selectedAddress', JSON.stringify(selectedAddress))
  }
  async function updateAddress() {
    setLoading(true)
    let url = ''
    url =
      item.component === 'Profile'
        ? `${BASE_URL}${UPDATE_MEMBER_ADDRESS}`
        : `${BASE_URL}${UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS}`
    let dataObject = {
      header: header,
      memberVo: {
        id: memberDetails.id ? memberDetails.id : '',
        isMemberUpdate: true,
        address: selectedAddress.address
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
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
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
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
