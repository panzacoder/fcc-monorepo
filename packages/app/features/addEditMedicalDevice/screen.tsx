'use client'
import { useState, useEffect } from 'react'
import { Alert, View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
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
import { useLocalSearchParams } from 'expo-router'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
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
let doctorList: Array<{ id: number; title: string }> = []
export function AddEditMedicalDeviceScreen() {
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
  const [isLoading, setLoading] = useState(false)
  const [prescribedBy, setPrescribedBy] = useState('')
  const [selectedType, setSelectedType] = useState(
    medicalDeviceDetails.type ? medicalDeviceDetails.type : ''
  )
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
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }, [])

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
    // console.log('in createUpdateMedicalDevice', JSON.stringify(object))
    setLoading(true)
    let url =
      _.isEmpty(medicalDeviceDetails) || isFromCreateSimilar === 'true'
        ? `${BASE_URL}${CREATE_MEDICAL_DEVICE}`
        : `${BASE_URL}${UPDATE_MEDICAL_DEVICE}`
    let dataObject: any = {
      header: header,
      purchase: {
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
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let details = data.data.purchase ? data.data.purchase : {}
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
                  list={doctorList}
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
