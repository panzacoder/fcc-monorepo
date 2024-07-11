'use client'

import { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  FIND_CIRCLE,
  JOIN_CIRCLE,
  CREATE_CIRCLE,
  CREATE_CIRCLE_NO_EMAIL
} from 'app/utils/urlConstants'
import { LocationDetails } from 'app/ui/locationDetails'
import { Button } from 'app/ui/button'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().optional()
})
const emailSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' })
})
let email = ''
let timeZoneId = ''
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
export type Schema = z.infer<typeof schema>
export function CreateCircleScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isCircleExists, setIsCircleExists] = useState(false)
  const [circleDetails, setCircleDetails] = useState({}) as any
  const [isYesNoClicked, setIsYesNoClicked] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const header = store.getState().headerState.header
  const router = useRouter()

  useEffect(() => {}, [])
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    resolver: zodResolver(schema)
  })
  const { control: contro1, reset: reset1 } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(emailSchema)
  })
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
      if (index === 8) {
        timeZoneId = value.id
      }
    }

    // console.log('selectedAddress', JSON.stringify(selectedAddress))
  }
  async function findCircle(email: any) {
    setLoading(true)
    let url = `${BASE_URL}${FIND_CIRCLE}`
    let dataObject = {
      header: header,
      member: {
        email: email
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          console.log('data', JSON.stringify(data))
          setIsCircleExists(data.data !== null ? true : false)
          setCircleDetails(data.data !== null ? data.data : {})
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function sendRequest() {
    setLoading(true)
    let url = `${BASE_URL}${JOIN_CIRCLE}`
    let dataObject = {
      header: header,
      memberVo: {
        id: circleDetails.id ? circleDetails.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.dismissAll()
          router.replace('/circles')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function createCircle(formData: Schema) {
    setLoading(true)
    let url = ''
    url = isYesNoClicked
      ? `${BASE_URL}${CREATE_CIRCLE}`
      : `${BASE_URL}${CREATE_CIRCLE_NO_EMAIL}`
    selectedAddress.address.timezone = {
      id: timeZoneId
    }
    let dataObject = {
      header: header,
      memberVo: {
        id: '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: isYesNoClicked ? email : null,
        address: selectedAddress.address
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.dismissAll()
          router.replace('/circles')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="h-full w-full flex-1 py-2 ">
        <SafeAreaView>
          <ScrollView className="">
            <Typography
              variant="h1"
              className="bg-accent text-accent-foreground w-full py-4 text-center"
            >
              {'Create A Circle'}
            </Typography>

            <View className="ml-1 flex h-[95%] items-start self-center">
              <View className="items-center gap-2 pb-2 ">
                <Typography className="font-400 mt-2 w-[95%]">
                  {
                    'Creating a circle with an email address allows the member to be an active participant in the circle. If no email is available, you will represent the member as the authorized caregiver. At any point, you will have the ability to add an email address by updating the member’s profile.'
                  }
                </Typography>
                <Typography className="mt-2 w-[95%] font-bold">
                  {
                    'Does your loved one or friend (future FCC member) have an email address?'
                  }
                </Typography>
              </View>
              <View className="mt-2 flex-row justify-center self-center">
                <Button
                  className={`rounded-[10px] px-5 ${isYesNoClicked && !isFirstTime ? 'bg-[#ef6603]' : 'bg-[#86939e]'}`}
                  title={'Yes'}
                  variant="default"
                  onPress={() => {
                    reset1({
                      email: ''
                    })
                    setIsFirstTime(false)
                    setIsYesNoClicked(true)
                  }}
                />
                <Button
                  className={`ml-5 rounded-[10px] px-5 ${!isYesNoClicked && !isFirstTime ? 'bg-[#ef6603]' : 'bg-[#86939e]'}`}
                  title={'No'}
                  variant="default"
                  onPress={() => {
                    reset1({
                      email: 'default'
                    })
                    setIsFirstTime(false)
                    setIsYesNoClicked(false)
                    setCircleDetails({})
                    setIsCircleExists(false)
                  }}
                />
              </View>
              {!isFirstTime ? (
                <View className="flex-1">
                  <Typography className="text-primary ml-1 mt-2 font-bold">
                    {'Member Details'}
                  </Typography>
                  {!isCircleExists ? (
                    <View>
                      <View className="mt-2 w-full flex-row gap-2">
                        {isYesNoClicked ? (
                          <ControlledTextField
                            control={contro1}
                            name="email"
                            placeholder={'Email*'}
                            autoCapitalize="none"
                            className="flex-1"
                            onChangeText={(text) => {
                              email = text
                            }}
                            onBlur={() => {
                              if (email !== '') {
                                findCircle(email)
                              }
                            }}
                          />
                        ) : (
                          <View />
                        )}

                        <ControlledTextField
                          control={control}
                          name="phone"
                          placeholder="Phone"
                          className="flex-1"
                        />
                      </View>
                      <View className="mt-2 w-full flex-row gap-2">
                        <ControlledTextField
                          control={control}
                          name="firstName"
                          placeholder={'First Name*'}
                          className="flex-1"
                        />
                        <ControlledTextField
                          control={control}
                          name="lastName"
                          placeholder="Last Name*"
                          className="flex-1"
                        />
                      </View>
                      <Typography className="text-primary ml-1 mt-2 font-bold">
                        {'Address'}
                      </Typography>
                      <View className="flex-1">
                        <LocationDetails
                          component={'CreateCircle'}
                          data={{}}
                          setAddressObject={setAddressObject}
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View className="mt-2 flex-row">
                        <Typography className="w-[25%] font-bold">
                          {'Name'}
                        </Typography>
                        <Typography className="font-400 max-w-[70%]">{`${circleDetails.firstName ? circleDetails.firstName : ''} ${circleDetails.lastName ? circleDetails.lastName : ''}`}</Typography>
                      </View>
                      <View className="mt-2 flex-row">
                        <Typography className="w-[25%] font-bold">
                          {'Email'}
                        </Typography>
                        <Typography className="font-400 max-w-[70%]">{`${circleDetails.email ? circleDetails.email : ''}`}</Typography>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View />
              )}
              {!isFirstTime ? (
                <View className="mb-10 flex-1 self-center">
                  {!isCircleExists || !isYesNoClicked ? (
                    <Button
                      className={`rounded-[10px] bg-[#5ACC6C] px-1`}
                      title={'I am an authorized caregiver'}
                      variant="default"
                      onPress={handleSubmit(createCircle)}
                    />
                  ) : (
                    <View />
                  )}

                  {isYesNoClicked ? (
                    <Button
                      className={`mt-4 rounded-[10px] bg-[#ef6603] px-1 `}
                      title={'Send request to member'}
                      variant="default"
                      onPress={() => {
                        sendRequest()
                      }}
                    />
                  ) : (
                    <View />
                  )}

                  <Button
                    className={`my-4 rounded-[10px] bg-[#86939e] px-1`}
                    title={'Cancel'}
                    variant="default"
                    onPress={() => {
                      router.dismissAll()
                      router.replace('/circles')
                    }}
                  />
                </View>
              ) : (
                <View />
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  )
}
