'use client'
import { useState, useEffect, useRef } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from 'app/ui/typography'
import { useLocalSearchParams } from 'expo-router'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { CheckBox } from 'react-native-elements'
import { useAppSelector } from 'app/redux/hooks'

import { useMemberDoctors } from 'app/data/doctors'
import {
  useCreateMedicalDevice,
  useUpdateMedicalDevice
} from 'app/data/medical-devices'
const schema = z.object({
  prescriberIndex: z.number().min(0, { message: 'Type is required' }),
  description: z.string().min(1, { message: 'Required' })
})
export type Schema = z.infer<typeof schema>
export function AddEditMedicalDeviceScreen() {
  const doctorListRef = useRef<Array<{ id: number; title: string }>>([])
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
  let medicalDeviceDetails =
    item.medicalDeviceDetails !== undefined
      ? JSON.parse(item.medicalDeviceDetails)
      : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
  const [selectedDate, setSelectedDate] = useState(
    medicalDeviceDetails.date ? medicalDeviceDetails.date : new Date()
  )
  const [key, setKey] = useState(0)
  const [selectedPrescriberIndex, setSelectedPrescriberIndex] = useState(-1)
  const [doctorListFull, setDoctorListFull] = useState([]) as any
  const [prescribedBy, setPrescribedBy] = useState('')
  const [selectedType, setSelectedType] = useState(
    medicalDeviceDetails.type ? medicalDeviceDetails.type : ''
  )
  const [isPrescribed, setIsPrescribed] = useState(
    !_.isEmpty(medicalDeviceDetails)
      ? medicalDeviceDetails.isPrescribedBy
      : false
  )
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  const header = useAppSelector((state) => state.headerState.header)
  const memberId = memberData.member ? memberData.member : ''
  const doctorsQuery = useMemberDoctors(header, { memberId })
  const createMedicalDeviceMutation = useCreateMedicalDevice(header)
  const updateMedicalDeviceMutation = useUpdateMedicalDevice(header)
  useEffect(() => {
    if (doctorsQuery.data) {
      let list = (doctorsQuery.data as any).list
        ? (doctorsQuery.data as any).list
        : []
      doctorListRef.current = list.map((data: any, index: any) => {
        if (!_.isEmpty(medicalDeviceDetails)) {
          if (
            medicalDeviceDetails.doctor &&
            data.id === medicalDeviceDetails.doctor.id
          ) {
            let prescribedIndex = index + 1
            setSelectedPrescriberIndex(prescribedIndex)
            setPrescribedBy(data.doctorName)
            reset({
              prescriberIndex: prescribedIndex
            })
          }
        }
        return {
          title: data.doctorName,
          id: index + 1
        }
      })
      setDoctorListFull(list)
    }
  }, [doctorsQuery.data])

  const isLoading =
    doctorsQuery.isLoading ||
    createMedicalDeviceMutation.isPending ||
    updateMedicalDeviceMutation.isPending
  // console.log('medicalDeviceDetails', JSON.stringify(medicalDeviceDetails))
  const typesList = staticData.purchaseTypeList.map((data: any, index: any) => {
    return {
      label: data.type
    }
  })
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      prescriberIndex: !isPrescribed ? 1 : selectedPrescriberIndex,
      description:
        !_.isEmpty(medicalDeviceDetails) && medicalDeviceDetails.description
          ? medicalDeviceDetails.description
          : ''
    },
    resolver: zodResolver(schema)
  })
  async function callCreateUpdateDevice(formData: Schema) {
    let doctorId = isPrescribed
      ? doctorListFull[formData.prescriberIndex - 1].id
      : ''
    if (selectedType === '') {
      Alert.alert('', 'Select Type')
      return
    }
    let object = {
      doctorId: doctorId,
      description: formData.description,
      date: selectedDate,
      selectedType: selectedType,
      isPrescribed: isPrescribed
    }
    createUpdateMedicalDevice(object)
  }
  async function createUpdateMedicalDevice(object: any) {
    let purchaseData: any = {
      id:
        !_.isEmpty(medicalDeviceDetails) && isFromCreateSimilar !== 'true'
          ? medicalDeviceDetails.id
          : null,
      date: object.date ? object.date : '',
      description: object.description ? object.description : '',
      type: object.selectedType ? object.selectedType : '',
      isPrescribedBy: object.isPrescribed ? object.isPrescribed : false,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      doctor: {
        id: object.doctorId ? object.doctorId : ''
      }
    }
    const isCreate =
      _.isEmpty(medicalDeviceDetails) || isFromCreateSimilar === 'true'
    const mutation = isCreate
      ? createMedicalDeviceMutation
      : updateMedicalDeviceMutation
    mutation.mutate(
      { purchase: purchaseData },
      {
        onSuccess: (data: any) => {
          let details = data?.purchase ? data.purchase : {}
          if (_.isEmpty(medicalDeviceDetails)) {
            router.dismiss(1)
          } else {
            router.dismiss(2)
          }
          router.push(
            formatUrl('/circles/medicalDeviceDetails', {
              medicalDevicesDetails: JSON.stringify(details),
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to save medical device')
        }
      }
    )
  }
  const onSelectionType = (data: any) => {
    setSelectedType(data)
    // console.log('purpose1', purpose)
  }
  const onSelection = (date: any) => {
    setSelectedDate(date)
    setKey(Math.random())
  }
  async function setPrescriberChange(value: any) {
    if (value === null) {
      reset({
        prescriberIndex: -1
      })
    }
  }
  return (
    <View key={key} className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          _.isEmpty(medicalDeviceDetails)
            ? 'Add Medical Device'
            : 'Edit Medical Device'
        }
        memberData={{}}
      />
      <SafeAreaView>
        <ScrollView className=" my-2 max-h-[90%] w-full self-center rounded-[15px] border-[1px] border-gray-400 bg-white py-2 ">
          <View className="my-2 w-full">
            <View className="w-[95%] self-center">
              <PtsDateTimePicker
                currentData={selectedDate}
                onSelection={onSelection}
              />
            </View>
            <View className="my-2 w-full justify-center ">
              <View className="mt-2 w-[95%] self-center">
                <PtsComboBox
                  currentData={selectedType}
                  listData={typesList}
                  onSelection={onSelectionType}
                  placeholderValue={'Type*'}
                />
              </View>
              <View className="m-[-5px] ml-[10px] w-full flex-row items-center">
                <Typography className="">
                  {'Is It Prescribed by Doctor? '}
                </Typography>
                <CheckBox
                  checked={isPrescribed}
                  checkedColor={'#6493d9'}
                  onPress={() => {
                    setIsPrescribed(!isPrescribed)
                    reset({
                      prescriberIndex: isPrescribed ? 1 : -1
                    })
                  }}
                  className=""
                />
              </View>
              {isPrescribed ? (
                <ControlledDropdown
                  control={control}
                  name="prescriberIndex"
                  label="Prescribed By*"
                  maxHeight={300}
                  list={doctorListRef.current}
                  className="w-[95%] self-center"
                  defaultValue={
                    !_.isEmpty(medicalDeviceDetails) ? prescribedBy : ''
                  }
                  // onChangeValue={setPrescriberChange}
                />
              ) : (
                <View />
              )}

              <ControlledTextField
                control={control}
                name="description"
                placeholder={'Description*'}
                className="w-[95%] self-center bg-white"
                autoCapitalize="none"
              />
            </View>

            <View className="my-2 mt-5 flex-row justify-center">
              <Button
                className="bg-[#86939e]"
                title="Cancel"
                leadingIcon="x"
                variant="default"
                onPress={() => {
                  router.back()
                }}
              />
              <Button
                className="ml-5"
                title={_.isEmpty(medicalDeviceDetails) ? 'Create' : 'Save'}
                variant="default"
                leadingIcon="save"
                onPress={handleSubmit(callCreateUpdateDevice)}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
