'use client'
import _ from 'lodash'
import { useState, useEffect, useRef } from 'react'
import { View, Alert, BackHandler } from 'react-native'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'
import {
  useStatesAndTimezones,
  useCreateDoctorLocation,
  useCreateFacilityLocation,
  useUpdateDoctorLocation,
  useUpdateFacilityLocation
} from 'app/data/locations'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useRouter } from 'expo-router'
import ct from 'countries-and-timezones'
import moment from 'moment-timezone'
import { consoleData } from 'app/ui/utils'
import { logger } from 'app/utils/logger'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
import { useAppSelector } from 'app/redux/hooks'
const schema = z.object({
  locationName: z.string().min(1, { message: 'Location name is required' }),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  fax: z.string(),
  website: z.string(),
  state: z.number().min(0, { message: 'State is required' }),
  country: z.number().min(0, { message: 'Country is required' })
})
const phoneSchema = z.object({
  phone: z.string()
})
export type Schema = z.infer<typeof schema>
// let statesList = []
export function AddEditLocationScreen() {
  const stateIndexRef = useRef(-1)
  const countryIndexRef = useRef(-1)
  let locationPhone = ''
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  const header = useAppSelector((state) => state.headerState.header)
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let locationDetails = item.locationDetails
    ? JSON.parse(item.locationDetails)
    : {}

  logger.debug('locationDetails', JSON.stringify(locationDetails))
  let details = item.details ? JSON.parse(item.details) : {}
  logger.debug('details', JSON.stringify(details))
  const [selectedCountryId, setSelectedCountryId] = useState<number>(0)
  const [statesList, setStatesList] = useState([]) as any
  const [statesListFull, setStatesListFull] = useState([])
  type Response = {
    id: number
    name: string
  }
  const countryList: Array<{ id: number; title: string }> =
    staticData.countryList.map(({ name, id }: Response, index: any) => {
      return {
        title: name,
        id: index + 1
      }
    })

  const statesQuery = useStatesAndTimezones(header, {
    countryId: selectedCountryId
  })
  const createDoctorLocationMutation = useCreateDoctorLocation(header)
  const createFacilityLocationMutation = useCreateFacilityLocation(header)
  const updateDoctorLocationMutation = useUpdateDoctorLocation(header)
  const updateFacilityLocationMutation = useUpdateFacilityLocation(header)

  useEffect(() => {
    if (statesQuery.data) {
      let mappedStates: Array<{ id: number; title: string }> =
        statesQuery.data.stateList.map(({ name, id }: Response, index: any) => {
          return {
            title: name,
            id: index + 1
          }
        })
      setStatesList(mappedStates)
      setStatesListFull(statesQuery.data.stateList || [])
      if (!_.isEmpty(locationDetails)) {
        let stateName = locationDetails.address.state.name
          ? locationDetails.address.state.name
          : ''
        statesQuery.data.stateList.map((data: any, index: any) => {
          if (data.name === stateName) {
            stateIndexRef.current = index + 1
            reset({
              state: stateIndexRef.current
            })
          }
        })
      }
    }
  }, [statesQuery.data])

  function handleBackButtonClick() {
    router.dismiss(1)
    if (item.component === 'Doctor') {
      router.push(
        formatUrl('/circles/doctorDetails', {
          doctorDetails: JSON.stringify(details),
          memberData: JSON.stringify(memberData)
        })
      )
    } else {
      router.push(
        formatUrl('/circles/facilityDetails', {
          facilityDetails: JSON.stringify(details),
          memberData: JSON.stringify(memberData)
        })
      )
    }
    return true
  }
  useEffect(() => {
    let countryName = ''
    if (!_.isEmpty(locationDetails)) {
      countryName = locationDetails.address.state.country.name
        ? locationDetails.address.state.country.name
        : ''
    } else {
      let newTimeZone = moment.tz.guess()
      const countryObject = ct.getCountriesForTimezone(newTimeZone)
      countryName = countryObject[0]?.name ? countryObject[0].name : ''
    }
    consoleData('countryName', countryName)
    staticData.countryList.map(async (data: any, index: any) => {
      if (data.name === countryName) {
        countryIndexRef.current = index + 1
        consoleData('countryName index', '' + countryIndexRef.current)
        reset({
          country: countryIndexRef.current
        })
      }
    })
    let countryId = staticData.countryList[countryIndexRef.current - 1]?.id
      ? staticData.countryList[countryIndexRef.current - 1].id
      : 101
    setSelectedCountryId(countryId)
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      locationName: !_.isEmpty(locationDetails) ? locationDetails.nickName : '',
      address: !_.isEmpty(locationDetails) ? locationDetails.address.line : '',
      city: !_.isEmpty(locationDetails) ? locationDetails.address.city : '',
      postalCode: !_.isEmpty(locationDetails)
        ? locationDetails.address.zipCode
        : '',

      fax:
        !_.isEmpty(locationDetails) && locationDetails.fax
          ? locationDetails.fax
          : '',
      website:
        !_.isEmpty(locationDetails) && locationDetails.website
          ? locationDetails.website
          : '',
      country: !_.isEmpty(locationDetails) ? countryIndexRef.current : 97,
      state: !_.isEmpty(locationDetails) ? stateIndexRef.current : -1
    },
    resolver: zodResolver(schema)
  })
  const { control: control1, reset: reset1 } = useForm({
    defaultValues: {
      phone:
        !_.isEmpty(locationDetails) && locationDetails.phone
          ? locationDetails.phone
          : ''
    },
    resolver: zodResolver(phoneSchema)
  })
  function setSelectedCountryChange(value: any) {
    if (value) {
      let countryId = staticData.countryList[value.id - 1]?.id
        ? staticData.countryList[value.id - 1].id
        : 101
      setSelectedCountryId(countryId)
    }
  }

  const isLoading =
    statesQuery.isLoading ||
    createDoctorLocationMutation.isPending ||
    createFacilityLocationMutation.isPending ||
    updateDoctorLocationMutation.isPending ||
    updateFacilityLocationMutation.isPending

  async function addUpdateLocation(formData: Schema) {
    let stateObject = statesListFull[formData.state - 1]
    let countryObject: object = staticData.countryList[formData.country - 1]
    let addressObject = {
      operation: 'add',
      shortDescription: formData.locationName,
      nickName: formData.locationName,
      fax: formData.fax,
      website: formData.website,
      phone: removeAllSpecialCharFromString(locationPhone),
      address: {
        id: '',
        line: formData.address,
        city: formData.city,
        zipCode: formData.postalCode,
        state: stateObject
      }
    }

    const onDoctorSuccess = (data: any) => {
      let details: any = data?.doctor ? JSON.stringify(data.doctor) : {}
      router.dismiss(1)
      router.replace(
        formatUrl('/circles/doctorDetails', {
          doctorDetails: details,
          memberData: JSON.stringify(memberData)
        })
      )
    }

    const onFacilitySuccess = (data: any) => {
      let details: any = data?.facility ? JSON.stringify(data.facility) : {}
      router.dismiss(1)
      router.replace(
        formatUrl('/circles/facilityDetails', {
          facilityDetails: details,
          memberData: JSON.stringify(memberData)
        })
      )
    }

    const onError = (error: any) => {
      Alert.alert('', error.message || 'Failed to save location')
    }

    if (item.component === 'Doctor') {
      let doctorLocation: any = { ...addressObject }
      if (_.isEmpty(locationDetails)) {
        doctorLocation.doctor = {
          id: details.id ? details.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      } else {
        doctorLocation.doctor = {
          id: locationDetails.doctorFacilityId
            ? locationDetails.doctorFacilityId
            : ''
        }
      }
      doctorLocation.address.state.country = countryObject
      if (!_.isEmpty(locationDetails)) {
        doctorLocation.id = locationDetails.id
      }

      if (_.isEmpty(locationDetails)) {
        createDoctorLocationMutation.mutate(
          { doctorLocation },
          { onSuccess: onDoctorSuccess, onError }
        )
      } else {
        updateDoctorLocationMutation.mutate(
          { doctorLocation },
          { onSuccess: onDoctorSuccess, onError }
        )
      }
    } else {
      let facilityLocation: any = { ...addressObject }
      if (_.isEmpty(locationDetails)) {
        facilityLocation.facility = {
          id: details.id ? details.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      } else {
        facilityLocation.facility = {
          id: locationDetails.doctorFacilityId
            ? locationDetails.doctorFacilityId
            : ''
        }
      }
      facilityLocation.address.state.country = countryObject
      if (!_.isEmpty(locationDetails)) {
        facilityLocation.id = locationDetails.id
      }

      if (_.isEmpty(locationDetails)) {
        createFacilityLocationMutation.mutate(
          { facilityLocation },
          { onSuccess: onFacilitySuccess, onError }
        )
      } else {
        updateFacilityLocationMutation.mutate(
          { facilityLocation },
          { onSuccess: onFacilitySuccess, onError }
        )
      }
    }
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          _.isEmpty(locationDetails) ? 'Add Location' : 'Edit Location Details'
        }
        memberData={memberData}
      />
      <View className="h-full w-full flex-1 py-2 ">
        <SafeAreaView>
          <ScrollView persistentScrollbar={true} className="flex-1">
            <View className="border-primary w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View className="my-2 w-full">
                <View className="flex w-full gap-2">
                  <ControlledTextField
                    control={control}
                    name="locationName"
                    placeholder="Location Name"
                    className="w-full"
                  />
                  <ControlledTextField
                    control={control}
                    name="address"
                    placeholder="Address"
                    className="w-full"
                  />
                  <ControlledDropdown
                    control={control}
                    name="country"
                    label="Country"
                    maxHeight={300}
                    defaultValue={
                      countryIndexRef.current !== -1 &&
                      countryList[countryIndexRef.current - 1]
                        ? countryList[countryIndexRef.current - 1]?.title
                        : ''
                    }
                    list={countryList}
                    onChangeValue={setSelectedCountryChange}
                  />
                  <ControlledDropdown
                    control={control}
                    name="state"
                    label="State*"
                    defaultValue={
                      stateIndexRef.current !== -1 &&
                      statesList[stateIndexRef.current - 1]
                        ? statesList[stateIndexRef.current - 1].title
                        : ''
                    }
                    maxHeight={300}
                    list={statesList}
                  />
                  <View className="w-full flex-row gap-2">
                    <ControlledTextField
                      control={control}
                      name="city"
                      placeholder={'City'}
                      className="w-[50%]"
                      autoCapitalize="none"
                    />
                    <ControlledTextField
                      control={control}
                      name="postalCode"
                      placeholder="Postal Code"
                      className="w-[48%]"
                    />
                  </View>
                  <ControlledTextField
                    control={control1}
                    name="phone"
                    placeholder={'Phone'}
                    className="w-full"
                    keyboard="number-pad"
                    onChangeText={(value) => {
                      locationPhone =
                        convertPhoneNumberToUsaPhoneNumberFormat(value)

                      reset1({
                        phone: locationPhone
                      })
                    }}
                  />
                  <ControlledTextField
                    control={control}
                    name="fax"
                    placeholder={'Fax'}
                    className="w-full"
                    autoCapitalize="none"
                  />
                  <ControlledTextField
                    control={control}
                    name="website"
                    placeholder={'Website'}
                    className="w-full"
                    autoCapitalize="none"
                  />
                </View>
                <View className="mt-5 flex-row justify-center">
                  <Button
                    className="bg-[#86939e]"
                    title="Cancel"
                    variant="default"
                    leadingIcon="x"
                    onPress={() => {
                      router.back()
                    }}
                  />
                  <Button
                    className="ml-5"
                    title={_.isEmpty(locationDetails) ? 'Create' : 'Save'}
                    variant="default"
                    leadingIcon="save"
                    onPress={handleSubmit(addUpdateLocation)}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  )
}
