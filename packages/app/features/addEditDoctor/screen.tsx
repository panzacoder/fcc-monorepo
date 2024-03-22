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
  CREATE_DOCTOR,
  UPDATE_DOCTOR,
  DELETE_DOCTOR,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
import ToggleSwitch from 'toggle-switch-react-native'
import { formatUrl } from 'app/utils/format-url'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
const schema = z.object({
  firstName: z.string(),
  phone: z.string(),
  website: z.string(),
  username: z.string(),
  portalWebsite: z.string(),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  specialization: z.number().min(0, { message: 'Specialization is required' }),
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
  // state: z.number(),
  country: z.number().min(0, { message: 'Country is required' })
})
export type Schema = z.infer<typeof schema>
let statesListFull = []
let isDoctorActive = true
export function AddEditDoctorScreen() {
  const router = useRouter()
  const staticData = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let doctorDetails = item.doctorDetails ? JSON.parse(item.doctorDetails) : {}
  console.log('doctorDetails', JSON.stringify(doctorDetails))
  if (!_.isEmpty(doctorDetails)) {
    if (
      doctorDetails.status &&
      doctorDetails.status.status.toLowerCase() === 'inactive'
    ) {
      isDoctorActive = false
    }
  }
  let specializationListIndex: any = -1
  if (doctorDetails.specialist) {
    // facilityTypeIdex = getTypeIndex(facilityDetails.type)
    staticData.specializationList.map((data: any, index: any) => {
      if (data.specialization === doctorDetails.specialist) {
        specializationListIndex = index
      }
    })
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName:
        doctorDetails && doctorDetails.firstName ? doctorDetails.firstName : '',
      lastName:
        doctorDetails && doctorDetails.lastName ? doctorDetails.lastName : '',
      specialization: specializationListIndex,
      phone: doctorDetails && doctorDetails.phone ? doctorDetails.phone : '',
      website:
        doctorDetails && doctorDetails.website ? doctorDetails.website : '',
      username:
        doctorDetails && doctorDetails.websiteuser
          ? doctorDetails.websiteuser
          : '',
      portalWebsite:
        doctorDetails && doctorDetails.website ? doctorDetails.website : '',
      locationDesc: _.isEmpty(doctorDetails) ? '' : 'default',
      locationShortName: _.isEmpty(doctorDetails) ? '' : 'default',
      address: '',
      city: '',
      postalCode: '',
      locationPhone: '',
      fax: '',
      country: _.isEmpty(doctorDetails) ? -1 : 0,
      state: _.isEmpty(doctorDetails) ? -1 : 0
    },
    resolver: zodResolver(schema)
  })
  const [isLoading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(isDoctorActive ? true : false)
  const [statesList, setStateslist] = useState([])
  const specializationList = staticData.specializationList.map(
    (data: any, index: any) => {
      return {
        label: data.specialization,
        value: index
      }
    }
  )

  async function deleteDoctor() {
    setLoading(true)
    let loginURL = `${BASE_URL}${DELETE_DOCTOR}`
    let dataObject = {
      header: header,
      doctor: {
        id: doctorDetails.id
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          router.push(
            formatUrl('/circles/doctors', {
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
  async function updateDoctor(formData: Schema) {
    console.log('isDoctorActive updateDoctor', '' + isDoctorActive)
    setLoading(true)
    let loginURL = `${BASE_URL}${UPDATE_DOCTOR}`
    let dataObject = {
      header: header,
      doctor: {
        id: doctorDetails.id ? doctorDetails.id : '',
        member: {
          id: memberData.member
        },
        salutation: 'Dr',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        website: formData.website,
        websiteuser: formData.username,
        specialist: specializationList[formData.specialization].label,
        status: {
          status: isDoctorActive === true ? 'Active' : 'InActive',
          id: isDoctorActive === true ? 1 : 2
        }
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
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
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function createDoctor(formData: Schema) {
    setLoading(true)
    let locationList: object[] = []
    let stateObject = statesListFull[formData.state]
    let countryObject: object = staticData.countryList[formData.country]
    let addressObject = {
      shortDescription: formData.locationDesc,
      nickName: formData.locationShortName,
      fax: formData.fax,
      website: formData.website,
      phone: formData.phone,
      address: {
        id: '',
        line: formData.address,
        city: formData.city,
        zipCode: formData.postalCode,
        state: stateObject
      }
    }
    addressObject.address.state.country = countryObject
    locationList.push(addressObject)
    let loginURL = `${BASE_URL}${CREATE_DOCTOR}`
    let dataObject = {
      header: header,
      doctor: {
        member: {
          id: memberData.member
        },
        salutation: 'Dr',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: '',
        phone: formData.phone,
        website: formData.website,
        websiteuser: formData.username,
        specialist: specializationList[formData.specialization].label,
        isSelf: true,
        doctorLocationList: locationList
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.push(
            formatUrl('/circles/doctors', {
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
        id: countryId
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        // console.log('data', data)
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
          // console.log('setStateslistFull', JSON.stringify(statesListFull))
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
  // async function setSelectedStateChange(value: any) {
  //   console.log('setSelectedStateChange value', '' + value)
  //   console.log('statesListFull', JSON.stringify(statesListFull))
  // }
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
                      isDoctorActive = true
                    } else {
                      setIsActive(false)
                      isDoctorActive = false
                    }
                    console.log('isDoctorActive', '' + isDoctorActive)
                  }}
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
                  title={_.isEmpty(doctorDetails) ? 'Save' : 'Update'}
                  variant="default"
                  onPress={
                    _.isEmpty(doctorDetails)
                      ? handleSubmit(createDoctor)
                      : handleSubmit(updateDoctor)
                  }
                />
              </View>
            </View>
            <View className="my-5 w-full">
              <View className="w-full flex-row gap-2">
                <ControlledTextField
                  control={control}
                  name="firstName"
                  placeholder={'First Name'}
                  className="w-[50%]"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="lastName"
                  placeholder="Last Name*"
                  className="w-[50%]"
                />
              </View>
              <View className="mt-5">
                <ControlledDropdown
                  control={control}
                  name="specialization"
                  label="Specialization*"
                  maxHeight={300}
                  list={specializationList}
                // onChangeValue={setSelectedCountryChange}
                />
              </View>
            </View>
            <View>
              <View className="mb-5 flex-row items-center">
                <Typography className="w-[30%]">{'Contact Info'}</Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="phone"
                  placeholder={'Phone'}
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
            </View>

            <View className="mt-2">
              <View className="mb-2 flex-row items-center">
                <Typography className="w-[30%]">{'Portal Details'}</Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="username"
                  placeholder={'Username'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="portalWebsite"
                  placeholder={'Website'}
                  className="w-full"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
          {_.isEmpty(doctorDetails) ? (
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
                    // onChangeValue={setSelectedStateChange}
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
          {!_.isEmpty(doctorDetails) ? (
            <View className="mx-5 my-5">
              <Button
                className=""
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Doctor?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteDoctor()
                      },
                      { text: 'Cancel', onPress: () => { } }
                    ]
                  )
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    </View>
  )
}
