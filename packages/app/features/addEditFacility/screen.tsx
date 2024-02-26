'use client'
import _ from 'lodash'
import { useState, useCallback } from 'react'
import { View, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CREATE_FACILITY,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'

const schema = z.object({
  website: z.string(),
  username: z.string(),
  description: z.string(),
  facilityName: z.string().min(1, { message: 'Facility name is required' }),
  type: z.number().min(0, { message: 'Type is required' }),
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

export function AddEditFacilityScreen() {
  const [statesListFull, setFullStatesList] = useState([])
  let isThisPharmacy = false
  const router = useRouter()
  const staticData = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = JSON.parse(item.memberData)
  let facilityDetails = item.facilityDetails
    ? JSON.parse(item.facilityDetails)
    : {}
  console.log('facilityDetails', JSON.stringify(facilityDetails))

  const [isLoading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [isPharmacy, setIsPharmacy] = useState(false)
  const [statesList, setStateslist] = useState([])
  const typesList = staticData.facilityTypeList.map((data: any, index: any) => {
    return {
      label: data.type,
      value: index
    }
  })
  async function getTypeIndex(type: string) {
    const typeIndex = staticData.facilityTypeList.map(
      (data: any, index: any) => {
        if (data.type === type) {
          return index
        }
      }
    )
    return typeIndex
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      facilityName:
        facilityDetails && facilityDetails.name ? facilityDetails.name : '',
      type:
        facilityDetails && facilityDetails.type
          ? getTypeIndex(facilityDetails.type)
          : -1,
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
      locationDesc: '',
      locationShortName: '',
      address: '',
      city: '',
      postalCode: '',
      locationPhone: '',
      fax: '',
      country: -1,
      state: -1
    },
    resolver: zodResolver(schema)
  })
  async function createFacility(formData: Schema) {
    setLoading(true)
    let locationList: object[] = []
    let stateObject = statesListFull[formData.state] || {}
    let countryObject: object = staticData.countryList[formData.country]
    let locationObject = {
      shortDescription: formData.locationDesc,
      nickName: formData.locationShortName,
      fax: formData.fax,
      website: formData.website,
      address: {
        id: '',
        line: formData.address,
        city: formData.city,
        zipCode: formData.postalCode,
        state: {
          ...stateObject,
          country: countryObject
        }
      }
    }
    locationList.push(locationObject)
    let loginURL = `${BASE_URL}${CREATE_FACILITY}`
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
        type: typesList[formData.type].label,
        facilityLocationList: locationList
      }
    }
    CallPostService(loginURL, dataObject)
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
  const countryList = staticData.countryList.map((data: any, index: any) => {
    return {
      label: data.name,
      value: index
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
          // set available states
          let statesList = data.data.stateList.map((data: any, index: any) => {
            return {
              label: data.name,
              value: index
            }
          })
          setStateslist(statesList)
          if (data.data.statesList) {
            setFullStatesList(data.data.stateList)
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
  async function setSelectedCountryChange(value: any) {
    let countryId = staticData.countryList[value].id
      ? staticData.countryList[value].id
      : 101
    await getStates(countryId)
  }
  return (
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1  self-center rounded-[10px] border-[1px] p-5">
            <View className="flex-row">
              <View className="w-[50%] flex-row">
                <ToggleSwitch
                  isOn={isActive}
                  onColor="#2884F9"
                  offColor="#2884F9"
                  size="medium"
                  onToggle={(isOn) => setIsActive(!isActive)}
                />
                <Typography className="font-400 ml-2 self-center">
                  {isActive ? 'Active' : 'InActive'}
                </Typography>
              </View>
              <View className="flex-row">
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
                  title="Save"
                  variant="default"
                  onPress={handleSubmit(createFacility)}
                />
              </View>
            </View>
            <View className="my-5 w-full">
              <View className="w-full flex-row gap-2">
                <ControlledTextField
                  control={control}
                  name="facilityName"
                  placeholder="Facility Name*"
                  className="w-full"
                />
              </View>
              <View className="mt-5">
                <ControlledDropdown
                  control={control}
                  name="type"
                  label="Type*"
                  maxHeight={300}
                  list={typesList}
                  // onChangeValue={setSelectedCountryChange}
                />
              </View>
              <View className="mt-5">
                <ControlledTextField
                  control={control}
                  name="description"
                  placeholder="Description"
                  className="w-full"
                />
              </View>
            </View>
            <View>
              <View className="mb-5 flex-row items-center">
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
                <Typography className=" w-[80%] font-bold">
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
              </View>
            </View>
          </View>
          {_.isEmpty(facilityDetails) ? (
            <View className="border-primary mt-[10] w-[95%] flex-1  self-center rounded-[10px] border-[1px] p-5">
              <View className="mt-2">
                <View className="mb-2 flex-row items-center">
                  <Typography className="w-[20%]">{'Location'}</Typography>
                  <View className="bg-primary  ml-2 h-[1px] w-[75%]" />
                </View>
                <View className=" w-full">
                  <View className="flex w-full gap-2">
                    <ControlledTextField
                      control={control}
                      name="locationDesc"
                      placeholder={'Location Description*'}
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
                    <View className="w-full flex-row gap-2">
                      <ControlledTextField
                        control={control}
                        name="address"
                        placeholder={'City'}
                        className="w-[50%]"
                        autoCapitalize="none"
                      />
                      <ControlledTextField
                        control={control}
                        name="address"
                        placeholder="Postal Code"
                        className="w-[48%]"
                      />
                    </View>
                    <ControlledTextField
                      control={control}
                      name="locationPhone"
                      placeholder={'Phone'}
                      className="w-full"
                      autoCapitalize="none"
                    />
                    <ControlledTextField
                      control={control}
                      name="fax"
                      placeholder={'Fax'}
                      className="w-full"
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
