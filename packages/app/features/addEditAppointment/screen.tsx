'use client'
import _ from 'lodash'
import { useState, useCallback, useEffect } from 'react'
import { Alert, View, BackHandler, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'
import { useRouter } from 'expo-router'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_APPOINTMENT_DOCTORS,
  GET_APPOINTMENT_FACILITIES,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Feather } from 'app/ui/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { Typography } from 'app/ui/typography'
const schema = z.object({
  description: z.string(),
  appointmentType: z.number().min(0, { message: 'Select Appointment Type' }),
  doctoFacilityIndex: z.number().min(0, { message: 'Select Doctor/Facility' })
})
export type Schema = z.infer<typeof schema>
// let selectedDate: any = new Date()
type TypeResponse = {
  id: number
  type: string
}
type DoctorFacilityResponse = {
  id: number
  name: string
}
export function AddEditAppointmentScreen() {
  const router = useRouter()
  const staticData: any = store.getState().staticDataState.staticData
  const item = useLocalSearchParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let doctorFacilityDetails = item.doctorFacilityDetails
    ? JSON.parse(item.doctorFacilityDetails)
    : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
  // console.log('doctorFacilityDetails', JSON.stringify(doctorFacilityDetails))

  let component = item.component ? item.component : ''
  // console.log('component', component)
  let appointmentDetails = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    appointmentDetails.date ? appointmentDetails.date : new Date()
  )
  const [key, setKey] = useState(0)
  const [isAddDoctorFacility, setIsAddDoctorFacility] = useState(false)
  const [facilityDoctorIndex, setFacilityDoctorIndex] = useState(-1)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [purpose, setPurpose] = useState(
    !_.isEmpty(appointmentDetails) && appointmentDetails.purpose
      ? appointmentDetails.purpose
      : ''
  )
  const [selectedDoctorFacility, setSelectedDoctorFacility] = useState(
    null
  ) as any
  const [doctorFacilityList, setDoctorFacilityList] = useState([]) as any
  const [doctorFacilityListFull, setDoctorFacilityListFull] = useState(
    []
  ) as any
  const [isShowDoctorFacilityDropdown, setIsShowDoctorFacilityDropdown] =
    useState(false)
  const getDoctorFacilities = useCallback(async (value: any) => {
    setLoading(true)
    let url = ''
    let dataObject = {}
    if (value === 0) {
      url = `${BASE_URL}${GET_APPOINTMENT_DOCTORS}`
      dataObject = {
        header: header,
        doctor: {
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      }
    } else {
      url = `${BASE_URL}${GET_APPOINTMENT_FACILITIES}`
      dataObject = {
        header: header,
        facility: {
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      }
    }

    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let doctorFacilities: Array<{ id: number; title: string }> = [
            {
              id: 1,
              title: value === 0 ? 'Add New Doctor' : 'Add New Facility'
            }
          ]
          data.data.map(({ name, id }: DoctorFacilityResponse, index: any) => {
            let object = {
              id: index + 2,
              title: name
            }
            doctorFacilities.push(object)
          })
          let list = data.data ? data.data : []
          setDoctorFacilityList(doctorFacilities)
          setDoctorFacilityListFull(list)
          setIsDataReceived(true)
          setIsAddDoctorFacility(list.length === 0)
          let facilityDoctorLocationId = -1
          if (!_.isEmpty(doctorFacilityDetails)) {
            if (component === 'Doctor') {
              if (
                doctorFacilityDetails.doctorLocationList[0] &&
                doctorFacilityDetails.doctorLocationList[0].id
              ) {
                facilityDoctorLocationId =
                  doctorFacilityDetails.doctorLocationList[0].id
              }
            } else {
              if (
                doctorFacilityDetails.facilityLocationList[0] &&
                doctorFacilityDetails.facilityLocationList[0].id
              ) {
                facilityDoctorLocationId =
                  doctorFacilityDetails.facilityLocationList[0].id
              }
            }
          }
          if (
            appointmentDetails.doctorLocation &&
            appointmentDetails.doctorLocation.id
          ) {
            facilityDoctorLocationId = appointmentDetails.doctorLocation.id
          } else if (
            appointmentDetails.facilityLocation &&
            appointmentDetails.facilityLocation.id
          ) {
            facilityDoctorLocationId = appointmentDetails.facilityLocation.id
          }

          list.map(async (data: any, index: any) => {
            if (data.locationId === facilityDoctorLocationId) {
              setFacilityDoctorIndex(index + 2)
              console.log('doctoFacilityIndex', String(index + 2))
              reset({
                doctoFacilityIndex: index + 2
              })
            }
          })
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
  let typeIndex: any = -1
  if (!_.isEmpty(appointmentDetails) && !isLoading) {
    if (
      appointmentDetails.type &&
      appointmentDetails.type.type === 'Doctor Appointment'
    ) {
      typeIndex = 1
    } else {
      typeIndex = 2
    }

    console.log('typeIndex', '' + typeIndex)
    console.log('facilityDoctorIndex', '' + facilityDoctorIndex)
  }
  if (component === 'Doctor' || component === 'Facility') {
    typeIndex = component === 'Doctor' ? 1 : 2

    // console.log('typeIndex1', '' + typeIndex)
  }

  async function addEditAppointment(formData: Schema) {
    // console.log('selectedDate', selectedDate)
    // console.log('purpose', purpose)
    let dataObject: any = {
      header: header,
      appointment: {
        date: selectedDate,
        description: formData.description,
        appointmentPreNote: '',
        purpose: purpose,
        type: {
          type:
            selectedDoctorFacility === 1
              ? 'Doctor Appointment'
              : 'Facility Appointment'
        },
        member: {
          id: memberData.member ? memberData.member : ''
        },
        doctorLocation: {},
        facilityLocation: {}
      }
    }
    let url = ''
    if (_.isEmpty(appointmentDetails) || isFromCreateSimilar === 'true') {
      url = `${BASE_URL}${CREATE_APPOINTMENT}`
    } else {
      url = `${BASE_URL}${UPDATE_APPOINTMENT}`
      dataObject.appointment.id = appointmentDetails.id
    }
    if (formData.doctoFacilityIndex !== 1) {
      if (selectedDoctorFacility === 1) {
        dataObject.appointment.doctorLocation.id =
          doctorFacilityListFull[formData.doctoFacilityIndex - 2].locationId
      } else {
        dataObject.appointment.facilityLocation.id =
          doctorFacilityListFull[formData.doctoFacilityIndex - 2].locationId
      }
    } else {
      Alert.alert('', 'Please Select Doctor/Facility')
      return
    }
    setLoading(true)
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let apptDetails = {}
          if (_.isEmpty(appointmentDetails)) {
            apptDetails = data.data.appointmentWithPreviousAppointment
              .appointment
              ? data.data.appointmentWithPreviousAppointment.appointment
              : {}
          } else {
            if (isFromCreateSimilar === 'true') {
              apptDetails = data.data.appointmentWithPreviousAppointment
                .appointment
                ? data.data.appointmentWithPreviousAppointment.appointment
                : {}
            } else {
              apptDetails = data.data.appointment ? data.data.appointment : {}
            }
          }
          if (_.isEmpty(appointmentDetails)) {
            router.dismiss(1)
          } else {
            router.dismiss(2)
          }

          router.push(
            formatUrl('/circles/appointmentDetails', {
              appointmentDetails: JSON.stringify(apptDetails),
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

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description:
        !_.isEmpty(appointmentDetails) && appointmentDetails.description
          ? appointmentDetails.description
          : '',
      appointmentType: typeIndex,
      doctoFacilityIndex: facilityDoctorIndex
    },
    resolver: zodResolver(schema)
  })
  const purposeList = staticData.appointmentPurposeList.map(
    (data: any, index: any) => {
      return {
        label: data.purpose
      }
    }
  )
  let typesList: Array<{ id: number; title: string }> =
    staticData.appointmentTypeList.map(
      ({ type, id }: TypeResponse, index: any) => {
        return {
          id: index + 1,
          title: type
        }
      }
    )
  const onSelection = (date: any) => {
    // console.log('onSelection', '' + date)
    setSelectedDate(date)
    setKey(Math.random())
  }
  const onSelectionPurpose = (data: any) => {
    // purpose = data
    setPurpose(data)
    console.log('purpose1', purpose)
  }
  async function setSelectedTypeChange(value: any) {
    if (value) {
      setIsShowDoctorFacilityDropdown(true)
      setSelectedDoctorFacility(value.id)
      getDoctorFacilities(value.id - 1)
    }
  }
  async function selectedDoctorFacilityChange(value: any) {
    if (value && !isLoading) {
      // console.log('value', JSON.stringify(value))
      if (value.title === 'Add New Doctor') {
        router.push(
          formatUrl('/circles/addEditDoctor', {
            component: 'addEditAppointment',
            memberData: JSON.stringify(memberData)
          })
        )
      } else if (value.title === 'Add New Facility') {
        router.push(
          formatUrl('/circles/addEditFacility', {
            component: 'addEditAppointment',
            memberData: JSON.stringify(memberData)
          })
        )
      }
    }
  }
  function handleBackButtonClick() {
    router.dismiss(1)
    router.back()
    return true
  }

  useEffect(() => {
    if (
      !_.isEmpty(appointmentDetails) ||
      component === 'Doctor' ||
      component === 'Facility'
    ) {
      setIsShowDoctorFacilityDropdown(true)
      getDoctorFacilities(typeIndex - 1)
      setSelectedDoctorFacility(facilityDoctorIndex)
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  const showAddDcotoFacilityModal = () => {
    return (
      <View
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{``}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsAddDoctorFacility(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-5 items-center">
          <Typography className=" w-full self-center text-center font-bold text-black">
            {selectedDoctorFacility === 1
              ? `There are No Doctors set yet. Kindly Add Doctor details.`
              : `There are No Facilities set yet. Kindly Add Facility details.`}
          </Typography>

          <Button
            className="my-3 ml-5 w-[50%] bg-[#ef6603]"
            title={selectedDoctorFacility === 1 ? 'Add Doctor' : 'Add Facility'}
            variant="default"
            onPress={() => {
              if (selectedDoctorFacility === 1) {
                router.push(
                  formatUrl('/circles/addEditDoctor', {
                    component: 'addEditAppointment',
                    memberData: JSON.stringify(memberData)
                  })
                )
              } else {
                router.push(
                  formatUrl('/circles/addEditFacility', {
                    component: 'addEditAppointment',
                    memberData: JSON.stringify(memberData)
                  })
                )
              }
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <View key={key} className="w-full flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          _.isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
            ? 'Add Appointment'
            : 'Edit Appointment'
        }
        memberData={memberData}
      />
      <SafeAreaView>
        {/* <View className="h-full w-full flex-1 py-2 "> */}
        <ScrollView className="mt-5 h-[90%] w-full flex-1 rounded-[5px] border-[1px] border-gray-400 p-2 py-2">
          <View className="mt-5 w-full items-center">
            <ControlledDropdown
              control={control}
              name="appointmentType"
              label="Appointment Type*"
              defaultValue={
                typeIndex !== -1
                  ? typeIndex === 1
                    ? 'Doctor Appointmet'
                    : 'Facility Appointmet'
                  : ''
              }
              maxHeight={300}
              list={typesList}
              className=""
              onChangeValue={setSelectedTypeChange}
            />
            {isShowDoctorFacilityDropdown && isDataReceived ? (
              <ControlledDropdown
                control={control}
                name="doctoFacilityIndex"
                label={selectedDoctorFacility === 1 ? 'Doctor*' : 'Facility*'}
                defaultValue={''}
                maxHeight={300}
                list={doctorFacilityList}
                className="mt-2 "
                onChangeValue={selectedDoctorFacilityChange}
              />
            ) : (
              <View />
            )}
          </View>

          <View className="mt-2 w-full">
            <PtsDateTimePicker
              currentData={selectedDate}
              onSelection={onSelection}
            />
          </View>
          <View className="my-2 w-full flex-row justify-center">
            <ControlledTextField
              control={control}
              name="description"
              placeholder={'Description'}
              className=" bg-white"
              autoCapitalize="none"
            />
          </View>
          <View className="mt-1 w-full self-center">
            <PtsComboBox
              currentData={purpose}
              listData={purposeList}
              onSelection={onSelectionPurpose}
              placeholderValue={'Purpose'}
            />
          </View>
          <View className="mt-5 flex-row justify-center">
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
              className="ml-5 bg-[#287CFA]"
              title={
                _.isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
                  ? 'Create'
                  : 'Save'
              }
              leadingIcon="save"
              variant="default"
              onPress={handleSubmit(addEditAppointment)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {isAddDoctorFacility ? (
        <View className="absolute top-[100] w-[95%] flex-1 self-center">
          {showAddDcotoFacilityModal()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
