'use client'

import { useState, useEffect, useRef } from 'react'
import { Alert, View, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { isEmpty } from 'app/ui/utils'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useCreateIncident, useUpdateIncident } from 'app/data/incidents'
import type { IncidentData, IncidentLocation } from 'app/data/incidents/types'
import type { IncidentType } from 'app/data/types'
import type { StaticData } from 'app/data/static'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
import { PtsComboBox } from 'app/ui/PtsComboBox'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'

type MemberRouteParams = {
  member?: number | string
  firstname?: string
  lastname?: string
}

const schema = z.object({
  description: z.string(),
  title: z.string().min(1, { message: 'Enter incident title' })
})
export type Schema = z.infer<typeof schema>
export function AddEditIncidentScreen() {
  const incidentTypeRef = useRef<string>('')
  const header = useAppSelector((state) => state.headerState.header)
  const router = useRouter()
  const staticData = useAppSelector(
    (state) => state.staticDataState.staticData
  ) as StaticData
  const createIncidentMutation = useCreateIncident(header)
  const updateIncidentMutation = useUpdateIncident(header)
  const item = useLocalSearchParams<Record<string, string>>()
  let memberData = item.memberData
    ? (JSON.parse(item.memberData) as MemberRouteParams)
    : ({} as MemberRouteParams)
  let isFromCreateSimilar = item.isFromCreateSimilar
    ? item.isFromCreateSimilar
    : 'false'
  const isLoading =
    createIncidentMutation.isPending || updateIncidentMutation.isPending
  const [selectedAddress, setSelectedAddress] = useState<IncidentLocation>({
    shortDescription: '',
    nickName: '',
    address: {
      line: '',
      city: '',
      zipCode: '',
      state: {
        country: {}
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
  const onSelection = (date: Date) => {
    setSelectedDate(date)
    setKey(Math.random())
  }
  if (!isEmpty(incidentDetails) && !isLoading) {
    incidentTypeRef.current = incidentDetails.type ? incidentDetails.type : ''
  }
  const incidentTypeList = staticData.incidentTypeList.map(
    (data: IncidentType, index: number) => {
      return {
        label: data.type
      }
    }
  )

  const { control, handleSubmit } = useForm({
    defaultValues: {
      description:
        !isEmpty(incidentDetails) && incidentDetails.description
          ? incidentDetails.description
          : '',
      title:
        !isEmpty(incidentDetails) && incidentDetails.title
          ? incidentDetails.title
          : ''
    },
    resolver: zodResolver(schema)
  })
  function handleBackButtonClick() {
    router.dismiss(1)
    if (isEmpty(incidentDetails)) {
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

  async function setAddressObject(value: unknown, index: number) {
    if (value) {
      const str = value as string
      const obj = value as Record<string, string | number>
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
        const state = (selectedAddress.address.state ??= {})
        const country = (state.country ??= {})
        country.id = obj.id as number
        country.name = obj.name as string
        country.code = obj.code as string
        country.namecode = obj.namecode as string
        country.isoCode = obj.isoCode as string
      }
      if (index === 5) {
        const state = (selectedAddress.address.state ??= {})
        state.id = obj.id as number
        state.name = obj.name as string
        state.code = obj.code as string
        state.namecode = obj.namecode as string
        state.snum = obj.snum as string
      }
      if (index === 6) {
        setSelectedAddress(value as IncidentLocation)
      }
      logger.debug('selectedAddress1', JSON.stringify(selectedAddress))
    }
  }
  async function addEditIncident(formData: Schema) {
    let incidentData: IncidentData = {
      date: selectedDate,
      title: formData.title,
      description: formData.description,
      type: incidentTypeRef.current,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      location: selectedAddress,
      contactList: []
    }
    if (isEmpty(incidentDetails) || isFromCreateSimilar === 'true') {
      incidentData.location.address.id = undefined
      createIncidentMutation.mutate(
        { incident: incidentData },
        {
          onSuccess: (data) => {
            let details = data?.incident ? data.incident : data
            if (isEmpty(incidentDetails)) {
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
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create incident')
          }
        }
      )
    } else {
      incidentData.id = incidentDetails.id
      updateIncidentMutation.mutate(
        { incident: incidentData },
        {
          onSuccess: (data) => {
            let details = data
            if (isEmpty(incidentDetails)) {
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
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update incident')
          }
        }
      )
    }
  }
  const onSelectionIncidentType = (data: string) => {
    incidentTypeRef.current = data
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader
        title={
          isEmpty(incidentDetails) || isFromCreateSimilar === 'true'
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
              currentData={incidentTypeRef.current}
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
              !isEmpty(incidentDetails) && incidentDetails.location
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
