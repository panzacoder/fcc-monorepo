'use client'

import { AccentButton } from 'app/ui/accent-button'
import { View, Text, Alert } from 'react-native'
import _ from 'lodash'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { useEffect, useCallback, useState, useRef } from 'react'
import { useLogin } from 'app/data/auth'
import { getCredentials } from 'app/utils/secure-storage'
import headerAction from 'app/redux/header/headerAction'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import subscriptionAction from 'app/redux/userSubscription/subcriptionAction'
import userSubscriptionAction from 'app/redux/userSubscriptionDetails/userSubscriptionAction'
import paidAdAction from 'app/redux/paidAdvertiser/paidAdAction'
import sponsorAction from 'app/redux/sponsor/sponsorAction'
import moment from 'moment-timezone'
import { useAppDispatch } from 'app/redux/hooks'
import { formatUrl } from 'app/utils/format-url'
import PtsLoader from 'app/ui/PtsLoader'
import messaging from '@react-native-firebase/messaging'
export function SplashScreen() {
  const notificationDataRef = useRef<any>({})
  const dispatch = useAppDispatch()
  const router = useRouter()
  const loginMutation = useLogin({})
  const [isShowButtons, setIsShowButtons] = useState(false)

  const isLoading = loginMutation.isPending

  const getUsernamePassword = useCallback(async () => {
    try {
      const credentials = await getCredentials()
      if (credentials !== null) {
        login(credentials.email, credentials.password)
      } else {
        setIsShowButtons(true)
      }
    } catch (e) {
      setIsShowButtons(true)
    }
  }, [])
  const getNotificationData = useCallback(async () => {
    try {
      await messaging()
        .getInitialNotification()
        .then((notification: any) => {
          if (notification) {
            notificationDataRef.current = notification
          }
        })

      await messaging().onNotificationOpenedApp((remoteMessage: any) => {
        if (remoteMessage) {
          notificationDataRef.current = remoteMessage
        }
      })
      getUsernamePassword()
    } catch (e) {
      getUsernamePassword()
    }
  }, [])

  useEffect(() => {
    getNotificationData()
  }, [])
  async function navigateToNotification() {
    if (
      !_.isEmpty(notificationDataRef.current.data) &&
      notificationDataRef.current.data !== undefined
    ) {
      let notificationType = notificationDataRef.current.data.MessageType
        ? notificationDataRef.current.data.MessageType
        : ''
      let memberData = {
        member:
          notificationDataRef.current.data &&
          notificationDataRef.current.data.MemberId
            ? notificationDataRef.current.data.MemberId
            : '',
        firstname: '',
        lastname: ''
      } as object
      let details = {
        id:
          notificationDataRef.current.data &&
          notificationDataRef.current.data.DomainObjectId
            ? notificationDataRef.current.data.DomainObjectId
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
            notificationDataRef.current.data &&
            notificationDataRef.current.data.MsgThreadId
              ? Number(notificationDataRef.current.data.MsgThreadId)
              : ''
        } as object
        router.push(
          formatUrl('/circles/notificationNoteMessage', {
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
  function login(email: any, password: any) {
    loginMutation.mutate(
      {
        appuserVo: {
          emailOrPhone: email,
          credential: password,
          rememberMe: true
        },
        options: {
          onFailure: (res) => {
            if (res.status === 'FAILURE' && res.errorCode === 'RVF_101') {
              router.push(formatUrl('/verification', { email: email }))
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
          navigateToNotification()
        }
      }
    )
  }
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
