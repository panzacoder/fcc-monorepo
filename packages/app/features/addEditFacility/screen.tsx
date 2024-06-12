'use client'
import _ from 'lodash'
import { useState } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Stack } from 'expo-router'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { LocationDetails } from 'app/ui/locationDetails'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
import {
  BASE_URL,
  CREATE_FACILITY,
  UPDATE_FACILITY
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { formatUrl } from 'app/utils/format-url'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import { useRouter } from 'expo-router'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
let selectedType = ''
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
    }
  }
}
const schema = z.object({
  website: z.string(),
  username: z.string(),
  description: z.string(),
  facilityName: z.string().min(1, { message: 'Facility name is required' }),
  fax: z.string()
})
const phoneSchema = z.object({
  locationPhone: z.string()
})
export type Schema = z.infer<typeof schema>
let isThisPharmacy = false
let isFacilityActive = true
let locationPhone = ''
export function AddEditFacilityScreen() {
  const router = useRouter()
  const staticData: any = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let facilityDetails = item.facilityDetails
    ? JSON.parse(item.facilityDetails)
    : {}
  // console.log('facilityDetails', JSON.stringify(facilityDetails))
  if (!_.isEmpty(facilityDetails)) {
    if (facilityDetails.type) {
      selectedType = facilityDetails.type
    }
    if (
      facilityDetails.status &&
      facilityDetails.status.status.toLowerCase() === 'inactive'
    ) {
      isFacilityActive = false
    }
  }
  const [isLoading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(isFacilityActive ? true : false)
  const [isPharmacy, setIsPharmacy] = useState(false)
  const typesList = staticData.facilityTypeList.map((data: any, index: any) => {
    return {
      label: data.type
    }
  })

  // console.log('facilityTypeIndex', '' + facilityTypeIndex)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      facilityName:
        facilityDetails && facilityDetails.name ? facilityDetails.name : '',
      website:
        facilityDetails && facilityDetails.website
          ? facilityDetails.website
          : '',
      description:
        facilityDetails && facilityDetails.description
          ? facilityDetails.description
          : '',
      username:
        facilityDetails && facilityDetails.websiteuser
          ? facilityDetails.websiteuser
          : '',
      fax: ''
    },
    resolver: zodResolver(schema)
  })
  const { control: control1, reset: reset1 } = useForm({
    defaultValues: {
      locationPhone: ''
    },
    resolver: zodResolver(phoneSchema)
  })
  async function updateFacility(formData: Schema) {
    if (selectedType === '') {
      Alert.alert('', 'Select Type')
      return
    }
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_FACILITY}`
    let dataObject = {
      header: header,
      facility: {
        id: facilityDetails.id ? facilityDetails.id : '',
        member: {
          id: memberData.member
        },
        name: formData.facilityName,
        ispharmacy: isThisPharmacy,
        description: formData.description,
        website: formData.website,
        websiteuser: formData.username,
        type: selectedType,
        status: {
          status: isFacilityActive === true ? 'Active' : 'Inactive',
          id: isFacilityActive === true ? 1 : 2
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let details = data.data.facility ? data.data.facility : {}
          router.dismiss(2)
          router.push(
            formatUrl('/circles/facilityDetails', {
              facilityDetails: JSON.stringify(details),
              memberData: JSON.stringify(memberData)
            })
          )
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function createFacility(formData: Schema) {
    if (selectedType === '') {
      Alert.alert('', 'Select Type')
      return
    }
    setLoading(true)
    let locationList: object[] = []
    selectedAddress.fax = formData.fax
    selectedAddress.website = formData.website
    selectedAddress.phone = removeAllSpecialCharFromString(locationPhone)
    locationList.push(selectedAddress)
    let url = `${BASE_URL}${CREATE_FACILITY}`
    let dataObject = {
      header: header,
      facility: {
        member: {
          id: memberData.member
        },
        name: formData.facilityName,
        ispharmacy: isThisPharmacy,
        description: formData.description,
        website: formData.website,
        websiteuser: formData.username,
        type: selectedType,
        facilityLocationList: locationList
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let details = data.data.facility ? data.data.facility : {}
          router.dismiss(1)
          router.push(
            formatUrl('/circles/facilityDetails', {
              facilityDetails: JSON.stringify(details),
              memberData: JSON.stringify(memberData)
            })
          )
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const onSelectionType = (data: any) => {
    selectedType = data
    // console.log('purpose1', purpose)
  }
  async function setAddressObject(value: any, index: any) {
    if (value) {
      if (index === 0) {
        selectedAddress.shortDescription = value
        selectedAddress.nickName = value
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
    }

    // console.log('selectedAddress', JSON.stringify(selectedAddress))
  }
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: _.isEmpty(facilityDetails)
            ? 'Add Facility'
            : 'Edit Facility Details'
        }}
      />
      <PtsLoader loading={isLoading} />
      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1  self-center rounded-[10px] border-[1px] p-5">
            <View className="flex-row">
              <View className="w-[45%] flex-row">
                <ToggleSwitch
                  isOn={isActive}
                  onColor="#2884F9"
                  offColor="#ffcccb"
                  size="medium"
                  onToggle={(isOn) => {
                    if (isOn) {
                      setIsActive(true)
                      isFacilityActive = true
                    } else {
                      setIsActive(false)
                      isFacilityActive = false
                    }
                  }}
                />
                <Typography className="font-400 ml-2 self-center">
                  {isActive ? 'Active' : 'InActive'}
                </Typography>
              </View>
            </View>
            <View className="w-full">
              <View className="w-full flex-row gap-2">
                <ControlledTextField
                  control={control}
                  name="facilityName"
                  placeholder="Facility Name*"
                  className="w-full"
                />
              </View>
              <View className="mt-2">
                <PtsComboBox
                  currentData={selectedType}
                  listData={typesList}
                  onSelection={onSelectionType}
                  placeholderValue={'Type*'}
                />
              </View>
              <View className="mt-2">
                <ControlledTextField
                  control={control}
                  name="description"
                  placeholder="Description"
                  className="w-full"
                />
              </View>
            </View>
            <View>
              <View className="mt-2 flex-row items-center">
                <Typography className="w-[30%]">{'Portal Details'}</Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="website"
                  placeholder={'Website'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="username"
                  placeholder={'Username'}
                  className="w-full"
                  autoCapitalize="none"
                />
              </View>
              <View className="mt-5 w-full flex-row">
                <Typography className=" w-[75%] font-bold">
                  {'Is this Pharmacy?'}
                </Typography>
                <ToggleSwitch
                  isOn={isPharmacy}
                  onColor="#2884F9"
                  offColor="#ffcccb"
                  size="medium"
                  onToggle={(isOn) => {
                    isThisPharmacy = !isThisPharmacy
                    setIsPharmacy(!isPharmacy)
                  }}
                />
                <Typography className="ml-[5px]">
                  {isPharmacy ? 'Yes' : 'No'}
                </Typography>
              </View>
            </View>
          </View>
          {_.isEmpty(facilityDetails) ? (
            <View className="border-primary mt-[10] w-[95%] flex-1  self-center rounded-[10px] border-[1px] p-5">
              <View className="">
                <View className="flex-row items-center">
                  <Typography className="w-[20%]">{'Location'}</Typography>
                  <View className="bg-primary ml-2 h-[1px] w-[75%]" />
                </View>
                <View className=" w-full">
                  <LocationDetails
                    component={'AddEditFacility'}
                    data={{}}
                    setAddressObject={setAddressObject}
                  />

                  <ControlledTextField
                    control={control1}
                    name="locationPhone"
                    placeholder={'Phone'}
                    className="mt-[-5] w-full"
                    keyboard="number-pad"
                    onChangeText={(value) => {
                      locationPhone =
                        convertPhoneNumberToUsaPhoneNumberFormat(value)
                      reset1({
                        locationPhone: locationPhone
                      })
                    }}
                  />
                  <ControlledTextField
                    control={control}
                    name="fax"
                    placeholder={'Fax'}
                    className="mt-2 w-full"
                    autoCapitalize="none"
                  />
                  <ControlledTextField
                    control={control}
                    name="website"
                    placeholder={'Website'}
                    className="mt-2 w-full"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          ) : (
            <View />
          )}
          <View className="my-2 flex-row self-center">
            <Button
              className="bg-[#86939e]"
              title={'Cancel'}
              leadingIcon="x"
              variant="default"
              onPress={() => {
                router.back()
              }}
            />
            <Button
              className="ml-2"
              leadingIcon="save"
              title={_.isEmpty(facilityDetails) ? 'Create' : 'Save'}
              variant="default"
              onPress={
                _.isEmpty(facilityDetails)
                  ? handleSubmit(createFacility)
                  : handleSubmit(updateFacility)
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
