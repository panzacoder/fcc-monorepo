'use client'
import _ from 'lodash'
import { useState } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import { LocationDetails } from 'app/ui/locationDetails'
import { BASE_URL, CREATE_DOCTOR, UPDATE_DOCTOR } from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import ToggleSwitch from 'toggle-switch-react-native'
import { formatUrl } from 'app/utils/format-url'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
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
  firstName: z.string(),
  website: z.string(),
  username: z.string(),
  portalWebsite: z.string(),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  specialization: z.number().min(0, { message: 'Specialization is required' })
})
const phoneSchema = z.object({
  phone: z.string()
})
export type Schema = z.infer<typeof schema>
let isDoctorActive = true

export function AddEditDoctorScreen() {
  let doctorPhone = ''
  const router = useRouter()
  const staticData = store.getState().staticDataState.staticData as any
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let doctorDetails = item.doctorDetails ? JSON.parse(item.doctorDetails) : {}
  // console.log('doctorDetails', JSON.stringify(doctorDetails))
  if (!_.isEmpty(doctorDetails)) {
    if (
      doctorDetails.status &&
      doctorDetails.status.status.toLowerCase() === 'inactive'
    ) {
      isDoctorActive = false
    }
    if (doctorDetails.phone) {
      doctorPhone = doctorDetails.phone
    }
  }
  const specializationList: Array<{ id: number; title: string }> =
    staticData.specializationList.map(
      ({ specialization, id }: SpecializationResponse, index: any) => {
        return {
          id: index + 1,
          title: specialization
        }
      }
    )
  const findSpecializationFromId = (index: number) => {
    return staticData.specializationList[index - 1]?.specialization
  }
  const getSpecializationIndex = (specialization: string) => {
    let specializationIndex = -1
    staticData.specializationList.map((data: any, index: any) => {
      if (data.specialization === specialization) {
        specializationIndex = index + 1
      }
    })
    return specializationIndex
  }
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
    }

    // console.log('selectedAddress', JSON.stringify(selectedAddress))
  }
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName:
        doctorDetails && doctorDetails.firstName ? doctorDetails.firstName : '',
      lastName:
        doctorDetails && doctorDetails.lastName ? doctorDetails.lastName : '',
      specialization: doctorDetails.specialist
        ? getSpecializationIndex(doctorDetails.specialist)
        : -1,
      website:
        doctorDetails && doctorDetails.website ? doctorDetails.website : '',
      username:
        doctorDetails && doctorDetails.websiteuser
          ? doctorDetails.websiteuser
          : '',
      portalWebsite:
        doctorDetails && doctorDetails.website ? doctorDetails.website : ''
    },
    resolver: zodResolver(schema)
  })
  const { control: control1, reset: reset1 } = useForm({
    defaultValues: {
      phone:
        doctorDetails && doctorDetails.phone
          ? convertPhoneNumberToUsaPhoneNumberFormat(doctorDetails.phone)
          : ''
    },
    resolver: zodResolver(phoneSchema)
  })
  const [isLoading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(isDoctorActive ? true : false)

  type SpecializationResponse = {
    id: number
    specialization: string
  }

  async function updateDoctor(formData: Schema) {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_DOCTOR}`
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
        phone: removeAllSpecialCharFromString(doctorPhone),
        website: formData.website,
        websiteuser: formData.username,
        specialist: findSpecializationFromId(formData.specialization),
        status: {
          status: isDoctorActive === true ? 'Active' : 'InActive',
          id: isDoctorActive === true ? 1 : 2
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let details: any = data.data.doctor
            ? JSON.stringify(data.data.doctor)
            : {}

          router.dismiss(1)
          router.push(
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
    selectedAddress.address.id = ''
    locationList.push(selectedAddress)
    let url = `${BASE_URL}${CREATE_DOCTOR}`
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
        phone: removeAllSpecialCharFromString(doctorPhone),
        website: formData.website,
        websiteuser: formData.username,
        specialist: findSpecializationFromId(formData.specialization),
        isSelf: true,
        doctorLocationList: locationList
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let details: any = data.data.doctor
            ? JSON.stringify(data.data.doctor)
            : {}
          if (item.component === 'addEditAppointment') {
            router.dismiss(2)
            router.push(
              formatUrl('/circles/addEditAppointment', {
                memberData: JSON.stringify(memberData),
                doctorFacilityDetails: details,
                component: 'Doctor'
              })
            )
          } else {
            router.dismiss(1)
            router.push(
              formatUrl('/circles/doctorDetails', {
                doctorDetails: details,
                memberData: JSON.stringify(memberData)
              })
            )
          }
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

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={_.isEmpty(doctorDetails) ? 'Add Doctor' : 'Edit Doctor Details'}
        memberData={{}}
      />
      <View className="h-full w-full flex-1 py-2 ">
        <SafeAreaView>
          <ScrollView
            automaticallyAdjustKeyboardInsets
            persistentScrollbar={true}
            className="flex-1"
          >
            <View className="border-primary mt-[5] w-full flex-1  self-center rounded-[10px] border-[1px] p-5">
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
              </View>
              <View className="mt-2 w-full">
                <View className="w-full flex-row gap-2">
                  <ControlledTextField
                    control={control}
                    name="firstName"
                    placeholder={'First Name'}
                    className="w-[50%]"
                  />
                  <ControlledTextField
                    control={control}
                    name="lastName"
                    placeholder="Last Name*"
                    className="w-[50%]"
                  />
                </View>
                <View className="mt-2">
                  <ControlledDropdown
                    control={control}
                    name={'specialization'}
                    label={'Specialization*'}
                    maxHeight={300}
                    list={specializationList}
                    defaultValue={
                      !_.isEmpty(doctorDetails) && doctorDetails.specialist
                        ? doctorDetails.specialist
                        : ''
                    }
                    // onChangeValue={setSelectedCountryChange}
                  />
                </View>
              </View>
              <View>
                <View className="my-1 flex-row items-center">
                  <Typography className="w-[30%]">{'Contact Info'}</Typography>
                  <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
                </View>
                <View className="flex w-full gap-2">
                  <ControlledTextField
                    control={control1}
                    name="phone"
                    placeholder={'Phone'}
                    className="w-full"
                    keyboard="number-pad"
                    onChangeText={(value) => {
                      doctorPhone =
                        convertPhoneNumberToUsaPhoneNumberFormat(value)

                      reset1({
                        phone: doctorPhone
                      })
                    }}
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
                <View className="my-1 flex-row items-center">
                  <Typography className="w-[30%]">
                    {'Portal Details'}
                  </Typography>
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
              <View className="border-primary mt-[10] w-full flex-1  self-center rounded-[10px] border-[1px] p-5">
                <View className="mt-2">
                  <View className=" flex-row items-center">
                    <Typography className="w-[20%]">{'Location'}</Typography>
                    <View className="bg-primary ml-2 h-[1px] w-[75%]" />
                  </View>
                  <LocationDetails
                    component={'AddEditDoctor'}
                    data={{}}
                    setAddressObject={setAddressObject}
                  />
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
                title={_.isEmpty(doctorDetails) ? 'Create' : 'Save'}
                variant="default"
                onPress={
                  _.isEmpty(doctorDetails)
                    ? handleSubmit(createDoctor)
                    : handleSubmit(updateDoctor)
                }
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  )
}
