'use client'
import _ from 'lodash'
import { useState, useCallback, useEffect } from 'react'
import { View, Alert, BackHandler } from 'react-native'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_STATES_AND_TIMEZONES,
  CREATE_DOCTOR_LOCATION,
  CREATE_FACILITY_LOCATION,
  UPDATE_FACILITY_LOCATION,
  UPDATE_DOCTOR_LOCATION
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import store from 'app/redux/store'
import { formatUrl } from 'app/utils/format-url'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useRouter } from 'expo-router'
import ct from 'countries-and-timezones'
import moment from 'moment-timezone'
import { consoleData } from 'app/ui/utils'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
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
let countryIndex = -1
let stateIndex = -1
export function AddEditLocationScreen() {
  let locationPhone = ''
  const staticData: any = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let locationDetails = item.locationDetails
    ? JSON.parse(item.locationDetails)
    : {}

  console.log('locationDetails', JSON.stringify(locationDetails))
  let details = item.details ? JSON.parse(item.details) : {}
  console.log('details', JSON.stringify(details))
  const [isLoading, setLoading] = useState(false)
  const [statesList, setStatesList] = useState([]) as any
  const [statesListFull, setStatesListFull] = useState([])
  const [isRender, setIsRender] = useState(false)
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
  const getStates = useCallback(async (countryId: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId || 101
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let statesList: Array<{ id: number; title: string }> =
            data.data.stateList.map(({ name, id }: Response, index: any) => {
              return {
                title: name,
                id: index + 1
              }
            })
          // setCountriesList(countryList)
          setStatesList(statesList)
          setStatesListFull(data.data.stateList || [])
          if (!_.isEmpty(locationDetails)) {
            let stateName = locationDetails.address.state.name
              ? locationDetails.address.state.name
              : ''
            data.data.stateList.map((data: any, index: any) => {
              if (data.name === stateName) {
                stateIndex = index + 1
                reset({
                  state: stateIndex
                })
              }
            })
          }
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }, [])
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
    async function setCountryState() {
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
          countryIndex = index + 1
          consoleData('countryName index', '' + countryIndex)
          reset({
            country: countryIndex
          })
        }
      })
      let countryId = staticData.countryList[countryIndex - 1].id
        ? staticData.countryList[countryIndex - 1].id
        : 101
      await getStates(countryId)
    }
    setCountryState()
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
      country: !_.isEmpty(locationDetails) ? countryIndex : -1,
      state: !_.isEmpty(locationDetails) ? stateIndex : -1
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
  async function setSelectedCountryChange(value: any) {
    let countryId = ''
    if (value) {
      if (!isLoading) {
        countryId = staticData.countryList[value.id - 1].id
          ? staticData.countryList[value.id - 1].id
          : 101
        await getStates(countryId)
      }
    } else {
      setStatesList([])
      setStatesListFull([])
    }
  }

  async function addUpdateLocation(formData: Schema) {
    setLoading(true)
    let stateObject = statesListFull[formData.state - 1]
    let countryObject: object = staticData.countryList[formData.country - 1]
    let dataObject = {} as any
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
    if (item.component === 'Doctor') {
      dataObject = {
        header: header,
        doctorLocation: addressObject
      }

      if (_.isEmpty(locationDetails)) {
        dataObject.doctorLocation.doctor = {
          id: details.id ? details.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      } else {
        dataObject.doctorLocation.doctor = {
          id: locationDetails.doctorFacilityId
            ? locationDetails.doctorFacilityId
            : ''
        }
      }
      dataObject.doctorLocation.address.state.country = countryObject
    } else {
      dataObject = {
        header: header,
        facilityLocation: addressObject
      }
      if (_.isEmpty(locationDetails)) {
        dataObject.facilityLocation.facility = {
          id: details.id ? details.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      } else {
        dataObject.facilityLocation.facility = {
          id: locationDetails.doctorFacilityId
            ? locationDetails.doctorFacilityId
            : ''
        }
      }

      dataObject.facilityLocation.address.state.country = countryObject
    }

    if (!_.isEmpty(locationDetails)) {
      if (item.component === 'Doctor') {
        dataObject.doctorLocation.id = locationDetails.id
      } else {
        dataObject.facilityLocation.id = locationDetails.id
      }
    }

    let url = ''
    if (item.component === 'Doctor') {
      url = _.isEmpty(locationDetails)
        ? `${BASE_URL}${CREATE_DOCTOR_LOCATION}`
        : `${BASE_URL}${UPDATE_DOCTOR_LOCATION}`
    } else {
      url = _.isEmpty(locationDetails)
        ? `${BASE_URL}${CREATE_FACILITY_LOCATION}`
        : `${BASE_URL}${UPDATE_FACILITY_LOCATION}`
    }

    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.dismiss(1)
          if (item.component === 'Doctor') {
            let details: any = data.data.doctor
              ? JSON.stringify(data.data.doctor)
              : {}

            router.replace(
              formatUrl('/circles/doctorDetails', {
                doctorDetails: details,
                memberData: JSON.stringify(memberData)
              })
            )
          } else {
            // router.back()
            let details: any = data.data.facility
              ? JSON.stringify(data.data.facility)
              : {}

            router.replace(
              formatUrl('/circles/facilityDetails', {
                facilityDetails: details,
                memberData: JSON.stringify(memberData)
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
        console.log(error)
      })
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
                      countryIndex !== -1 && countryList[countryIndex - 1]
                        ? countryList[countryIndex - 1]?.title
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
                      stateIndex !== -1 && statesList[stateIndex - 1]
                        ? statesList[stateIndex - 1].title
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
