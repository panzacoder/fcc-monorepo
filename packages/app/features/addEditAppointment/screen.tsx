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
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
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
          let doctorFacilities: Array<{ id: number; title: string }> =
            data.data.map(
              ({ name, id }: DoctorFacilityResponse, index: any) => {
                return {
                  id: index + 1,
                  title: name
                }
              }
            )
          setDoctorFacilityList(doctorFacilities)
          setDoctorFacilityListFull(data.data ? data.data : [])
          setIsDataReceived(true)
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
              facilityDoctorIndex = index + 1
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
    purpose = appointmentDetails.purpose ? appointmentDetails.purpose : ''
    selectedDate = appointmentDetails.date
      ? appointmentDetails.date
      : new Date()
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
    setLoading(true)
    console.log('selectedDate', selectedDate)
    console.log('purpose', purpose)
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

    if (selectedDoctorFacility === 1) {
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
    selectedDate = date
  }
  const onSelectionPurpose = (data: any) => {
    purpose = data
    console.log('purpose1', purpose)
  }
  async function setSelectedTypeChange(value: any) {
    if (value) {
      setIsShowDoctorFacilityDropdown(true)
      setSelectedDoctorFacility(value.id)
      getDoctorFacilities(value.id - 1)
    }
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
  }, [])
  return (
    <View className="w-full flex-1">
      <Stack.Screen
        options={{
          title:
            _.isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
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
                typeIndex !== -1
                  ? typeIndex === 1
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
                label={selectedDoctorFacility === 1 ? 'Doctor*' : 'Facility*'}
                defaultValue={''}
                maxHeight={300}
                list={doctorFacilityList}
                className="mt-2 w-[95%]"
                // onChangeValue={setSelectedTypeChange}
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
              title={
                _.isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
                  ? 'Save'
                  : 'Update'
              }
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
