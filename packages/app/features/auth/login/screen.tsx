'use client'

import { useState } from 'react'
import { View, Alert } from 'react-native'
import { Image } from 'app/ui/image'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, USER_LOGIN } from 'app/utils/urlConstants'
import { getUserDeviceInformation } from 'app/utils/device'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import headerAction from 'app/redux/header/headerAction'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import subscriptionAction from 'app/redux/userSubscription/subcriptionAction'
import userSubscriptionAction from 'app/redux/userSubscriptionDetails/userSubscriptionAction'
import paidAdAction from 'app/redux/paidAdvertiser/paidAdAction'
import sponsororAction from 'app/redux/sponsor/sponsororAction'
import { FeatherButton } from 'app/ui/icons'
import moment from 'moment-timezone'
import store from 'app/redux/store'
import { useRouter } from 'solito/navigation'
import { CardView } from 'app/ui/layouts/card-vew'
import { CardHeader } from '../card-header'

export function LoginScreen() {
  const router = useRouter()
  const [email, onChangeEmail] = useState('sachaudhari0704@gmail.com')
  const [password, onChangePassword] = useState('Shubh@m27')
  const [isLoading, setLoading] = useState(false)
  const [isShowPassword, onChangeShowPassword] = useState(false)

  async function buttonPressed() {
    if (!email) {
      Alert.alert('', 'Please Enter Email')
      return
    }
    if (!password) {
      Alert.alert('', 'Please Enter Password')
      return
    }
    setLoading(true)
    let deviceInfo = await getUserDeviceInformation()
    let loginURL = `${BASE_URL}${USER_LOGIN}`
    let dataObject = {
      header: deviceInfo,
      appuserVo: {
        emailOrPhone: email,
        credential: password,
        rememberMe: true
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let subscriptionDetailsobject = {
            subscriptionEndDate: data.data.subscriptionEndDate
              ? data.data.subscriptionEndDate
              : '',
            days: data.data.days ? data.data.days : '',
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
          Alert.alert('', 'Do verification')
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
          <View className="flex flex-col items-end">
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

      <View className="my-5 flex flex-col gap-2">
        <PtsTextInput
          onChangeText={onChangeEmail}
          placeholder={'Email Address'}
          value={email}
          defaultValue=""
        />
        <PtsTextInput
          onChangeText={(password) => {
            onChangePassword(password)
          }}
          autoCorrect={false}
          secureTextEntry={!isShowPassword}
          placeholder="Password"
          value={password}
          defaultValue=""
          trailingSlot={
            <FeatherButton
              onPress={() => {
                onChangeShowPassword(!isShowPassword)
              }}
              name={isShowPassword ? 'eye' : 'eye-off'}
              size={20}
              color={'black'}
            />
          }
        />
        <View className="mt-[20] flex-row justify-end">
          <Button
            title="Forgot Password?"
            variant="link"
            onPress={() => {
              router.push('/forgot-password')
            }}
          />

          <Button
            title="Log in"
            trailingIcon="arrow-right"
            onPress={buttonPressed}
          />
        </View>
      </View>
    </CardView>
  )
}
