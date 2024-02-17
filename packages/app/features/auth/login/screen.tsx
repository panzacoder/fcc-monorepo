'use client'

import { useState } from 'react'
import { View, Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, USER_LOGIN } from 'app/utils/urlConstants'
import { getUserDeviceInformation } from 'app/utils/device'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import headerAction from 'app/redux/header/headerAction'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import subscriptionAction from 'app/redux/userSubscription/subcriptionAction'
import userSubscriptionAction from 'app/redux/userSubscriptionDetails/userSubscriptionAction'
import paidAdAction from 'app/redux/paidAdvertiser/paidAdAction'
import sponsororAction from 'app/redux/sponsor/sponsororAction'
import moment from 'moment-timezone'
import store from 'app/redux/store'
import { useRouter } from 'solito/navigation'
import { CardView } from 'app/ui/layouts/card-view'
import { CardHeader } from '../card-header'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { formatUrl } from 'app/utils/format-url'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' })
})

export type Schema = z.infer<typeof schema>

export function LoginScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(schema)
  })

  async function login(formData: Schema) {
    setLoading(true)
    let deviceInfo = await getUserDeviceInformation()
    let loginURL = `${BASE_URL}${USER_LOGIN}`
    let dataObject = {
      header: deviceInfo,
      appuserVo: {
        emailOrPhone: formData.email,
        credential: formData.password,
        rememberMe: true
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let subscriptionDetailsobject = {
            subscriptionEndDate: data.data.subscriptionEndDate || '',
            days: data.data.days || '',
            expiredSubscription: data.data.expiredSubscription,
            expiringSubscription: data.data.expiringSubscription
          }
          data.data.header.timezone = moment.tz.guess()
          store.dispatch(headerAction.setHeader(data.data.header))
          store.dispatch(userProfileAction.setUserProfile(data.data.appuserVo))
          store.dispatch(
            subscriptionAction.setSubscription(data.data.userSubscription)
          )
          store.dispatch(
            userSubscriptionAction.setSubscriptionDetails(
              subscriptionDetailsobject
            )
          )
          store.dispatch(
            sponsororAction.setSponsor({
              sponsorDetails: data.data.sponsorUser,
              sponsorShipDetails: data.data.sponsorship
            })
          )
          if (data.data.commercialsDetails) {
            store.dispatch(
              paidAdAction.setPaidAd({
                commercialsDetails: data.data.commercialsDetails.commercials,
                commercialPageMappings:
                  data.data.commercialsDetails.commercialPageMappings
              })
            )
          }
          router.replace('/home')
        } else if (data.errorCode === 'RVF_101') {
          router.push(formatUrl('/verification', { email: formData.email }))
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
    <CardView>
      <PtsLoader loading={isLoading} />
      <CardHeader
        actionSlot={
          <View className="flex flex-col justify-end">
            <Typography>{'New here?'}</Typography>
            <Button
              title="Sign up"
              variant="link"
              onPress={() => {
                router.push('/sign-up')
              }}
              className="pt-0"
            />
          </View>
        }
      />

      <View className="my-5 flex flex-wrap justify-end gap-y-4">
        <View className="flex w-full gap-2">
          <ControlledTextField
            control={control}
            name="email"
            placeholder={'Email Address'}
            className="w-full"
            autoCapitalize="none"
          />
          <ControlledSecureField
            control={control}
            name="password"
            placeholder="Password"
            className="w-full"
          />
        </View>
        <View className="flex w-full flex-row justify-end gap-2">
          <Button
            className=""
            title="Forgot Password?"
            variant="link-secondary"
            onPress={() => {
              router.push('/forgot-password')
            }}
          />

          <Button
            className=""
            title="Log in"
            trailingIcon="arrow-right"
            onPress={handleSubmit(login)}
          />
        </View>
      </View>
    </CardView>
  )
}
