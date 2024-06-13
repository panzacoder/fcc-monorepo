'use client'
import { useState, useEffect } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  BASE_URL,
  CREATE_MEDICAL_DEVICE,
  GET_MEMBER_DOCTORS,
  UPDATE_MEDICAL_DEVICE
} from 'app/utils/urlConstants'
import { CallPostService } from 'app/utils/fetchServerData'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from 'app/ui/typography'
import { useParams } from 'solito/navigation'
import PtsLoader from 'app/ui/PtsLoader'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { CheckBox } from 'react-native-elements'
const schema = z.object({
  prescriberIndex: z.number().min(0, { message: 'Type is required' }),
  description: z.string().min(1, { message: 'Required' })
})
export type Schema = z.infer<typeof schema>
let prescribedBy: any = ''
let selectedType: any = ''
let selectedDate: any = new Date()
let selectedPrescriberIndex: any = -1
let doctorList: Array<{ id: number; title: string }> = []
export function AddEditMedicalDeviceScreen() {
  const item = useParams<any>()
  const router = useRouter()
  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
  let medicalDeviceDetails =
    item.medicalDeviceDetails !== undefined
      ? JSON.parse(item.medicalDeviceDetails)
      : {}

  const [doctorListFull, setDoctorListFull] = useState([]) as any
  const [isLoading, setLoading] = useState(false)
  const [isPrescribed, setIsPrescribed] = useState(
    !_.isEmpty(medicalDeviceDetails)
      ? medicalDeviceDetails.isPrescribedBy
      : false
  )

  const staticData: any = store.getState().staticDataState.staticData
  const header = store.getState().headerState.header
  useEffect(() => {
    let url = `${BASE_URL}${GET_MEMBER_DOCTORS}`
    let dataObject = {
      header: header,
      doctor: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let list = data.data.list ? data.data.list : []
          doctorList = list.map((data: any, index: any) => {
            if (!_.isEmpty(medicalDeviceDetails)) {
              if (
                medicalDeviceDetails.doctor &&
                data.id === medicalDeviceDetails.doctor.id
              ) {
                selectedPrescriberIndex = index + 1
                prescribedBy = data.doctorName
                reset({
                  prescriberIndex: selectedPrescriberIndex
                })
              }
            }
            return {
              title: data.doctorName,
              id: index + 1
            }
          })

          setDoctorListFull(list)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }, [])

  // console.log('medicalDeviceDetails', JSON.stringify(medicalDeviceDetails))
  if (!_.isEmpty(medicalDeviceDetails)) {
    selectedType = medicalDeviceDetails.type ? medicalDeviceDetails.type : ''
    selectedDate = medicalDeviceDetails.date ? medicalDeviceDetails.date : ''
  }
  const typesList = staticData.purchaseTypeList.map((data: any, index: any) => {
    return {
      label: data.type
    }
  })
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      prescriberIndex: selectedPrescriberIndex,
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
    // console.log('in createUpdateMedicalDevice', JSON.stringify(object))
    setLoading(true)
    let url = _.isEmpty(medicalDeviceDetails)
      ? `${BASE_URL}${CREATE_MEDICAL_DEVICE}`
      : `${BASE_URL}${UPDATE_MEDICAL_DEVICE}`
    let dataObject: any = {
      header: header,
      purchase: {
        id: !_.isEmpty(medicalDeviceDetails) ? medicalDeviceDetails.id : null,
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
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  const onSelectionType = (data: any) => {
    selectedType = data
    // console.log('purpose1', purpose)
  }
  const onSelection = (date: any) => {
    selectedDate = date
  }
  async function setPrescriberChange(value: any) {
    if (value === null) {
      reset({
        prescriberIndex: -1
      })
    }
  }
  return (
    <ScrollView className=" my-2 max-h-[70%] w-full self-center rounded-[15px] border-[1px] border-gray-400 bg-white py-2 ">
      <PtsLoader loading={isLoading} />
      <View className="my-2 w-full">
        <View className="w-[95%] self-center">
          <PtsDateTimePicker
            currentData={
              medicalDeviceDetails.date ? medicalDeviceDetails.date : new Date()
            }
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
              list={doctorList}
              className="w-[95%] self-center"
              defaultValue={
                !_.isEmpty(medicalDeviceDetails) ? prescribedBy : ''
              }
              onChangeValue={setPrescriberChange}
            />
          ) : (
            <View />
          )}

          <ControlledTextField
            control={control}
            name="description"
            placeholder={'Description*'}
            className="mt-2 w-[95%] self-center bg-white"
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
  )
}
