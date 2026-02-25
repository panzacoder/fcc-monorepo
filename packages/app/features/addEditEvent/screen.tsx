'use client'

import { useState, useEffect } from 'react'
import { View, BackHandler } from 'react-native'
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
import { useCreateEvent, useUpdateEvent } from 'app/data/events'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'
import type { EventDetailResponse } from 'app/data/events'

const schema = z.object({
  description: z.string(),
  title: z.string().min(1, { message: 'Enter event title' })
})
export type Schema = z.infer<typeof schema>
export function AddEditEventScreen() {
  const header = useAppSelector((state) => state.headerState.header)
  const createEventMutation = useCreateEvent(header)
  const updateEventMutation = useUpdateEvent(header)
  const router = useRouter()
  const item = useLocalSearchParams<{
    memberData?: string
    eventDetails?: string
    isFromCreateSimilar?: string
  }>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let eventDetails = item.eventDetails ? JSON.parse(item.eventDetails) : {}
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
  const isLoading =
    createEventMutation.isPending || updateEventMutation.isPending
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
  const [key, setKey] = useState(0)
  const [selectedDate, setSelectedDate] = useState(
    !_.isEmpty(eventDetails) && eventDetails.date
      ? eventDetails.date
      : new Date()
  )
  const onSelection = (date: Date | string) => {
    setSelectedDate(date)
    setKey(Math.random())
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
    logger.debug('handleBackButtonClick')
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
  async function setAddressObject(value: unknown, index: number) {
    if (value) {
      const str = value as string
      const obj = value as Record<string, string>
      if (index === 0) {
        selectedAddress.nickName = str
      }
      if (index === 7) {
        selectedAddress.shortDescription = str
      }
      if (index === 1) {
        selectedAddress.address.line = str
      }
      if (index === 2) {
        selectedAddress.address.city = str
      }
      if (index === 3) {
        selectedAddress.address.zipCode = str
      }
      if (index === 4) {
        selectedAddress.address.state.country.id = obj.id
        selectedAddress.address.state.country.name = obj.name
        selectedAddress.address.state.country.code = obj.code
        selectedAddress.address.state.country.namecode = obj.namecode
        selectedAddress.address.state.country.description = obj.description
      }
      if (index === 5) {
        selectedAddress.address.state.id = obj.id
        selectedAddress.address.state.name = obj.name
        selectedAddress.address.state.code = obj.code
        selectedAddress.address.state.namecode = obj.namecode
        selectedAddress.address.state.snum = obj.snum
        selectedAddress.address.state.description = obj.description
      }
      if (index === 6) {
        setSelectedAddress(value as typeof selectedAddress)
      }
    }

  }
  async function addEditEvent(formData: Schema) {
    let eventData: Record<string, unknown> = {
      date: selectedDate,
      title: formData.title,
      description: formData.description,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      location: selectedAddress,
      contactList: [],
      reminderList: []
    }
    const onSuccess = (data: EventDetailResponse | null) => {
      if (_.isEmpty(eventDetails)) {
        router.dismiss(1)
      } else {
        router.dismiss(2)
      }
      let details = data?.event ? data.event : {}
      router.push(
        formatUrl('/circles/eventDetails', {
          eventDetails: JSON.stringify(details),
          memberData: JSON.stringify(memberData)
        })
      )
    }
    if (_.isEmpty(eventDetails) || isFromCreateSimilar === 'true') {
      eventData.location.address.id = ''
      createEventMutation.mutate({ event: eventData }, { onSuccess })
    } else {
      eventData.id = eventDetails.id
      updateEventMutation.mutate({ event: eventData }, { onSuccess })
    }
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
          <View key={key} className="w-full">
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
