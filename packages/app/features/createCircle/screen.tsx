'use client'

import { useState, useEffect, useRef } from 'react'
import { View, Alert, Platform } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { useAppSelector } from 'app/redux/hooks'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  FIND_CIRCLE,
  JOIN_CIRCLE,
  CREATE_CIRCLE,
  CREATE_CIRCLE_NO_EMAIL
} from 'app/utils/urlConstants'
import { Feather } from 'app/ui/icons'
import { LocationDetails } from 'app/ui/locationDetails'
import { Button } from 'app/ui/button'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import * as Contacts from 'expo-contacts'
const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().optional()
})
const emailSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' })
})
export type Schema = z.infer<typeof schema>
export function CreateCircleScreen() {
  const emailRef = useRef('')
  const fullNameRef = useRef('')
  const timeZoneIdRef = useRef('')
  const selectedAddressRef = useRef<any>({
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
  const [isLoading, setLoading] = useState(false)
  const [isShowBackView, setIsShowBackView] = useState(true)
  const [isCircleExists, setIsCircleExists] = useState(false)
  const [isShowMemberModal, setIsShowMemberModal] = useState(false)
  const [isShowCaregiverModal, setIsShowCaregiverModal] = useState(false)
  const [
    isShowCaregiverModalWithoutEmail,
    setIsShowCaregiverModalWithoutEmail
  ] = useState(false)
  const [circleDetails, setCircleDetails] = useState({}) as any
  const [isYesNoClicked, setIsYesNoClicked] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const header = useAppSelector((state) => state.headerState.header)
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
        selectedAddressRef.current.nickName = value
      }
      if (index === 7) {
        selectedAddressRef.current.shortDescription = value
      }
      if (index === 1) {
        selectedAddressRef.current.address.line = value
      }
      if (index === 2) {
        selectedAddressRef.current.address.city = value
      }
      if (index === 3) {
        selectedAddressRef.current.address.zipCode = value
      }
      if (index === 4) {
        selectedAddressRef.current.address.state.country.id = value.id
        selectedAddressRef.current.address.state.country.name = value.name
        selectedAddressRef.current.address.state.country.code = value.code
        selectedAddressRef.current.address.state.country.namecode =
          value.namecode
        selectedAddressRef.current.address.state.country.snum = value.snum
        selectedAddressRef.current.address.state.country.description =
          value.description
      }
      if (index === 5) {
        selectedAddressRef.current.address.state.id = value.id
        selectedAddressRef.current.address.state.name = value.name
        selectedAddressRef.current.address.state.code = value.code
        selectedAddressRef.current.address.state.namecode = value.namecode
        selectedAddressRef.current.address.state.snum = value.snum
        selectedAddressRef.current.address.state.description = value.description
      }
      if (index === 6) {
        selectedAddressRef.current = value
      }
      if (index === 8) {
        timeZoneIdRef.current = value.id
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
          logger.debug('data', JSON.stringify(data))
          setIsCircleExists(data.data !== null ? true : false)
          setCircleDetails(data.data !== null ? data.data : {})
          if (data.data !== null) {
            reset({
              firstName: data.data.firstName ? data.data.firstName : '',
              lastName: data.data.lastName ? data.data.lastName : ''
            })
          }
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  async function sendRequest(formData: Schema) {
    setLoading(true)
    let url = `${BASE_URL}${JOIN_CIRCLE}`
    let dataObject: any = {
      header: header
    }
    if (isCircleExists) {
      dataObject.memberVo = {
        id: circleDetails.id ? circleDetails.id : ''
      }
    } else {
      dataObject.memberVo = {
        id: '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: emailRef.current,
        address: selectedAddressRef.current.address
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          fullNameRef.current = formData.firstName + ' ' + formData.lastName
          setIsShowBackView(false)
          setIsShowMemberModal(true)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  async function createCircle(formData: Schema) {
    setLoading(true)
    let url = ''
    url = isYesNoClicked
      ? `${BASE_URL}${CREATE_CIRCLE}`
      : `${BASE_URL}${CREATE_CIRCLE_NO_EMAIL}`
    selectedAddressRef.current.address.timezone = {
      id: timeZoneIdRef.current
    }
    let dataObject = {
      header: header,
      memberVo: {
        id: '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: isYesNoClicked ? emailRef.current : null,
        address: selectedAddressRef.current.address
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          fullNameRef.current = formData.firstName + ' ' + formData.lastName
          setIsShowBackView(false)
          if (isYesNoClicked) {
            setIsShowCaregiverModal(true)
          } else {
            setIsShowCaregiverModalWithoutEmail(true)
          }
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  const showMemberModal = () => {
    return (
      <View className="my-2 h-full w-full flex-1 self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <ScrollView>
          <Typography className="m-2">
            {'A Family Care Circle request has been sent to '}

            <Typography className="text-primary font-bold">
              {emailRef.current + '.'}
            </Typography>
            <Typography>
              {'Due to the security reasons, we will need to wait for '}
            </Typography>
            <Typography className="text-primary font-bold">
              {fullNameRef.current}
            </Typography>
            <Typography className="">
              {' to register and accept the invite to become a member.\n\n'}
            </Typography>
            <Typography className="">{'Please reach out to '}</Typography>

            <Typography className="text-primary font-bold">
              {fullNameRef.current}
            </Typography>
            <Typography className="">
              {
                ' and help them through this process. Once they have registered and accepted, as an administrator you will be able to add other Family Members to the Circle or begin to track doctor appointments immediately. You may also wish to add any historical notes about previous appointments.\n\n'
              }
            </Typography>
            <Typography className="">{'While you wait for '}</Typography>
            <Typography className="text-primary font-bold">
              {fullNameRef.current}
            </Typography>
            <Typography className="">
              {
                ' to accept the request, you can create a Family Care Circle for yourself or start a request to create a Family Care Circle for another loved one.'
              }
            </Typography>
          </Typography>
        </ScrollView>
        <View className="my-1 flex-row self-center">
          <Button
            className="my-1 ml-5 w-[20%] bg-[#86939e]"
            title={'Ok'}
            variant="default"
            onPress={() => {
              router.dismissAll()
              router.replace('/circles')
            }}
          />
        </View>
      </View>
    )
  }
  const shwoCaregiverModal = () => {
    return (
      <View className="my-2 h-full w-full flex-1 self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <ScrollView>
          <Typography className="m-2">
            {
              'As the Authorized Care Giver, you will have administrative rights to govern all activity associated with the creation of the Family Care Circle. FCC understands the sensitive nature of this information and with your help, this information will only be shared with the caregivers you approve on behalf of '
            }

            <Typography className="text-primary font-bold">
              {fullNameRef.current + '.'}
            </Typography>
            <Typography>{'\n\nWe have also sent a message to '}</Typography>
            <Typography className="text-primary font-bold">
              {emailRef.current}
            </Typography>
            <Typography className="">
              {
                ' suggesting they register to help establish the information to build the best Family Care Circle.\n'
              }
            </Typography>
            <Typography className="text-primary font-bold">
              {'Welcome to Family Care Circle.'}
            </Typography>
          </Typography>
        </ScrollView>
        <View className="my-1 flex-row self-center">
          <Button
            className="my-1 ml-5 w-[20%] bg-[#86939e]"
            title={'Ok'}
            variant="default"
            onPress={() => {
              router.dismissAll()
              router.replace('/circles')
            }}
          />
        </View>
      </View>
    )
  }
  const shwoCaregiverModalWithoutEmail = () => {
    return (
      <View className="my-2 h-full w-full flex-1 self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <ScrollView>
          <Typography className="m-2">
            {
              'As the Authorized Care Giver, you will have administrative rights to govern all activity associated with the creation of the Family Care Circle. FCC understands the sensitive nature of this information and with your help, this information will only be shared with the caregivers you approve on behalf of '
            }

            <Typography className="text-primary font-bold">
              {fullNameRef.current + '.'}
            </Typography>
          </Typography>
        </ScrollView>
        <View className="my-1 flex-row self-center">
          <Button
            className="my-1 ml-5 w-[20%] bg-[#86939e]"
            title={'Ok'}
            variant="default"
            onPress={() => {
              router.dismissAll()
              router.replace('/circles')
            }}
          />
        </View>
      </View>
    )
  }
  async function getContactsList() {
    // setLoading(true)
    logger.debug('getContactsList')
    const { status } = await Contacts.requestPermissionsAsync()
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails]
      })
      logger.debug('data', data)
      if (data.length > 0) {
        const contact = data[0]
        Alert.alert('contact', JSON.stringify(contact))
      }
    }
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="h-full w-full flex-1 py-2 ">
        <SafeAreaView>
          {isShowBackView ? (
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
                                emailRef.current = text
                              }}
                              onBlur={() => {
                                if (emailRef.current !== '') {
                                  findCircle(emailRef.current)
                                }
                              }}
                            />
                          ) : (
                            <View />
                          )}
                        </View>
                        <View className="flex-row">
                          <ControlledTextField
                            control={control}
                            name="phone"
                            placeholder="Phone"
                            className="flex-1"
                          />
                          <Feather
                            onPress={() => {
                              getContactsList()
                            }}
                            className="ml-2 mt-5 self-center"
                            name={'book'}
                            size={20}
                            color={'#1a7088'}
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
                        onPress={handleSubmit(sendRequest)}
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
          ) : (
            <View />
          )}
        </SafeAreaView>
      </View>
      {isShowMemberModal ? (
        <View className="absolute top-[30] w-[95%] flex-1 self-center">
          {showMemberModal()}
        </View>
      ) : (
        <View />
      )}
      {isShowCaregiverModal ? (
        <View className="absolute top-[30] w-[95%] flex-1 self-center">
          {shwoCaregiverModal()}
        </View>
      ) : (
        <View />
      )}
      {isShowCaregiverModalWithoutEmail ? (
        <View className="absolute top-[30] w-[95%] flex-1 self-center">
          {shwoCaregiverModalWithoutEmail()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
