'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  BackHandler,
  Platform
} from 'react-native'
import _ from 'lodash'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { useRouter } from 'expo-router'
import { convertTimeToUserLocalTime } from 'app/ui/utils'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { formatUrl } from 'app/utils/format-url'
import messaging from '@react-native-firebase/messaging'
import { CardView } from 'app/ui/cardViews'
import { Feather } from 'app/ui/icons'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { logger } from 'app/utils/logger'
import { TabsHeader } from 'app/ui/tabs-header'
import memberNamesAction from 'app/redux/memberNames/memberNamesAction'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { useQueryClient } from '@tanstack/react-query'
import {
  useWeekDetails,
  useUpdateFcmToken,
  dashboardKeys
} from 'app/data/dashboard'
import {
  useTransportationRequests,
  useApproveTransport,
  useRejectTransport,
  useEventAcceptTransportationRequest,
  useEventRejectTransportationRequest
} from 'app/data/transportation'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

const schema = z.object({
  rejectReason: z.string().min(1, { message: 'Enter reject reason' })
})

export type Schema = z.infer<typeof schema>
export function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  )
  const dispatch = useAppDispatch()
  const memberNamesList: any = useAppSelector((state) =>
    state.memberNames.memberNamesList !== undefined
      ? state.memberNames.memberNamesList
      : []
  )
  const router = useRouter()
  const header = useAppSelector((state) => state.headerState.header)
  const user = useAppSelector((state) => state.userProfileState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )

  let fullName = user.memberName ? user.memberName : ''
  if (memberNamesList.includes(fullName) === false) {
    memberNamesList.push(fullName)
  }
  dispatch(memberNamesAction.setMemberNames(memberNamesList))
  const [isWeekDataAvailable, setIsWeekDataAvailable] = useState(false)
  const [transportRequestData, setTransportRequestData] = useState({}) as any
  const [isRejectTransportRequest, setIsRejectTransportRequest] =
    useState(false)
  const [transportMemberName, setTransportMemberName] = useState('')
  const [transportMemberId, setTransportMemberId] = useState('')
  const [isShowTransportationRequests, setIsShowTransportationRequests] =
    useState(false)
  const [upcomingSentence, setUpcomingSentence] = useState('')
  const [isDataReceived, setDataReceived] = useState(false)
  const [memberList, setMemberList] = useState([])
  const [transportationList, setTransportationList] = useState([])
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      rejectReason: ''
    },
    resolver: zodResolver(schema)
  })

  const queryClient = useQueryClient()

  const { data: weekDetailsData, isLoading: isWeekDetailsLoading } =
    useWeekDetails(header)

  const updateFcmTokenMutation = useUpdateFcmToken(header)

  const {
    data: transportData,
    isLoading: isTransportLoading,
    isFetching: isTransportFetching
  } = useTransportationRequests(header, {
    memberId: transportMemberId
  })

  const approveTransportMutation = useApproveTransport(header)
  const rejectTransportMutation = useRejectTransport(header)
  const eventAcceptMutation = useEventAcceptTransportationRequest(header)
  const eventRejectMutation = useEventRejectTransportationRequest(header)

  const isLoading =
    isWeekDetailsLoading ||
    (transportMemberId !== '' && isTransportFetching) ||
    approveTransportMutation.isPending ||
    rejectTransportMutation.isPending ||
    eventAcceptMutation.isPending ||
    eventRejectMutation.isPending ||
    updateFcmTokenMutation.isPending

  useEffect(() => {
    if (weekDetailsData) {
      let memberList = weekDetailsData.memberList
        ? weekDetailsData.memberList
        : []
      setMemberList(memberList)
      logger.debug('memberList', JSON.stringify(memberList))
      memberList.map((data: any) => {
        if (
          data.upcomingAppointment ||
          data.recentIncident ||
          data.upcomingEvent
        ) {
          setIsWeekDataAvailable(true)
        }
        let fullName = data.firstname.trim() + ' ' + data.lastname.trim()
        if (memberNamesList.includes(fullName) === false) {
          memberNamesList.push(fullName)
        }
      })
      dispatch(memberNamesAction.setMemberNames(memberNamesList))
      let sentence = ''
      sentence +=
        weekDetailsData.upcomingAppointmentCount &&
        weekDetailsData.upcomingAppointmentCount > 0
          ? weekDetailsData.upcomingAppointmentCount + ' Appointments, '
          : ''
      sentence +=
        weekDetailsData.upcomingEventCount &&
        weekDetailsData.upcomingEventCount > 0
          ? weekDetailsData.upcomingEventCount + ' Events'
          : ''
      setUpcomingSentence(sentence)
      setDataReceived(true)
    }
  }, [weekDetailsData])

  useEffect(() => {
    if (transportData && transportMemberId !== '') {
      setTransportationList(transportData ? transportData : [])
      setIsShowTransportationRequests(true)
    }
  }, [transportData, transportMemberId])

  function handleBackButtonClick() {
    BackHandler.exitApp()
    return true
  }
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
        logger.debug('Your Firebase Token is:', fcmToken)
        updateFcmToken(fcmToken)
      } else {
        logger.debug('Failed', 'No Token Recived')
      }
    } catch (e) {}
  }
  async function updateFcmToken(fcmToken: any) {
    updateFcmTokenMutation.mutate(
      {
        appuserVo: {
          fcmToken: fcmToken
        }
      },
      {
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }
  const handleFcmMessage = useCallback(async () => {
    try {
      await messaging().setBackgroundMessageHandler(async (message: any) => {
        schedulePushNotification(message)
      })
      await messaging().onMessage((message: any) => {
        schedulePushNotification(message)
      })
    } catch (e) {}
  }, [])
  const getToken = useCallback(async () => {
    try {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      if (enabled) {
        getFcmToken()
        logger.debug('Authorization status:', authStatus)
      }
    } catch (e) {}
  }, [])
  async function registerForPushNotificationsAsync() {
    let token: any

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId
        if (!projectId) {
          throw new Error('Project ID not found')
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId
          })
        ).data
        logger.debug(token)
      } catch (e) {
        token = `${e}`
      }
    } else {
      alert('Must use physical device for Push Notifications')
    }

    return token
  }
  async function schedulePushNotification(message: any) {
    Notifications.dismissAllNotificationsAsync()
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.notification.title,
        body: message.notification.body,
        data: {
          MessageType: message.data.MessageType,
          notificationData: message
        }
      },
      trigger: { seconds: 2 }
    })
  }

  useEffect(() => {
    getToken()

    handleFcmMessage()
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    )
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      )
    }
    async function redirect(notification: any) {
      notification = notification.request.content
      if (
        !_.isEmpty(notification.data.notificationData) &&
        notification.data.notificationData !== undefined
      ) {
        let notificationType = notification.data.MessageType
          ? notification.data.MessageType
          : ''
        let notificationData = notification.data.notificationData
          ? notification.data.notificationData
          : {}
        let memberData = {
          member:
            notificationData.data && notificationData.data.MemberId
              ? notificationData.data.MemberId
              : '',
          firstname: user.memberName ? user.memberName.split(' ')[0] : '',
          lastname: user.memberName ? user.memberName.split(' ')[1] : ''
        }

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
            String('Purchase').toLowerCase() ||
          String(notificationType).toLowerCase() ===
            String('Event').toLowerCase()
        ) {
          let noteData = {
            id:
              notificationData.data && notificationData.data.MsgThreadId
                ? Number(notificationData.data.MsgThreadId)
                : ''
          }
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
      }
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        redirect(response.notification)
      }
    )
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
      subscription.remove()
    }
  }, [])

  async function trasportationClicked(memberData: any) {
    let fullName = ''
    if (memberData.firstname) {
      fullName += memberData.firstname.trim() + ' '
    }
    if (memberData.lastname) {
      fullName += memberData.lastname.trim()
    }
    setTransportMemberName(fullName)
    setTransportMemberId(memberData.member ? memberData.member : '')
  }
  async function approveRejectTrasportRequest(transportData: any) {
    const params = {
      transport: {
        id: transportData.id ? transportData.id : '',
        reason: '',
        isApprove: true
      }
    }
    const onSuccess = () => {
      setIsShowTransportationRequests(false)
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.weekDetails()
      })
    }
    const onError = (error: any) => {
      logger.debug(error)
    }
    if (transportData.type === 'Event') {
      eventAcceptMutation.mutate(params, { onSuccess, onError })
    } else {
      approveTransportMutation.mutate(params, { onSuccess, onError })
    }
  }
  const showRequestModal = () => {
    return (
      <View className="my-2 max-h-[90%] w-full self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{`Transportation Requests`}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsShowTransportationRequests(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="">
          {transportationList.map((data: any, index: number) => {
            return (
              <View className="p-2" key={index}>
                <Typography className="font-400 ml-2">
                  {data.type ? data.type + ':' : ''}
                </Typography>
                <Typography className="ml-2 w-full">
                  <Typography className="font-bold">
                    {data.createdbyname ? data.createdbyname : ''}
                  </Typography>
                  <Typography>{' has requested you to accompany '}</Typography>
                  <Typography className="font-bold">
                    {transportMemberName}
                  </Typography>
                  <Typography>{' while visiting '}</Typography>
                  <Typography className="text-primary font-bold">
                    {`${data.name ? data.name : ''}${data.location ? ' - ' + data.location : ''}`}
                  </Typography>
                  <Typography>{' on '}</Typography>
                  <Typography className="text-primary font-bold">
                    {`${data.date ? convertTimeToUserLocalTime(data.date, userAddress, memberAddress) : ''}`}
                  </Typography>
                </Typography>
                <View className="my-2 flex-row justify-center">
                  <Button
                    className="bg-[#5ACC6C]"
                    title={'Accept'}
                    variant="default"
                    onPress={() => {
                      approveRejectTrasportRequest(data)
                    }}
                  />
                  <Button
                    className="ml-5 bg-[#c43416]"
                    title={'Reject'}
                    variant="default"
                    onPress={() => {
                      setTransportRequestData(data)
                      setIsRejectTransportRequest(true)
                      setIsShowTransportationRequests(false)
                    }}
                  />
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
  async function rejectRequest(formData: Schema) {
    const params = {
      transport: {
        id: transportRequestData.id ? transportRequestData.id : '',
        reason: formData.rejectReason,
        isApprove: false
      }
    }
    const onSuccess = () => {
      setIsRejectTransportRequest(false)
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.weekDetails()
      })
    }
    const onError = (error: any) => {
      logger.debug(error)
    }
    if (transportRequestData.type === 'Event') {
      eventRejectMutation.mutate(params, { onSuccess, onError })
    } else {
      rejectTransportMutation.mutate(params, { onSuccess, onError })
    }
  }
  const shwoRejectModal = () => {
    return (
      <View className="my-2 max-h-[90%] w-full self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{``}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsRejectTransportRequest(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-2 w-[95%] self-center">
          <ControlledTextField
            control={control}
            name="rejectReason"
            placeholder={'Reject reason'}
            className=" bg-white"
            autoCapitalize="none"
          />
        </View>
        <View className="my-2 flex-row justify-center">
          <Button
            className="bg-[#5ACC6C]"
            title={'Reject'}
            variant="default"
            onPress={handleSubmit(rejectRequest)}
          />
          <Button
            className="ml-5 bg-[#c43416]"
            title={'Cancel'}
            variant="default"
            onPress={() => {
              setIsRejectTransportRequest(false)
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="">
        {isDataReceived ? (
          <View>
            <TabsHeader />
          </View>
        ) : (
          <View />
        )}
        <View className="flex-row">
          <View>
            <Typography className="font-400 ml-[30] text-[16px]">
              {'Welcome Back,'}
            </Typography>
            <Typography className=" ml-[30] text-[22px] font-bold text-black">
              {user.memberName ? user.memberName : ''}
            </Typography>
          </View>
        </View>
        {isDataReceived ? (
          <View
            className={`border-primary bg-card mx-[10px] mt-[30] h-[85%] w-full self-center rounded-[15px] border-[2px]`}
          >
            <View className="ml-[20] flex-row items-center">
              {isWeekDataAvailable ? (
                <View>
                  <Typography className="mt-[10] text-[20px] font-bold text-black">
                    {'Your Week'}
                  </Typography>
                  <Typography className="font-400 text-[16px]">
                    {upcomingSentence}
                  </Typography>
                </View>
              ) : (
                <View className="mt-[10]" />
              )}
            </View>
            {memberList.length > 0 && isWeekDataAvailable ? (
              <ScrollView persistentScrollbar={true} className="m-2 flex-1">
                {memberList.map((data: any, index: number) => {
                  return (
                    <View key={index}>
                      <CardView
                        data={JSON.stringify(data)}
                        trasportationClicked={trasportationClicked}
                      ></CardView>
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View className="w-[95%]">
                <Typography className="w-full self-center p-5 text-center font-bold">
                  {
                    'Looks like your week has no appointments/events. Go to Your Circles.'
                  }
                </Typography>
                <Button
                  className="bg-primary w-[50%] self-center"
                  title={'Ok'}
                  variant="default"
                  onPress={() => {
                    router.push('/circles')
                  }}
                />
              </View>
            )}
          </View>
        ) : (
          <View />
        )}
      </View>
      {isShowTransportationRequests ? (
        <View className="absolute top-[100] h-[75%] w-[95%] self-center">
          {showRequestModal()}
        </View>
      ) : (
        <View />
      )}
      {isRejectTransportRequest ? (
        <View className="absolute top-[100] h-[75%] w-[95%] self-center">
          {shwoRejectModal()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
