'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { Button } from 'app/ui/button'
import {
  BASE_URL,
  CREATE_ACCOUNT,
  GET_COUNTRIES,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import { useRouter } from 'solito/navigation'
import { CardHeader } from '../card-header'
import { CardView } from 'app/ui/layouts/card-view'
import { CheckBox } from 'react-native-elements'
import { formatUrl } from 'app/utils/format-url'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { CountryStateTimezone } from 'app/ui/form-fields/country-state-tz'

const schema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    phone: z.string(),
    email: z.string().min(1, { message: 'Email is required' }).email(),
    timezone: z.string().min(1, { message: 'Timezone is required' }),
    state: z.number().min(1, { message: 'State is required' }),
    country: z.number().min(1, { message: 'Country is required' }),
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

export type Schema = z.infer<typeof schema>

export function SignUpScreen() {
  const [selectedCountryValue, setSelectedCountry] = useState(-1)
  const [countries, setCountries] = useState<any>([])
  const [states, setStates] = useState<any>([])
  const [timezones, setTimezones] = useState<any>([])
  const [isLoading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      timezone: '',
      country: -1,
      state: -1,
      acceptTc: false
    },
    resolver: zodResolver(schema)
  })

  const router = useRouter()

  const getStates = useCallback(async (countryId: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId || 101
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        console.log('data', data)
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // set available states
          const statesList = data.data.stateList.map((data: any) => {
            return {
              label: data.name,
              value: data.id
            }
          })
          setStates(statesList)

          // set available timezones
          const timeZones = data.data.timeZoneList.map((data: any) => {
            return {
              label: data.name,
              value: data.name
            }
          })
          setTimezones(timeZones)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }, [])

  useEffect(() => {
    async function getCountries() {
      setLoading(true)
      let url = `${BASE_URL}${GET_COUNTRIES}`
      CallPostService(url, {})
        .then(async (data: any) => {
          setLoading(false)
          if (data.status === 'SUCCESS') {
            const countryList = data.data.map((data: any, index: any) => {
              return {
                label: data.name,
                value: data.id
              }
            })
            setCountries(countryList)
            if (selectedCountryValue !== -1) {
              getStates(selectedCountryValue)
            }
          } else {
            setLoading(false)
            Alert.alert('', data.message)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getCountries()
  }, [])

  async function submitRegistration(formData: Schema) {
    console.log('formData', formData)
    const loginURL = `${BASE_URL}${CREATE_ACCOUNT}`
    const dataObject = {
      registration: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        credential: formData.password,
        userTimezone: formData.timezone,
        referralCode: '',
        address: {
          state: {
            id: formData.state
          }
        }
      }
    }
    setLoading(true)
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.push(formatUrl('/verification', { email: formData.email }))
        } else if (data.errorCode === 'RVF_101') {
          Alert.alert('', 'Do verification')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        Alert.alert('', error)
        console.log(error)
      })
  }
  async function setSelectedCountryChange(value: any) {
    setSelectedCountry(value)
    await getStates(value)
  }

  return (
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
      <View className="my-5 flex flex-wrap justify-end gap-y-4">
        <View className="flex w-full gap-2">
          <View className="flex w-full flex-row justify-between gap-2">
            <ControlledTextField
              control={control}
              name="firstName"
              className="flex-1"
              placeholder={'First Name*'}
            />
            <ControlledTextField
              control={control}
              name="lastName"
              className="flex-1"
              placeholder={'Last Name*'}
            />
          </View>
          <ControlledTextField
            control={control}
            name="email"
            placeholder={'Email Address*'}
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="phone"
            placeholder={'Phone'}
            keyboard={'numeric'}
          />
          <ControlledSecureField
            control={control}
            name="password"
            placeholder="Password*"
          />
          <ControlledSecureField
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password*"
          />

          <CountryStateTimezone control={control} />
          <Typography className=" font-bold">{'Address'}</Typography>
          <ControlledDropdown
            control={control}
            name="country"
            label="Country*"
            maxHeight={300}
            list={countries}
            onChangeValue={setSelectedCountryChange}
          />
          <ControlledDropdown
            control={control}
            name="state"
            label="State*"
            maxHeight={300}
            list={states}
          />
          <ControlledDropdown
            control={control}
            name="timezone"
            label="Time Zone*"
            maxHeight={300}
            list={timezones}
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
                }}
                className="flex-shrink"
              />
            )}
          />
          <Typography className="flex-1">
            {'I accept the Terms and Conditions and Privacy Policy'}
          </Typography>
        </View>
        <Button
          onPress={handleSubmit(submitRegistration)}
          className="w-full"
          title="Sign Up"
        />
      </View>
    </CardView>
  )
}
