'use client'
import _ from 'lodash'
import { useState, useCallback, useEffect } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import { Stack } from 'expo-router'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { PtsComboBox } from 'app/ui/PtsComboBox'
const schema = z.object({
  description: z.string(),
  appointmentType: z.number().min(0, { message: 'Select Appointment Type' }),
  doctoFacilityIndex: z.number().min(0, { message: 'Select Doctor/Facility' })
})
export type Schema = z.infer<typeof schema>
let selectedDate: any = new Date()
let purpose: any = ''
let facilityDoctorIndex = -1
export function AddEditAppointmentScreen() {
  const router = useRouter()
  const staticData: any = store.getState().staticDataState.staticData
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let component = item.component ? item.component : ''
  let appointmentDetails = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
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
          let doctorFacilities = data.data.map((data: any, index: any) => {
            return {
              title: data.name,
              id: index + 1
            }
          })
          setDoctorFacilityList(doctorFacilities)
          setDoctorFacilityListFull(data.data ? data.data : [])
          setIsDataReceived(true)
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
  if (!_.isEmpty(appointmentDetails)) {
    purpose = appointmentDetails.purpose ? appointmentDetails.purpose : ''
    selectedDate = appointmentDetails.date
      ? appointmentDetails.date
      : new Date()
    if (
      appointmentDetails.type &&
      appointmentDetails.type.type === 'Doctor Appointment'
    ) {
      typeIndex = 0
    } else {
      typeIndex = 1
    }
    console.log('typeIndex', '' + typeIndex)
  }
  if (component !== 'Appointment') {
    typeIndex = component === 'Doctor' ? 0 : 1
    console.log('typeIndex1', '' + typeIndex)
  }
  useEffect(() => {
    if (
      !_.isEmpty(appointmentDetails) ||
      component === 'Doctor' ||
      component === 'Facility'
    ) {
      setIsShowDoctorFacilityDropdown(true)
      setSelectedDoctorFacility(typeIndex)
      getDoctorFacilities(typeIndex)
    }
  }, [])
  async function addEditAppointment(formData: Schema) {
    setLoading(true)

    let dataObject: any = {
      header: header,
      appointment: {
        date: selectedDate,
        description: formData.description,
        appointmentPreNote: '',
        purpose: purpose,
        type: {
          type:
            selectedDoctorFacility === 0
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
    if (_.isEmpty(appointmentDetails)) {
      url = `${BASE_URL}${CREATE_APPOINTMENT}`
    } else {
      url = `${BASE_URL}${UPDATE_APPOINTMENT}`
      dataObject.appointment.id = appointmentDetails.id
    }

    if (selectedDoctorFacility === 0) {
      dataObject.appointment.doctorLocation.id =
        doctorFacilityListFull[formData.doctoFacilityIndex - 1].locationId
    } else {
      dataObject.appointment.facilityLocation.id =
        doctorFacilityListFull[formData.doctoFacilityIndex - 1].locationId
    }
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
            apptDetails = data.data.appointment ? data.data.appointment : {}
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
  if (!_.isEmpty(appointmentDetails)) {
    let facilityDoctorLocationId = -1
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

    doctorFacilityListFull.map(async (data: any, index: any) => {
      if (data.locationId === facilityDoctorLocationId) {
        facilityDoctorIndex = index
        console.log('facilityDoctorIndex', '' + facilityDoctorIndex)
      }
    })
  }
  // console.log('facilityDoctorIndex1', facilityDoctorIndex)
  const { control, handleSubmit } = useForm({
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
  const typesList = staticData.appointmentTypeList.map(
    (data: any, index: any) => {
      return {
        title: data.type,
        id: index + 1
      }
    }
  )
  const onSelection = (date: any) => {
    selectedDate = date
  }
  const onSelectionPurpose = (data: any) => {
    purpose = data
    // console.log('purpose1', purpose)
  }
  async function setSelectedTypeChange(value: any) {
    if (value) {
      setIsShowDoctorFacilityDropdown(true)
      setSelectedDoctorFacility(value.id - 1)
      getDoctorFacilities(value.id - 1)
    }
  }
  return (
    <View className="w-full flex-1">
      <Stack.Screen
        options={{
          title: _.isEmpty(appointmentDetails)
            ? 'Add Appointment'
            : 'Edit Appointment'
        }}
      />
      <PtsLoader loading={isLoading} />
      <View className="absolute top-[0] h-full w-full py-2 ">
        <ScrollView className="w-full flex-1">
          <View className="mt-5 w-full items-center">
            <ControlledDropdown
              control={control}
              name="appointmentType"
              label="Appointment Type*"
              defaultValue={
                // !_.isEmpty(appointmentDetails) &&
                // appointmentDetails.type &&
                // appointmentDetails.type.type
                //   ? appointmentDetails.type.type
                //   : ''
                typeIndex !== -1
                  ? typeIndex === 0
                    ? 'Doctor Appointmet'
                    : 'Facility Appointmet'
                  : ''
              }
              maxHeight={300}
              list={typesList}
              className="w-[95%]"
              onChangeValue={setSelectedTypeChange}
            />
            {isShowDoctorFacilityDropdown && isDataReceived ? (
              <ControlledDropdown
                control={control}
                name="doctoFacilityIndex"
                label={selectedDoctorFacility === 0 ? 'Doctor*' : 'Facility*'}
                defaultValue={
                  !_.isEmpty(appointmentDetails)
                    ? doctorFacilityList[facilityDoctorIndex].title
                    : ''
                }
                maxHeight={300}
                list={doctorFacilityList}
                className="mt-2 w-[95%]"
                // onChangeValue={setSelectedTypeChange}
              />
            ) : (
              <View />
            )}
          </View>

          <View className="w-full">
            <PtsDateTimePicker
              currentData={
                appointmentDetails.date ? appointmentDetails.date : new Date()
              }
              onSelection={onSelection}
            />
          </View>
          <View className="my-2 w-full flex-row justify-center">
            <ControlledTextField
              control={control}
              name="description"
              placeholder={'Description'}
              className="w-[95%] bg-white"
              autoCapitalize="none"
            />
          </View>
          <View className="w-[95%] self-center">
            <PtsComboBox
              currentData={purpose}
              listData={purposeList}
              onSelection={onSelectionPurpose}
              placeholderValue={'Select Purpose'}
            />
          </View>
          <View className="mt-5 flex-row justify-center">
            <Button
              className="bg-[#287CFA]"
              title={_.isEmpty(appointmentDetails) ? 'Save' : 'Update'}
              leadingIcon="save"
              variant="default"
              onPress={handleSubmit(addEditAppointment)}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
