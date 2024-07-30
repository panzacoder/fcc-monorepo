'use client'

import { AccentButton } from 'app/ui/accent-button'
import { View, Text, Alert, ToastAndroid } from 'react-native'
import _ from 'lodash'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { useEffect, useCallback, useState } from 'react'
import { BASE_URL, USER_LOGIN } from 'app/utils/urlConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CallPostService } from 'app/utils/fetchServerData'
import { getUserDeviceInformation } from 'app/utils/device'
import headerAction from 'app/redux/header/headerAction'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import subscriptionAction from 'app/redux/userSubscription/subcriptionAction'
import userSubscriptionAction from 'app/redux/userSubscriptionDetails/userSubscriptionAction'
import paidAdAction from 'app/redux/paidAdvertiser/paidAdAction'
import sponsorAction from 'app/redux/sponsor/sponsorAction'
import moment from 'moment-timezone'
import store from 'app/redux/store'
import { formatUrl } from 'app/utils/format-url'
import PtsLoader from 'app/ui/PtsLoader'
import messaging from '@react-native-firebase/messaging'
let notificationData = {} as any
export function SplashScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isShowButtons, setIsShowButtons] = useState(false)
  const getUsernamePassword = useCallback(async () => {
    setLoading(true)
    try {
      let loginDetails: any = await AsyncStorage.getItem('loginDetails')
      loginDetails = loginDetails != null ? JSON.parse(loginDetails) : null
      if (loginDetails !== null) {
        login(loginDetails.email, loginDetails.password)
      } else {
        setIsShowButtons(true)
        setLoading(false)
      }
    } catch (e) {
      setIsShowButtons(true)
      setLoading(false)
    }
  }, [])
  const getNotificationData = useCallback(async () => {
    await messaging()
      .getInitialNotification()
      .then((notification: any) => {
        if (notification) {
          notificationData = notification
        }
      })

    await messaging().onNotificationOpenedApp((remoteMessage: any) => {
      if (remoteMessage) {
        notificationData = remoteMessage
      }
    })
    getUsernamePassword()
  }, [])

  useEffect(() => {
    // getNotificationData()
    getUsernamePassword()
  }, [])
  async function navigateToNotification(header: any) {
    if (
      !_.isEmpty(notificationData.data) &&
      notificationData.data !== undefined
    ) {
      let notificationType = notificationData.data.MessageType
        ? notificationData.data.MessageType
        : ''
      let memberData = {
        member:
          notificationData.data && notificationData.data.MemberId
            ? notificationData.data.MemberId
            : '',
        firstname: '',
        lastname: ''
      } as object
      let details = {
        id:
          notificationData.data && notificationData.data.DomainObjectId
            ? notificationData.data.DomainObjectId
            : ''
      }
      if (
        String(notificationType).toLowerCase() ===
        String('Appointment Reminder').toLowerCase()
      ) {
        router.push(
          formatUrl('/circles/appointmentDetails', {
            appointmentDetails: JSON.stringify(details),
            memberData: JSON.stringify(memberData)
          })
        )
      } else if (
        String(notificationType).toLowerCase() ===
        String('Purchase Reminder').toLowerCase()
      ) {
        router.push(
          formatUrl('/circles/medicalDeviceDetails', {
            medicalDevicesDetails: JSON.stringify(details),
            memberData: JSON.stringify(memberData)
          })
        )
      } else if (
        String(notificationType).toLowerCase() ===
        String('Event Reminder').toLowerCase()
      ) {
        router.push(
          formatUrl('/circles/eventDetails', {
            eventDetails: JSON.stringify(details),
            memberData: JSON.stringify(memberData)
          })
        )
      } else if (
        String(notificationType).toLowerCase() ===
          String('General').toLowerCase() ||
        String(notificationType).toLowerCase() ===
          String('Appointment').toLowerCase() ||
        String(notificationType).toLowerCase() ===
          String('General').toLowerCase() ||
        String(notificationType).toLowerCase() ===
          String('Incident').toLowerCase() ||
        String(notificationType).toLowerCase() ===
          String('Purchase').toLowerCase()
      ) {
        let noteData = {
          id:
            notificationData.data && notificationData.data.MsgThreadId
              ? Number(notificationData.data.MsgThreadId)
              : ''
        } as object
        router.push(
          formatUrl('/circles/noteMessage', {
            component: 'General',
            memberData: JSON.stringify(memberData),
            noteData: JSON.stringify(noteData)
          })
        )
      } else if (
        String(notificationType).toLowerCase() ===
        'Member Request'.toLowerCase()
      ) {
        router.push(
          formatUrl('/circles/caregiversList', {
            memberData: JSON.stringify(memberData)
          })
        )
      } else {
        router.push('/home')
      }
    } else {
      router.push('/home')
    }
  }
  async function login(email: any, password: any) {
    setLoading(true)
    let deviceInfo = await getUserDeviceInformation()
    let url = `${BASE_URL}${USER_LOGIN}`
    let dataObject = {
      header: deviceInfo,
      appuserVo: {
        emailOrPhone: email,
        credential: password,
        rememberMe: true
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          await store.dispatch(headerAction.setHeader(data.data.header))
          let subscriptionDetailsobject = {
            subscriptionEndDate: data.data.subscriptionEndDate || '',
            days: data.data.days || '',
            expiredSubscription: data.data.expiredSubscription,
            expiringSubscription: data.data.expiringSubscription
          }
          data.data.header.timezone = moment.tz.guess()

          await store.dispatch(
            userProfileAction.setUserProfile(data.data.appuserVo)
          )
          await store.dispatch(
            subscriptionAction.setSubscription(data.data.userSubscription)
          )
          await store.dispatch(
            userSubscriptionAction.setSubscriptionDetails(
              subscriptionDetailsobject
            )
          )
          await store.dispatch(
            sponsorAction.setSponsor({
              sponsorDetails: data.data.sponsorUser,
              sponsorShipDetails: data.data.sponsorship
            })
          )
          if (data.data.commercialsDetails) {
            await store.dispatch(
              paidAdAction.setPaidAd({
                commercialsDetails: data.data.commercialsDetails.commercials,
                commercialPageMappings:
                  data.data.commercialsDetails.commercialPageMappings
              })
            )
          }
          navigateToNotification(data.data.header)
        } else if (data.errorCode === 'RVF_101') {
          router.push(formatUrl('/verification', { email: email }))
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
  const router = useRouter()
  return (
    <View className="native:pt-60 web:pt-40 flex h-full w-full flex-1 px-4 md:justify-center md:pt-0">
      <PtsLoader loading={isLoading} />
      <Typography
        variant="h2"
        as="h1"
        className="text-center font-bold text-white"
      >
        Caregiving can be <Text className="italic">heavy</Text>.
        {"\n\nLet's lighten the load."}
      </Typography>
      {isShowButtons ? (
        <View className="absolute bottom-20 right-4 flex flex-col items-end gap-4 ">
          <AccentButton title="Log in" onPress={() => router.push('/login')} />
          <AccentButton
            title="Sign up"
            onPress={() => router.push('/signUp')}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
