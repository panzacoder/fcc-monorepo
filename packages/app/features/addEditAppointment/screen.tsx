'use client'
import { isEmpty } from 'app/ui/utils'
import { useState, useEffect } from 'react'
import { Alert, View, BackHandler, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'
import { useRouter } from 'expo-router'
import {
  useAppointmentDoctors,
  useAppointmentFacilities,
  useCreateAppointment,
  useUpdateAppointment
} from 'app/data/appointments'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Feather } from 'app/ui/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { Typography } from 'app/ui/typography'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'
import type { StaticData } from 'app/data/static'
import type {
  AppointmentData,
  DoctorFacilityLocationItem
} from 'app/data/appointments/types'
import type { AppointmentPurpose } from 'app/data/types.d'
import type { DropdownItem } from 'app/ui/PtsDropdown'
const schema = z.object({
  description: z.string(),
  appointmentType: z.number().min(0, { message: 'Select Appointment Type' }),
  doctoFacilityIndex: z.number().min(0, { message: 'Select Doctor/Facility' })
})
export type Schema = z.infer<typeof schema>
type TypeResponse = {
  id: number
  type: string
}
export function AddEditAppointmentScreen() {
  const router = useRouter()
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData
  const item = useLocalSearchParams<Record<string, string>>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let doctorFacilityDetails = item.doctorFacilityDetails
    ? JSON.parse(item.doctorFacilityDetails)
    : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'

  let component = item.component ? item.component : ''
  let appointmentDetails = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  const header = useAppSelector((state) => state.headerState.header)
  const memberId = memberData.member ? memberData.member : ''
  const [selectedDate, setSelectedDate] = useState(
    appointmentDetails.date ? appointmentDetails.date : new Date()
  )
  const [key, setKey] = useState(0)
  const [isAddDoctorFacility, setIsAddDoctorFacility] = useState(false)
  const [facilityDoctorIndex, setFacilityDoctorIndex] = useState(-1)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [purpose, setPurpose] = useState(
    !isEmpty(appointmentDetails) && appointmentDetails.purpose
      ? appointmentDetails.purpose
      : ''
  )
  const [selectedDoctorFacility, setSelectedDoctorFacility] = useState<
    number | null
  >(null)
  const [doctorFacilityList, setDoctorFacilityList] = useState<
    Array<{ id: number; title: string }>
  >([])
  const [doctorFacilityListFull, setDoctorFacilityListFull] = useState<
    DoctorFacilityLocationItem[]
  >([])
  const [isShowDoctorFacilityDropdown, setIsShowDoctorFacilityDropdown] =
    useState(false)
  const [fetchDoctors, setFetchDoctors] = useState(false)
  const [fetchFacilities, setFetchFacilities] = useState(false)
  const doctorsQuery = useAppointmentDoctors(header, memberId)
  const facilitiesQuery = useAppointmentFacilities(header, memberId)
  const createAppointmentMutation = useCreateAppointment(header)
  const updateAppointmentMutation = useUpdateAppointment(header)

  const isLoading =
    (fetchDoctors && doctorsQuery.isLoading) ||
    (fetchFacilities && facilitiesQuery.isLoading) ||
    createAppointmentMutation.isPending ||
    updateAppointmentMutation.isPending

  useEffect(() => {
    const rawData = fetchDoctors
      ? doctorsQuery.data
      : fetchFacilities
        ? facilitiesQuery.data
        : null
    if (!rawData) return

    const isDoctorType = fetchDoctors
    let doctorFacilities: Array<{ id: number; title: string }> = [
      {
        id: 1,
        title: isDoctorType ? 'Add New Doctor' : 'Add New Facility'
      }
    ]
    rawData.map(({ name }: DoctorFacilityLocationItem, index: number) => {
      let object = {
        id: index + 2,
        title: name
      }
      doctorFacilities.push(object)
    })
    let list = rawData ? rawData : []
    setDoctorFacilityList(doctorFacilities)
    setDoctorFacilityListFull(list)
    setIsDataReceived(true)
    setIsAddDoctorFacility(list.length === 0)
    let facilityDoctorLocationId = -1
    if (!isEmpty(doctorFacilityDetails)) {
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

    list.map(async (data: DoctorFacilityLocationItem, index: number) => {
      if (data.locationId === facilityDoctorLocationId) {
        setFacilityDoctorIndex(index + 2)
        logger.debug('doctoFacilityIndex', String(index + 2))
        reset({
          doctoFacilityIndex: index + 2
        })
      }
    })
  }, [doctorsQuery.data, facilitiesQuery.data, fetchDoctors, fetchFacilities])
  let typeIndex: number = -1
  if (!isEmpty(appointmentDetails) && !isLoading) {
    if (
      appointmentDetails.type &&
      appointmentDetails.type.type === 'Doctor Appointment'
    ) {
      typeIndex = 1
    } else {
      typeIndex = 2
    }

    logger.debug('typeIndex', '' + typeIndex)
    logger.debug('facilityDoctorIndex', '' + facilityDoctorIndex)
  }
  if (component === 'Doctor' || component === 'Facility') {
    typeIndex = component === 'Doctor' ? 1 : 2
  }

  async function addEditAppointment(formData: Schema) {
    let appointmentData: AppointmentData = {
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
    const isCreate =
      isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
    if (!isCreate) {
      appointmentData.id = appointmentDetails.id
    }
    if (formData.doctoFacilityIndex !== 1) {
      if (selectedDoctorFacility === 1) {
        if (appointmentData.doctorLocation) {
          appointmentData.doctorLocation.id =
            doctorFacilityListFull[formData.doctoFacilityIndex - 2]?.locationId
        }
      } else {
        if (appointmentData.facilityLocation) {
          appointmentData.facilityLocation.id =
            doctorFacilityListFull[formData.doctoFacilityIndex - 2]?.locationId
        }
      }
    } else {
      Alert.alert('', 'Please Select Doctor/Facility')
      return
    }
    const mutationCallbacks = {
      onSuccess: (data: unknown) => {
        const response = data as {
          appointmentWithPreviousAppointment?: {
            appointment?: Record<string, unknown>
          }
          appointment?: Record<string, unknown>
        }
        let apptDetails = {}
        if (isEmpty(appointmentDetails)) {
          apptDetails = response?.appointmentWithPreviousAppointment
            ?.appointment
            ? response.appointmentWithPreviousAppointment.appointment
            : {}
        } else {
          if (isFromCreateSimilar === 'true') {
            apptDetails = response?.appointmentWithPreviousAppointment
              ?.appointment
              ? response.appointmentWithPreviousAppointment.appointment
              : {}
          } else {
            apptDetails = response?.appointment ? response.appointment : {}
          }
        }
        if (isEmpty(appointmentDetails)) {
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
      },
      onError: (error: Error) => {
        Alert.alert('', error.message || 'Failed to save appointment')
      }
    }
    if (isCreate) {
      createAppointmentMutation.mutate(
        { appointment: appointmentData },
        mutationCallbacks
      )
    } else {
      updateAppointmentMutation.mutate(
        { appointment: appointmentData },
        mutationCallbacks
      )
    }
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description:
        !isEmpty(appointmentDetails) && appointmentDetails.description
          ? appointmentDetails.description
          : '',
      appointmentType: typeIndex,
      doctoFacilityIndex: facilityDoctorIndex
    },
    resolver: zodResolver(schema)
  })
  const purposeList = staticData.appointmentPurposeList.map(
    (data: AppointmentPurpose, index: number) => {
      return {
        label: data.purpose
      }
    }
  )
  let typesList: Array<{ id: number; title: string }> =
    staticData.appointmentTypeList.map(
      ({ type, id }: TypeResponse, index: number) => {
        return {
          id: index + 1,
          title: type
        }
      }
    )
  const onSelection = (date: Date) => {
    setSelectedDate(date)
    setKey(Math.random())
  }
  const onSelectionPurpose = (data: string) => {
    // purpose = data
    setPurpose(data)
    logger.debug('purpose1', purpose)
  }
  async function setSelectedTypeChange(value: DropdownItem) {
    if (value) {
      const numId = Number(value.id)
      setIsShowDoctorFacilityDropdown(true)
      setSelectedDoctorFacility(numId)
      setIsDataReceived(false)
      if (numId - 1 === 0) {
        setFetchDoctors(true)
        setFetchFacilities(false)
        doctorsQuery.refetch()
      } else {
        setFetchFacilities(true)
        setFetchDoctors(false)
        facilitiesQuery.refetch()
      }
    }
  }
  async function selectedDoctorFacilityChange(value: DropdownItem) {
    if (value && !isLoading) {
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
      !isEmpty(appointmentDetails) ||
      component === 'Doctor' ||
      component === 'Facility'
    ) {
      setIsShowDoctorFacilityDropdown(true)
      setSelectedDoctorFacility(facilityDoctorIndex)
      if (typeIndex - 1 === 0) {
        setFetchDoctors(true)
        setFetchFacilities(false)
      } else {
        setFetchFacilities(true)
        setFetchDoctors(false)
      }
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
          isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
            ? 'Add Appointment'
            : 'Edit Appointment'
        }
        memberData={memberData}
      />
      <SafeAreaView>
        <ScrollView className="my-5 ">
          <View className="bg-card w-full justify-center gap-2 rounded-2xl border border-gray-400 p-5 px-4">
            <View className="mt-2 w-full items-center">
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
                  isEmpty(appointmentDetails) || isFromCreateSimilar === 'true'
                    ? 'Create'
                    : 'Save'
                }
                leadingIcon="save"
                variant="default"
                onPress={handleSubmit(addEditAppointment)}
              />
            </View>
            <View />
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
