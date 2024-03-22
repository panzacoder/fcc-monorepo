'use client'
import _ from 'lodash'
import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch
} from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CREATE_FACILITY,
  DELETE_FACILITY,
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
let statesListFull = []
let isThisPharmacy = false
let isFacilityActive = true
export function AddEditFacilityScreen() {
  const router = useRouter()
  const staticData = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let facilityDetails = item.facilityDetails
    ? JSON.parse(item.facilityDetails)
    : {}
  // console.log('facilityDetails', JSON.stringify(facilityDetails))
  if (!_.isEmpty(facilityDetails)) {
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
  const [statesList, setStateslist] = useState([])
  const typesList = staticData.facilityTypeList.map((data: any, index: any) => {
    return {
      label: data.type,
      value: index
    }
  })

  let facilityTypeIndex: any = -1
  if (facilityDetails.type) {
    // facilityTypeIndex = getTypeIndex(facilityDetails.type)
    staticData.facilityTypeList.map((data: any, index: any) => {
      if (data.type === facilityDetails.type) {
        facilityTypeIndex = index
      }
    })
  }
  // console.log('facilityTypeIndex', '' + facilityTypeIndex)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      facilityName:
        facilityDetails && facilityDetails.name ? facilityDetails.name : '',
      type: facilityTypeIndex,
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
      locationDesc: _.isEmpty(facilityDetails) ? '' : 'default',
      locationShortName: _.isEmpty(facilityDetails) ? '' : 'default',
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
  async function deleteFacility() {
    setLoading(true)
    let loginURL = `${BASE_URL}${DELETE_FACILITY}`
    let dataObject = {
      header: header,
      facility: {
        id: facilityDetails.id ? facilityDetails.id : ''
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          router.push(
            formatUrl('/(authenticated)/circles/facilities', {
              memberData: JSON.stringify(memberData)
            })
          )
          // router.back()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function updateFacility(formData: Schema) {
    // console.log('in updateFacility')
    // console.log('in updateFacility isFacilityActive', '' + isFacilityActive)
    setLoading(true)
    let loginURL = `${BASE_URL}${UPDATE_FACILITY}`
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
        type: typesList[formData.type].label,
        status: {
          status: isFacilityActive === true ? 'Active' : 'Inactive',
          id: isFacilityActive === true ? 1 : 2
        }
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))

          // let details: any = data.data.facility
          //   ? JSON.stringify(data.data.facility)
          //   : {}
          // router.push(
          //   formatUrl('/(authenticated)/circles/facilityDetails', {
          //     facilityDetails: details,
          //     memberData: JSON.stringify(memberData)
          //   })
          // )
          router.push(
            formatUrl('/(authenticated)/circles/facilities', {
              memberData: JSON.stringify(memberData)
            })
          )
          // router.back()
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
    setLoading(true)
    let locationList: object[] = []
    let stateObject = statesListFull[formData.state]
    let countryObject: object = staticData.countryList[formData.country]
    let object = {
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
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          // router.push(
          //   formatUrl('/(authenticated)/circles/facilityDetails', {
          //     facilityDetails: JSON.stringify(
          //       data.data.facility ? data.data.facility : {}
          //     ),
          //     memberData: JSON.stringify(memberData)
          //   })
          // )
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
          </View >
  {
    _.isEmpty(facilityDetails) ? (
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
    )
  }
  {
    !_.isEmpty(facilityDetails) ? (
      <View className="mx-5 my-5">
        <Button
          className=""
          title="Delete"
          variant="borderRed"
          onPress={() => {
            Alert.alert(
              'Are you sure about deleting Facility?',
              'It cannot be recovered once deleted.',
              [
                {
                  text: 'Ok',
                  onPress: () => deleteFacility()
                },
                { text: 'Cancel', onPress: () => { } }
              ]
            )
          }}
        />
      </View>
    ) : (
      <View />
    )
  }
        </ScrollView >
      </View >
    </View >
  )
}
