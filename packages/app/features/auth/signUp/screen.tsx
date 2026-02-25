'use client'

import { useState, useRef, type ComponentProps } from 'react'
import { View, Alert } from 'react-native'
import { useCreateAccount } from 'app/data/auth'
import { Button } from 'app/ui/button'
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

const ADDRESS_FIELD = {
  NICK_NAME: 0,
  LINE: 1,
  CITY: 2,
  ZIP_CODE: 3,
  COUNTRY: 4,
  STATE: 5,
  FULL_ADDRESS: 6,
  SHORT_DESCRIPTION: 7,
  TIMEZONE: 8
} as const

type AddressFormData = {
  shortDescription: string
  nickName: string
  address: {
    id: string
    line: string
    city: string
    zipCode: string
    state: {
      name: string
      code: string
      namecode: string
      description: string
      snum: string
      id: string
      country: {
        name: string
        code: string
        namecode: string
        isoCode: string
        description: string
        id: string
      }
    }
  }
}

const initialAddress: AddressFormData = {
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
    phone: z.string(),
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
type Schema = z.infer<typeof schema>

export function SignUpScreen() {
  const selectedAddress = useRef<AddressFormData>(
    structuredClone(initialAddress)
  )
  const userPhone = useRef('')
  const createAccountMutation = useCreateAccount({})
  const [timeZone, setTimeZone] = useState('')
  const [address, setAddress] = useState({})
  const [isShowPrivacyPolicy, setIsShowPrivacyPolicy] = useState(false)
  const [isShowTerms, setIsShowTerms] = useState(false)
  const [isHideSignUpView, setIsHideSignUpView] = useState(false)
  const [isFirstTimeView, setIsFirstTimeView] = useState(true)
  const [isTandCAccepted, setIsTandCAccepted] = useState(false)

  const router = useRouter()
  const { control, handleSubmit, setFocus, setValue } = useForm({
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
  async function submitRegistration(formData: Schema) {
    if (selectedAddress.current.address.state.id === '') {
      Alert.alert('', 'Please select State')
      return
    }
    createAccountMutation.mutate(
      {
        registration: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: removeAllSpecialCharFromString(userPhone.current),
          email: formData.email,
          credential: formData.password,
          userTimezone: timeZone,
          referralCode: '',
          address: {
            state: {
              id: selectedAddress.current.address.state.id
            }
          }
        }
      },
      {
        onSuccess: (data: unknown) => {
          if (data) {
            router.push(formatUrl('/verification', { email: formData.email }))
          }
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to create account')
        }
      }
    )
  }
  async function setAddressObject(value: unknown, index: number) {
    if (value) {
      const str = value as string
      const obj = value as Record<string, string | number>
      if (index === ADDRESS_FIELD.NICK_NAME) {
        selectedAddress.current.nickName = str
      }
      if (index === ADDRESS_FIELD.SHORT_DESCRIPTION) {
        selectedAddress.current.shortDescription = str
      }
      if (index === ADDRESS_FIELD.LINE) {
        selectedAddress.current.address.line = str
      }
      if (index === ADDRESS_FIELD.CITY) {
        selectedAddress.current.address.city = str
      }
      if (index === ADDRESS_FIELD.ZIP_CODE) {
        selectedAddress.current.address.zipCode = str
      }
      if (index === ADDRESS_FIELD.COUNTRY) {
        const country = (selectedAddress.current.address.state.country ??=
          {} as AddressFormData['address']['state']['country'])
        country.id = obj.id as string
        country.name = obj.name as string
        country.code = obj.code as string
        country.namecode = obj.namecode as string
        country.isoCode = obj.isoCode as string
        country.description = obj.description as string
      }
      if (index === ADDRESS_FIELD.STATE) {
        const state = (selectedAddress.current.address.state ??=
          {} as AddressFormData['address']['state'])
        state.id = obj.id as string
        state.name = obj.name as string
        state.code = obj.code as string
        state.namecode = obj.namecode as string
        state.snum = obj.snum as string
        state.description = obj.description as string
      }
      if (index === ADDRESS_FIELD.FULL_ADDRESS) {
        selectedAddress.current = value as AddressFormData
      }
      if (index === ADDRESS_FIELD.TIMEZONE) {
        const tz = obj.name ? (obj.name as string) : ''
        setTimeZone(tz)
        logger.debug('timeZone', tz)
      }
    }
    setAddress(selectedAddress.current)
  }
  const cancelClicked = (address: Record<string, unknown>) => {
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

          <PtsLoader loading={createAccountMutation.isPending} />
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
                control={control}
                placeholder={'Phone'}
                keyboard={'numeric'}
                onSubmitEditing={() => {
                  setFocus('password')
                }}
                onChangeText={(value) => {
                  userPhone.current =
                    convertPhoneNumberToUsaPhoneNumberFormat(value) ?? ''
                  setValue('phone', userPhone.current)
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
            cancelClicked={
              cancelClicked as ComponentProps<
                typeof PrivacyPolicy
              >['cancelClicked']
            }
            acceptClicked={
              (() => {}) as ComponentProps<
                typeof PrivacyPolicy
              >['acceptClicked']
            }
            data={{}}
            component={'SignUp'}
          />
        </View>
      ) : (
        <View />
      )}
      {isShowTerms ? (
        <View className="mt-[20px] h-[90%] w-full rounded-[15px] border-[1px] border-[#e0deda] bg-white">
          <TermsAndConditions
            address={address}
            cancelClicked={
              cancelClicked as ComponentProps<
                typeof TermsAndConditions
              >['cancelClicked']
            }
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
