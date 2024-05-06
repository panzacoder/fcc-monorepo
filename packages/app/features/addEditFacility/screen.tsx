'use client'
import _ from 'lodash'
import { useState, useCallback } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Stack } from 'expo-router'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CREATE_FACILITY,
  UPDATE_FACILITY,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { formatUrl } from 'app/utils/format-url'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
let selectedType = ''
const schema = z.object({
  website: z.string(),
  username: z.string(),
  description: z.string(),
  facilityName: z.string().min(1, { message: 'Facility name is required' }),
  locationDesc: z
    .string()
    .min(1, { message: 'Location description is required' }),
  locationShortName: z
    .string()
    .min(1, { message: 'Location short name is required' }),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  locationPhone: z.string(),
  fax: z.string(),
  state: z.number().min(0, { message: 'State is required' }),
  country: z.number().min(0, { message: 'Country is required' })
})
export type Schema = z.infer<typeof schema>
let statesListFull = []
let isThisPharmacy = false
let isFacilityActive = true
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
  const [statesList, setStateslist] = useState([]) as any
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
      locationDesc: _.isEmpty(facilityDetails) ? '' : ' ',
      locationShortName: _.isEmpty(facilityDetails) ? '' : ' ',
      address: '',
      city: '',
      postalCode: '',
      locationPhone: '',
      fax: '',
      country: _.isEmpty(facilityDetails) ? -1 : 0,
      state: _.isEmpty(facilityDetails) ? -1 : 0
    },
    resolver: zodResolver(schema)
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
          router.push(
            formatUrl('/circles/facilitiesList', {
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
    let stateObject = statesListFull[formData.state - 1]
    let countryObject: object = staticData.countryList[formData.country - 1]
    let object: any = {
      shortDescription: formData.locationDesc,
      nickName: formData.locationShortName,
      fax: formData.fax,
      website: formData.website,
      address: {
        id: '',
        line: formData.address,
        city: formData.city,
        zipCode: formData.postalCode,
        state: stateObject
      }
    }
    object.address.state.country = countryObject
    locationList.push(object)
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
          router.back()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
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
        console.log('data', data)
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let statesList: Array<{ id: number; title: string }> =
            data.data.stateList.map(({ name, id }: Response, index: any) => {
              return {
                title: name,
                id: index + 1
              }
            })
          setStateslist(statesList)
          statesListFull = data.data.stateList ? data.data.stateList : []
          // console.log('statesList', statesList)
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
  async function setSelectedCountryChange(value: any) {
    console.log('value', JSON.stringify(value))
    let countryId =
      value && staticData.countryList[value.id - 1]?.id
        ? staticData.countryList[value.id - 1].id
        : 101
    await getStates(countryId)
  }
  const onSelectionType = (data: any) => {
    selectedType = data
    // console.log('purpose1', purpose)
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
                  offColor="#2884F9"
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
              <View className=" flex-row">
                <Button
                  className=""
                  title="Cancel"
                  variant="link"
                  onPress={() => {
                    router.back()
                  }}
                />
                <Button
                  className=""
                  title={_.isEmpty(facilityDetails) ? 'Save' : 'Update'}
                  variant="default"
                  onPress={
                    _.isEmpty(facilityDetails)
                      ? handleSubmit(createFacility)
                      : handleSubmit(updateFacility)
                  }
                />
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
                  offColor="#2884F9"
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
                <View className="my-2 flex-row items-center">
                  <Typography className="w-[20%]">{'Location'}</Typography>
                  <View className="bg-primary  ml-2 h-[1px] w-[75%]" />
                </View>
                <View className=" w-full">
                  <View className="flex w-full gap-2">
                    <ControlledTextField
                      control={control}
                      name="locationDesc"
                      placeholder={'Location Name*'}
                      className="w-full"
                      autoCapitalize="none"
                    />
                    <ControlledTextField
                      control={control}
                      name="locationShortName"
                      placeholder="Short Name*"
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
                      label="Country*"
                      maxHeight={300}
                      list={countryList}
                      onChangeValue={setSelectedCountryChange}
                    />
                    <ControlledDropdown
                      control={control}
                      name="state"
                      label="State*"
                      maxHeight={300}
                      list={statesList}
                    />
                  </View>
                  <View>
                    <View className="mt-2 w-full flex-row gap-2">
                      <ControlledTextField
                        control={control}
                        name="city"
                        placeholder={'City'}
                        className="w-[48%]"
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
                      control={control}
                      name="locationPhone"
                      placeholder={'Phone'}
                      className="mt-2 w-full"
                      autoCapitalize="none"
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
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    </View>
  )
}
