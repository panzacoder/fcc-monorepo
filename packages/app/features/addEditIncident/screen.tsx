'use client'

import { useState } from 'react'
import { Alert, View, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import _ from 'lodash'
import { Typography } from 'app/ui/typography'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, CREATE_EVENT, UPDATE_EVENT } from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
let selectedDate: any = new Date()
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
export function AddEditIncidentScreen() {
  const header = store.getState().headerState.header
  const router = useRouter()
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const [isLoading, setLoading] = useState(false)
  let incidentDetails = item.incidentDetails ? JSON.parse(item.incidentDetails) : {}
  console.log('incidentDetails', JSON.stringify(incidentDetails))
  const onSelection = (date: any) => {
    selectedDate = date
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description:
        !_.isEmpty(incidentDetails) && incidentDetails.description
          ? incidentDetails.description
          : '',
      title:
        !_.isEmpty(incidentDetails) && incidentDetails.title ? incidentDetails.title : ''
    },
    resolver: zodResolver(schema)
  })
  async function setAddressObject(value: any, index: any) {
    if (index === 0) {
      selectedAddress.shortDescription = value
      selectedAddress.nickName = value
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
    // console.log('selectedAddress', JSON.stringify(selectedAddress))
  }
  async function addEditEvent(formData: Schema) {
    setLoading(true)
    let url = ''

    let dataObject = {
      header: header,
      event: {
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
    }
    if (_.isEmpty(incidentDetails)) {
      url = `${BASE_URL}${CREATE_EVENT}`
    } else {
      url = `${BASE_URL}${UPDATE_EVENT}`
      dataObject.event.id = incidentDetails.id
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          //   console.log('addEditEvent', JSON.stringify(data.data))
          router.replace(
            formatUrl('/circles/incidentDetails', {
              incidentDetails: JSON.stringify(data.data.event),
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
      <ScrollView className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
        <View className="w-full">
          <PtsDateTimePicker
            currentData={incidentDetails.date ? incidentDetails.date : new Date()}
            onSelection={onSelection}
          />
        </View>
        <View className="my-2 w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="title"
            placeholder={'Title*'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>
        <View className="w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="description"
            placeholder={'Description'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>
        <LocationDetails
          data={
            !_.isEmpty(incidentDetails) && incidentDetails.location
              ? incidentDetails.location
              : {}
          }
          setAddressObject={setAddressObject}
        />
        <View className="my-2 mb-5 flex-row justify-center">
          <Button
            className="bg-[#287CFA]"
            title={'Save'}
            leadingIcon="save"
            variant="default"
            onPress={handleSubmit(addEditEvent)}
          />
        </View>
      </ScrollView>
    </View>
  )
}
