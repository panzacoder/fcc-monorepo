'use client'

import { useState, useEffect } from 'react'
import { Alert, View, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import _ from 'lodash'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CREATE_INCIDENT,
  UPDATE_INCIDENT
} from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
import { PtsComboBox } from 'app/ui/PtsComboBox'
let incidentType: any = ''
const schema = z.object({
  description: z.string(),
  title: z.string().min(1, { message: 'Enter incident title' })
})
export type Schema = z.infer<typeof schema>
export function AddEditIncidentScreen() {
  const header = store.getState().headerState.header
  const router = useRouter()
  const staticData: any = store.getState().staticDataState.staticData
  const item = useLocalSearchParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
  const [isLoading, setLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState({
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
  })
  let incidentDetails = item.incidentDetails
    ? JSON.parse(item.incidentDetails)
    : {}
  const [selectedDate, setSelectedDate] = useState(
    incidentDetails.date ? incidentDetails.date : new Date()
  )
  const [key, setKey] = useState(0)
  // console.log('incidentDetails', JSON.stringify(incidentDetails))
  const onSelection = (date: any) => {
    setSelectedDate(date)
    setKey(Math.random())
  }
  if (!_.isEmpty(incidentDetails) && !isLoading) {
    incidentType = incidentDetails.type ? incidentDetails.type : ''
  }
  const incidentTypeList = staticData.incidentTypeList.map(
    (data: any, index: any) => {
      return {
        label: data.type
      }
    }
  )

  const { control, handleSubmit } = useForm({
    defaultValues: {
      description:
        !_.isEmpty(incidentDetails) && incidentDetails.description
          ? incidentDetails.description
          : '',
      title:
        !_.isEmpty(incidentDetails) && incidentDetails.title
          ? incidentDetails.title
          : ''
    },
    resolver: zodResolver(schema)
  })
  function handleBackButtonClick() {
    router.dismiss(1)
    if (_.isEmpty(incidentDetails)) {
      router.push(
        formatUrl('/circles/incidentsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else {
      router.replace(
        formatUrl('/circles/incidentDetails', {
          incidentDetails: JSON.stringify(incidentDetails),
          memberData: JSON.stringify(memberData)
        })
      )
    }

    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])

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
        // selectedAddress = value
        setSelectedAddress(value)
      }
      // console.log('value', JSON.stringify(value))
      // console.log('index', JSON.stringify(index))
      console.log('selectedAddress1', JSON.stringify(selectedAddress))
    }
  }
  async function addEditIncident(formData: Schema) {
    setLoading(true)
    let url = ''

    let dataObject: any = {
      header: header,
      incident: {
        date: selectedDate,
        title: formData.title,
        description: formData.description,
        type: incidentType,
        member: {
          id: memberData.member ? memberData.member : ''
        },
        location: selectedAddress,
        contactList: []
      }
    }
    if (_.isEmpty(incidentDetails) || isFromCreateSimilar === 'true') {
      url = `${BASE_URL}${CREATE_INCIDENT}`
      dataObject.incident.location.address.id = ''
    } else {
      url = `${BASE_URL}${UPDATE_INCIDENT}`
      dataObject.incident.id = incidentDetails.id
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          //   console.log('addEditIncident', JSON.stringify(data.data))
          let details =
            _.isEmpty(incidentDetails) || isFromCreateSimilar === 'true'
              ? data.data.incident
              : data.data
          if (_.isEmpty(incidentDetails)) {
            router.dismiss(1)
          } else {
            router.dismiss(2)
          }
          router.push(
            formatUrl('/circles/incidentDetails', {
              incidentDetails: JSON.stringify(details),
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
        console.log(error)
      })
  }
  const onSelectionIncidentType = (data: any) => {
    incidentType = data
    // console.log('purpose1', purpose)
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          _.isEmpty(incidentDetails) || isFromCreateSimilar === 'true'
            ? 'Add Incident'
            : 'Edit Incident Details'
        }
        memberData={{}}
      />
      <SafeAreaView>
        <ScrollView className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View key={key} className="w-full self-center">
            <PtsDateTimePicker
              currentData={selectedDate}
              onSelection={onSelection}
            />
          </View>
          <View className="mt-2 w-full self-center">
            <PtsComboBox
              currentData={incidentType}
              listData={incidentTypeList}
              onSelection={onSelectionIncidentType}
              placeholderValue={'Incident Type'}
            />
          </View>
          <View className="my-2 w-full flex-row self-center">
            <ControlledTextField
              control={control}
              name="title"
              placeholder={'Title*'}
              className="w-full bg-white"
              autoCapitalize="none"
            />
          </View>
          <View className="w-full flex-row self-center">
            <ControlledTextField
              control={control}
              name="description"
              placeholder={'Description'}
              className="w-full bg-white"
              autoCapitalize="none"
            />
          </View>
          <LocationDetails
            component={'AddEditIncident'}
            data={
              !_.isEmpty(incidentDetails) && incidentDetails.location
                ? incidentDetails.location
                : {}
            }
            setAddressObject={setAddressObject}
          />
          <View className="my-2 mb-5 flex-row justify-center">
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
              title={'Save'}
              leadingIcon="save"
              variant="default"
              onPress={handleSubmit(addEditIncident)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
