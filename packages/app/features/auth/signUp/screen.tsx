'use client'

import { Component, useState } from 'react'
import { View, Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { Button } from 'app/ui/button'
import { BASE_URL, CREATE_ACCOUNT } from 'app/utils/urlConstants'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import { useRouter } from 'expo-router'
import { CardHeader } from '../card-header'
import { CardView } from 'app/ui/layouts/card-view'
import { PrivacyPolicy } from 'app/ui/privacyPolicy'
import { TermsAndConditions } from 'app/ui/termsAndConditions'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  removeAllSpecialCharFromString
} from 'app/ui/utils'
import { CheckBox } from 'react-native-elements'
import { formatUrl } from 'app/utils/format-url'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
import { logger } from 'app/utils/logger'
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
        name: 'India',
        code: '',
        namecode: '',
        isoCode: '',
        description: '',
        id: ''
      }
    }
  }
}
const schema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(20, { message: 'Password can be max 20 characters' })
      .regex(/[0-9]/g, { message: 'Password must contain a number' })
      .regex(/[!,@,#,$,%,^,&,*]/g, {
        message: 'Password must contain a special character !@#$%^&*'
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm new password' }),
    acceptTc: z.boolean()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must match',
        path: ['confirmPassword']
      })
    }
  })
const phoneSchema = z.object({
  phone: z.string()
})
type Schema = z.infer<typeof schema>

export function SignUpScreen() {
  let userPhone = ''
  const [isLoading, setLoading] = useState(false)
  const [timeZone, setTimeZone] = useState('')
  const [address, setAddress] = useState({})
  const [isShowPrivacyPolicy, setIsShowPrivacyPolicy] = useState(false)
  const [isShowTerms, setIsShowTerms] = useState(false)
  const [isHideSignUpView, setIsHideSignUpView] = useState(false)
  const [isFirstTimeView, setIsFirstTimeView] = useState(true)
  const [isTandCAccepted, setIsTandCAccepted] = useState(false)

  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema)
  })
  const router = useRouter()
  const { control, handleSubmit, reset, setFocus } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTc: false
    },
    resolver: zodResolver(schema)
  })
  const { control: control1, reset: reset1 } = useForm({
    defaultValues: {
      phone: ''
    },
    resolver: zodResolver(phoneSchema)
  })
  async function submitRegistration(formData: Schema) {
    if (selectedAddress.address.state.id === '') {
      Alert.alert('', 'Please select State')
      return
    }
    const url = `${BASE_URL}${CREATE_ACCOUNT}`
    const dataObject = {
      registration: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: removeAllSpecialCharFromString(userPhone),
        email: formData.email,
        credential: formData.password,
        userTimezone: timeZone,
        referralCode: '',
        address: {
          state: {
            id: selectedAddress.address.state.id
          }
        }
      }
    }
    setLoading(true)
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.push(formatUrl('/verification', { email: formData.email }))
        } else if (data.errorCode === 'RVF_101') {
          Alert.alert('', 'Please check your email for verification code')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        Alert.alert('', error)
        logger.debug(error)
      })
  }
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
        let tz = value.name ? value.name : ''
        setTimeZone(tz)
        logger.debug('timeZone', tz)
      }
    }
    setAddress(selectedAddress)
    // console.log('selectedAddress', JSON.stringify(selectedAddress))
  }
  async function acceptNewRequest(data: any) {}
  const cancelClicked = (address: any) => {
    setAddress(address)
    setIsShowPrivacyPolicy(false)
    setIsShowTerms(false)
    setIsHideSignUpView(false)
  }
  return (
    <View className="flex-1">
      {!isHideSignUpView || isFirstTimeView ? (
        <CardView scroll>
          <CardHeader
            actionSlot={
              <View className="flex flex-1 flex-col items-end">
                <Typography className="text-right">
                  {'Already a member?'}
                </Typography>
                <Button
                  title="Log in"
                  variant="link"
                  onPress={() => {
                    router.push('/login')
                  }}
                  className="p-0"
                />
              </View>
            }
          />

          <PtsLoader loading={isLoading} />
          <View className="my-5 flex flex-shrink justify-end gap-y-4">
            <View className="flex w-full gap-2">
              <View className="flex w-full flex-row justify-between gap-2">
                <ControlledTextField
                  name="firstName"
                  control={control}
                  className="flex-1"
                  placeholder={'First Name*'}
                  onSubmitEditing={() => {
                    setFocus('lastName')
                  }}
                />
                <ControlledTextField
                  name="lastName"
                  control={control}
                  className="flex-1"
                  placeholder={'Last Name*'}
                  onSubmitEditing={() => {
                    setFocus('email')
                  }}
                />
              </View>
              <ControlledTextField
                name="email"
                control={control}
                placeholder={'Email Address*'}
                autoCapitalize="none"
                onSubmitEditing={() => {
                  setFocus('phone')
                }}
              />
              <ControlledTextField
                name="phone"
                control={control1}
                placeholder={'Phone'}
                keyboard={'numeric'}
                onSubmitEditing={() => {
                  setFocus('password')
                }}
                onChangeText={(value) => {
                  userPhone = convertPhoneNumberToUsaPhoneNumberFormat(value)
                  reset1({
                    phone: userPhone
                  })
                }}
              />
              <ControlledSecureField
                name="password"
                control={control}
                placeholder="Password*"
                onSubmitEditing={() => {
                  setFocus('confirmPassword')
                }}
              />
              <ControlledSecureField
                name="confirmPassword"
                control={control}
                placeholder="Confirm Password*"
                onSubmitEditing={() => {}}
              />
              <LocationDetails
                component={'SignUp'}
                data={address}
                setAddressObject={setAddressObject}
              />
            </View>
            <View className="flex flex-row items-center justify-center">
              <Controller
                name="acceptTc"
                control={control}
                render={({ field: { onChange, value }, fieldState }) => (
                  <CheckBox
                    checked={value}
                    checkedColor={fieldState.invalid ? 'red' : '#6493d9'}
                    onPress={() => {
                      onChange(!value)
                      setIsTandCAccepted(!value)
                    }}
                    className="flex-shrink"
                  />
                )}
              />
              <Typography className="flex-1">
                {'I accept the'}
                <Typography
                  className="text-primary font-bold"
                  onPress={() => {
                    setIsFirstTimeView(false)
                    setIsShowTerms(true)
                    setIsHideSignUpView(true)
                  }}
                >
                  {' Terms and Conditions'}
                </Typography>
                <Typography>{' and '}</Typography>
                <Typography
                  onPress={() => {
                    setIsFirstTimeView(false)
                    setIsShowPrivacyPolicy(true)
                    setIsHideSignUpView(true)
                  }}
                  className="text-primary font-bold"
                >
                  {'Privacy Policy.'}
                </Typography>
              </Typography>
            </View>
            <Button
              onPress={handleSubmit(submitRegistration)}
              className="w-full"
              title="Sign Up"
              disabled={!isTandCAccepted}
            />
          </View>
        </CardView>
      ) : (
        <View />
      )}
      {isShowPrivacyPolicy ? (
        <View className="mt-[20px] h-[90%] w-full rounded-[15px] border-[1px] border-[#e0deda] bg-white">
          <PrivacyPolicy
            address={address}
            cancelClicked={cancelClicked}
            acceptClicked={acceptNewRequest}
            data={{}}
            component={'SignUp'}
          />
        </View>
      ) : (
        <View />
      )}
      {isShowTerms ? (
        <View className="mt-[20px] h-[90%] w-full rounded-[15px] border-[1px] border-[#e0deda] bg-white">
          <TermsAndConditions address={address} cancelClicked={cancelClicked} />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
