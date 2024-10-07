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
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { useRouter } from 'expo-router'
import { convertTimeToUserLocalTime } from 'app/ui/utils'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { formatUrl } from 'app/utils/format-url'
import { CallPostService } from 'app/utils/fetchServerData'
import messaging from '@react-native-firebase/messaging'
import {
  BASE_URL,
  GET_WEEKLY_DETAILS,
  GET_TRANSPORTATION_REQUESTS,
  REJECT_TRANSPORT,
  APPROVE_TRANSPORT,
  EVENT_ACCEPT_TRANSPORTATION_REQUEST,
  EVENT_REJECT_TRANSPORTATION_REQUEST,
  UPDATE_FCM_TOKEN
} from 'app/utils/urlConstants'
import { CardView } from 'app/ui/cardViews'
import { Feather } from 'app/ui/icons'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TabsHeader } from 'app/ui/tabs-header'
import memberNamesAction from 'app/redux/memberNames/memberNamesAction'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
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
  let memberNamesList: any =
    store.getState().memberNames.memberNamesList !== undefined
      ? store.getState().memberNames.memberNamesList
      : []
  const router = useRouter()
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header

  let fullName = user.memberName ? user.memberName : ''
  if (memberNamesList.includes(fullName) === false) {
    memberNamesList.push(fullName)
  }
  store.dispatch(memberNamesAction.setMemberNames(memberNamesList))
  const [isLoading, setLoading] = useState(false)
  const [transportRequestData, setTransportRequestData] = useState({}) as any
  const [isRejectTransportRequest, setIsRejectTransportRequest] =
    useState(false)
  const [transportMemberName, setTransportMemberName] = useState('')
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
  const getWeekDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_WEEKLY_DETAILS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let memberList = data.data.memberList ? data.data.memberList : []
          setMemberList(memberList)
          console.log('memberList', JSON.stringify(memberList))
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
            console.log('memberNamesList', JSON.stringify(memberNamesList))
          })
          store.dispatch(memberNamesAction.setMemberNames(memberNamesList))
          let sentence = ''
          sentence +=
            data.data.upcomingAppointmentCount &&
            data.data.upcomingAppointmentCount > 0
              ? data.data.upcomingAppointmentCount + ' Appointments, '
              : ''
          sentence +=
            data.data.upcomingEventCount && data.data.upcomingEventCount > 0
              ? data.data.upcomingEventCount + ' Events'
              : ''
          setUpcomingSentence(sentence)
          setDataReceived(true)
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
  function handleBackButtonClick() {
    BackHandler.exitApp()
    return true
  }
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
        console.log('Your Firebase Token is:', fcmToken)
        updateFcmToken(fcmToken)
      } else {
        console.log('Failed', 'No Token Recived')
      }
    } catch (e) {}
  }
  async function updateFcmToken(fcmToken: any) {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_FCM_TOKEN}`
    let dataObject = {
      header: header,
      appuserVo: {
        fcmToken: fcmToken
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
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
        console.log('Authorization status:', authStatus)
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
        alert('Please give permissions for sending notifications.')
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
        console.log(token)
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
    getWeekDetails()

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
        // Alert.alert('notification response', JSON.stringify(response))
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
    // console.log('trasportationClicked', JSON.stringify(memberData))
    let fullName = ''
    if (memberData.firstname) {
      fullName += memberData.firstname.trim() + ' '
    }
    if (memberData.lastname) {
      fullName += memberData.lastname.trim()
    }
    setTransportMemberName(fullName)
    setLoading(true)
    let url = `${BASE_URL}${GET_TRANSPORTATION_REQUESTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setTransportationList(data.data ? data.data : [])
          setIsShowTransportationRequests(true)
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
  async function approveRejectTrasportRequest(transportData: any) {
    setLoading(true)
    let url = ''
    if (transportData.type === 'Event') {
      url = `${BASE_URL}${EVENT_ACCEPT_TRANSPORTATION_REQUEST}`
    } else {
      url = `${BASE_URL}${APPROVE_TRANSPORT}`
    }
    let dataObject = {
      header: header,
      transportationVo: {
        id: transportData.id ? transportData.id : '',
        reason: '',
        isApprove: true
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsShowTransportationRequests(false)
          getWeekDetails()
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
                    {`${data.date ? convertTimeToUserLocalTime(data.date) : ''}`}
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
                      // approveRejectTrasportRequest(data, false)
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
    setLoading(true)
    let url = ''
    if (transportRequestData.type === 'Event') {
      url = `${BASE_URL}${EVENT_REJECT_TRANSPORTATION_REQUEST}`
    } else {
      url = `${BASE_URL}${REJECT_TRANSPORT}`
    }
    let dataObject = {
      header: header,
      transportationVo: {
        id: transportRequestData.id ? transportRequestData.id : '',
        reason: formData.rejectReason,
        isApprove: false
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsRejectTransportRequest(false)
          getWeekDetails()
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
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
              {memberList.length > 0 ? (
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
            {memberList.length > 0 ? (
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
