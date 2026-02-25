'use client'
import { isEmpty } from 'app/ui/utils'
import { useState, useRef } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { LocationDetails } from 'app/ui/locationDetails'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
import { useCreateFacility, useUpdateFacility } from 'app/data/facilities'
import type { FacilityLocationData } from 'app/data/facilities/types'
import type { FacilityType } from 'app/data/types'
import type { StaticData } from 'app/data/static'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { formatUrl } from 'app/utils/format-url'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import ToggleSwitch from 'toggle-switch-react-native'
import { useAppSelector } from 'app/redux/hooks'
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
type MemberRouteParams = {
  member?: number | string
  firstname?: string
  lastname?: string
}

export function AddEditFacilityScreen() {
  const selectedTypeRef = useRef('')
  const selectedAddressRef = useRef<FacilityLocationData>({
    shortDescription: '',
    nickName: '',
    address: {
      line: '',
      city: '',
      zipCode: '',
      state: {
        country: {}
      }
    }
  })
  const isThisPharmacyRef = useRef(false)
  const isFacilityActiveRef = useRef(true)
  const locationPhoneRef = useRef('')
  const router = useRouter()
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData
  const header = useAppSelector((state) => state.headerState.header)
  const createFacilityMutation = useCreateFacility(header)
  const updateFacilityMutation = useUpdateFacility(header)
  const isLoading =
    createFacilityMutation.isPending || updateFacilityMutation.isPending
  const item = useLocalSearchParams<Record<string, string>>()
  let memberData = item.memberData
    ? (JSON.parse(item.memberData) as MemberRouteParams)
    : ({} as MemberRouteParams)
  let facilityDetails = item.facilityDetails
    ? JSON.parse(item.facilityDetails)
    : {}
  if (!isEmpty(facilityDetails)) {
    if (facilityDetails.type) {
      selectedTypeRef.current = facilityDetails.type
    }
    if (
      facilityDetails.status &&
      facilityDetails.status.status.toLowerCase() === 'inactive'
    ) {
      isFacilityActiveRef.current = false
    }
  }
  const [isActive, setIsActive] = useState(
    isFacilityActiveRef.current ? true : false
  )
  const [isPharmacy, setIsPharmacy] = useState(false)
  const typesList = staticData.facilityTypeList.map(
    (data: FacilityType, index: number) => {
      return {
        label: data.type
      }
    }
  )

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
    if (selectedTypeRef.current === '') {
      Alert.alert('', 'Select Type')
      return
    }
    const data = await updateFacilityMutation.mutateAsync({
      facility: {
        id: facilityDetails.id ? facilityDetails.id : '',
        member: {
          id: memberData.member ?? ''
        },
        name: formData.facilityName,
        ispharmacy: isThisPharmacyRef.current,
        description: formData.description,
        website: formData.website,
        websiteuser: formData.username,
        type: selectedTypeRef.current,
        status: {
          status: isFacilityActiveRef.current === true ? 'Active' : 'Inactive',
          id: isFacilityActiveRef.current === true ? 1 : 2
        }
      }
    })
    if (data) {
      let details = data.facilityWithAppointment?.facility ?? {}
      router.dismiss(2)
      router.push(
        formatUrl('/circles/facilityDetails', {
          facilityDetails: JSON.stringify(details),
          memberData: JSON.stringify(memberData)
        })
      )
    }
  }
  async function createFacility(formData: Schema) {
    if (selectedTypeRef.current === '') {
      Alert.alert('', 'Select Type')
      return
    }
    let locationList: FacilityLocationData[] = []
    selectedAddressRef.current.fax = formData.fax
    selectedAddressRef.current.website = formData.website
    selectedAddressRef.current.phone = removeAllSpecialCharFromString(
      locationPhoneRef.current
    )
    selectedAddressRef.current.address.id = undefined
    locationList.push(selectedAddressRef.current)
    const data = await createFacilityMutation.mutateAsync({
      facility: {
        member: {
          id: memberData.member ?? ''
        },
        name: formData.facilityName,
        ispharmacy: isThisPharmacyRef.current,
        description: formData.description,
        website: formData.website,
        websiteuser: formData.username,
        type: selectedTypeRef.current,
        facilityLocationList: locationList
      }
    })
    if (data) {
      let details = data.facilityWithAppointment?.facility ?? {}
      if (item.component === 'addEditAppointment') {
        router.dismiss(2)
        router.push(
          formatUrl('/circles/addEditAppointment', {
            memberData: JSON.stringify(memberData),
            doctorFacilityDetails: JSON.stringify(details),
            component: 'Facility'
          })
        )
      } else {
        router.dismiss(1)
        router.push(
          formatUrl('/circles/facilityDetails', {
            facilityDetails: JSON.stringify(details),
            memberData: JSON.stringify(memberData)
          })
        )
      }
    }
  }
  const onSelectionType = (data: string) => {
    selectedTypeRef.current = data
  }
  async function setAddressObject(value: unknown, index: number) {
    if (value) {
      const str = value as string
      const obj = value as Record<string, string | number>
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
        const state = (selectedAddressRef.current.address.state ??= {})
        const country = (state.country ??= {})
        country.id = obj.id as number
        country.name = obj.name as string
        country.code = obj.code as string
        country.namecode = obj.namecode as string
        country.isoCode = obj.isoCode as string
      }
      if (index === 5) {
        const state = (selectedAddressRef.current.address.state ??= {})
        state.id = obj.id as number
        state.name = obj.name as string
        state.code = obj.code as string
        state.namecode = obj.namecode as string
        state.snum = obj.snum as string
      }
      if (index === 6) {
        selectedAddressRef.current = value as FacilityLocationData
      }
    }
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          isEmpty(facilityDetails) ? 'Add Facility' : 'Edit Facility Details'
        }
        memberData={{}}
      />
      <View className=" h-full w-full flex-1 py-2 ">
        <SafeAreaView>
          <ScrollView persistentScrollbar={true} className="flex-1">
            <View className="border-primary mt-[5] w-[95%] flex-1  self-center rounded-[10px] border-[1px] p-5">
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
                        isFacilityActiveRef.current = true
                      } else {
                        setIsActive(false)
                        isFacilityActiveRef.current = false
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
                    currentData={selectedTypeRef.current}
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
                  <Typography className="w-[30%]">
                    {'Portal Details'}
                  </Typography>
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
                      isThisPharmacyRef.current = !isThisPharmacyRef.current
                      setIsPharmacy(!isPharmacy)
                    }}
                  />
                  <Typography className="ml-[5px]">
                    {isPharmacy ? 'Yes' : 'No'}
                  </Typography>
                </View>
              </View>
            </View>
            {isEmpty(facilityDetails) ? (
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
                        locationPhoneRef.current =
                          convertPhoneNumberToUsaPhoneNumberFormat(
                            value ?? ''
                          ) ?? ''
                        reset1({
                          locationPhone: locationPhoneRef.current
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
                title={isEmpty(facilityDetails) ? 'Create' : 'Save'}
                variant="default"
                onPress={
                  isEmpty(facilityDetails)
                    ? handleSubmit(createFacility)
                    : handleSubmit(updateFacility)
                }
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  )
}
