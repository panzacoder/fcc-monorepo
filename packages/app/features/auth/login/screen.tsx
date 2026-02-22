'use client'

import { View, Alert } from 'react-native'
import { useLogin } from 'app/data/auth'
import { storeCredentials } from 'app/utils/secure-storage'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import headerAction from 'app/redux/header/headerAction'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import subscriptionAction from 'app/redux/userSubscription/subcriptionAction'
import userSubscriptionAction from 'app/redux/userSubscriptionDetails/userSubscriptionAction'
import paidAdAction from 'app/redux/paidAdvertiser/paidAdAction'
import sponsorAction from 'app/redux/sponsor/sponsorAction'
import moment from 'moment-timezone'
import { useAppDispatch } from 'app/redux/hooks'
import { useRouter } from 'expo-router'
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

type Schema = z.infer<typeof schema>

export function LoginScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const loginMutation = useLogin({})

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(schema)
  })

  const isLoading = loginMutation.isPending

  async function login(formData: Schema) {
    loginMutation.mutate(
      {
        appuserVo: {
          emailOrPhone: formData.email,
          credential: formData.password,
          rememberMe: true
        },
        options: {
          onFailure: (res) => {
            if (res.status === 'FAILURE' && res.errorCode === 'RVF_101') {
              router.push(formatUrl('/verification', { email: formData.email }))
            } else if (res.status === 'FAILURE') {
              Alert.alert('', res.message)
            }
          }
        }
      },
      {
        onSuccess: async (data: any) => {
          if (!data) return
          let subscriptionDetailsobject = {
            subscriptionEndDate: data.subscriptionEndDate || '',
            days: data.days || '',
            expiredSubscription: data.expiredSubscription,
            expiringSubscription: data.expiringSubscription
          }
          data.header.timezone = moment.tz.guess()
          dispatch(headerAction.setHeader(data.header))
          dispatch(userProfileAction.setUserProfile(data.appuserVo))
          dispatch(subscriptionAction.setSubscription(data.userSubscription))
          dispatch(
            userSubscriptionAction.setSubscriptionDetails(
              subscriptionDetailsobject
            )
          )
          dispatch(
            sponsorAction.setSponsor({
              sponsorDetails: data.sponsorUser,
              sponsorShipDetails: data.sponsorship
            })
          )
          if (data.commercialsDetails) {
            dispatch(
              paidAdAction.setPaidAd({
                commercialsDetails: data.commercialsDetails.commercials,
                commercialPageMappings:
                  data.commercialsDetails.commercialPageMappings
              })
            )
          }
          await storeCredentials(formData.email, formData.password)
          router.push('/home')
        }
      }
    )
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
                router.push('/signUp')
              }}
              className="pt-0"
            />
          </View>
        }
      />

      <View className="mb-1 mt-5 flex flex-wrap justify-end gap-y-4">
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
