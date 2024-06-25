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
import { BASE_URL, CREATE_EVENT, UPDATE_EVENT } from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
// let selectedDate: any = new Date()
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
  description: z.string(),
  title: z.string().min(1, { message: 'Enter event title' })
})
export type Schema = z.infer<typeof schema>
export function AddEditEventScreen() {
  const header = store.getState().headerState.header
  const router = useRouter()
  const item = useLocalSearchParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let eventDetails = item.eventDetails ? JSON.parse(item.eventDetails) : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
  const [isLoading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    _.isEmpty(eventDetails) && eventDetails.date
      ? eventDetails.date
      : new Date()
  )
  // console.log('eventDetails', JSON.stringify(eventDetails))
  const onSelection = (date: any) => {
    setSelectedDate(date)
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description:
        !_.isEmpty(eventDetails) && eventDetails.description
          ? eventDetails.description
          : '',
      title:
        !_.isEmpty(eventDetails) && eventDetails.title ? eventDetails.title : ''
    },
    resolver: zodResolver(schema)
  })
  function handleBackButtonClick() {
    console.log('handleBackButtonClick')
    router.dismiss(1)
    if (_.isEmpty(eventDetails)) {
      router.push(
        formatUrl('/circles/eventsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else {
      router.push(
        formatUrl('/circles/eventDetails', {
          eventDetails: JSON.stringify(eventDetails),
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
  async function addEditEvent(formData: Schema) {
    setLoading(true)
    let url = ''
    let dataObject: any = {
      header: header,
      event: {
        date: selectedDate,
        title: formData.title,
        description: formData.description,
        member: {
          id: memberData.member ? memberData.member : ''
        },
        location: selectedAddress,
        contactList: []
      }
    }
    if (_.isEmpty(eventDetails) || isFromCreateSimilar === 'true') {
      url = `${BASE_URL}${CREATE_EVENT}`
      dataObject.event.location.address.id = ''
    } else {
      url = `${BASE_URL}${UPDATE_EVENT}`
      dataObject.event.id = eventDetails.id
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          if (_.isEmpty(eventDetails)) {
            router.dismiss(1)
          } else {
            router.dismiss(2)
          }
          let details = data.data.event ? data.data.event : {}
          router.push(
            formatUrl('/circles/eventDetails', {
              eventDetails: JSON.stringify(details),
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
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          _.isEmpty(eventDetails) || isFromCreateSimilar === 'true'
            ? 'Add Event'
            : 'Edit Event Details'
        }
        memberData={{}}
      />
      <SafeAreaView>
        <ScrollView className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View className="w-full">
            <PtsDateTimePicker
              currentData={selectedDate}
              onSelection={onSelection}
            />
          </View>
          <View className="my-2 w-full flex-row justify-center">
            <ControlledTextField
              control={control}
              name="title"
              placeholder={'Title*'}
              className="bg-white"
              autoCapitalize="none"
            />
          </View>
          <View className="w-full flex-row justify-center">
            <ControlledTextField
              control={control}
              name="description"
              placeholder={'Description'}
              className="bg-white"
              autoCapitalize="none"
            />
          </View>
          <LocationDetails
            component={'AddEditEvent'}
            data={
              !_.isEmpty(eventDetails) && eventDetails.location
                ? eventDetails.location
                : {}
            }
            setAddressObject={setAddressObject}
          />
          <View className="mb-5 flex-row justify-center">
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
                _.isEmpty(eventDetails) || isFromCreateSimilar === 'true'
                  ? 'Create'
                  : 'Save'
              }
              leadingIcon="save"
              variant="default"
              onPress={handleSubmit(addEditEvent)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}
