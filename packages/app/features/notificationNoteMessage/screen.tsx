'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native'
import { SafeAreaView } from 'app/ui/safe-area-view'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import messaging from '@react-native-firebase/messaging'
import messageListAction from 'app/redux/messageList/messageListAction'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import * as Notifications from 'expo-notifications'
import { Typography } from 'app/ui/typography'
import { formatTimeToUserLocalTime, isValidObject } from 'app/ui/utils'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { useLocalSearchParams } from 'expo-router'
import { Feather } from 'app/ui/icons'
import {
  useThread,
  useUpdateMessageThread,
  messageKeys
} from 'app/data/messages'
import { useQueryClient } from '@tanstack/react-query'
import { logger } from 'app/utils/logger'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})
export function NotificationNoteMessageScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const [isLoading, setLoading] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [key, setKey] = useState(0)
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState(null) as any
  const [threadDetails, setThreadDetails] = useState(null) as any
  const dispatch = useAppDispatch()
  const header = useAppSelector((state) => state.headerState.header)
  const userDetails = useAppSelector((state) => state.userProfileState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const item = useLocalSearchParams<any>()
  let noteData =
    item.noteData && item.noteData !== undefined
      ? JSON.parse(item.noteData)
      : {}
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}

  const queryClient = useQueryClient()

  const threadParams = {
    messageThread: {
      id: noteData.id ? noteData.id : ''
    }
  }

  const { data: threadData, isLoading: isThreadLoading } = useThread(
    header,
    threadParams
  )

  const updateThreadMutation = useUpdateMessageThread(header)

  useEffect(() => {
    if (threadData) {
      const data = threadData as any
      if (data.messageThread) {
        let messageThread = data.messageThread
        setThreadDetails(messageThread)
        let msgList =
          messageThread.messageList !== undefined &&
          messageThread.messageList !== null
            ? messageThread.messageList
            : []
        setMessageList(msgList)
        dispatch(messageListAction.setMessageList(msgList))
      }
    }
  }, [threadData])

  const handleFcmMessage = useCallback(async () => {
    try {
      Notifications.setNotificationHandler(null)
      await messaging().setBackgroundMessageHandler(async (message: any) => {
        updateMessageList(message)
      })
      await messaging().onMessage((message: any) => {
        updateMessageList(message)
      })
    } catch (e) {}
  }, [])
  const messageListFromStore = useAppSelector(
    (state) => state.messageList.messageList
  )
  async function updateMessageList(message: any) {
    let messageList: any = messageListFromStore
    let messeageContent = message.data ? message.data : {}
    let messageObject = {
      sender: messeageContent.MemberId ? messeageContent.MemberId : '',
      senderName: messeageContent.MsgCreatedBy
        ? messeageContent.MsgCreatedBy
        : '',
      body: messeageContent.MsgContent ? messeageContent.MsgContent : '',
      createdOn: messeageContent.MsgDateUTC ? messeageContent.MsgDateUTC : ''
    }
    messageList.push(messageObject)
    setMessageList(messageList)
    setKey(Math.random())
    setIsRender(!isRender)
  }
  useEffect(() => {
    handleFcmMessage()
  }, [])

  async function updateMessageThread() {
    if (message === '') {
      Alert.alert('', 'Please type a message')
    } else {
      setLoading(true)
      let list: object[] = []
      let object = {
        body: message,
        operation: 'Add'
      }
      list.push(object)
      updateThreadMutation.mutate(
        {
          messageThread: {
            id: threadDetails.id ? threadDetails.id : '',
            messageList: list
          }
        },
        {
          onSuccess: () => {
            setLoading(false)
            queryClient.invalidateQueries({
              queryKey: messageKeys.detail(threadParams)
            })
            setMessage('')
          },
          onError: (error) => {
            setLoading(false)
            logger.debug(error)
          }
        }
      )
    }
  }
  return (
    <View className=" flex-1">
      <PtsLoader loading={isLoading || isThreadLoading} />
      {isValidObject(memberData) ? (
        <PtsBackHeader title="Note Message" memberData={memberData} />
      ) : (
        <View />
      )}
      {isValidObject(threadDetails) ? (
        <Typography className="mt-5 text-left text-[16px] font-bold">
          {threadDetails.subject ? threadDetails.subject : ''}
        </Typography>
      ) : (
        <View />
      )}
      <SafeAreaView className="flex-1">
        <View className=" h-[90%] w-full bg-[#e0d8d0]">
          {isValidObject(messageList) && messageList.length > 0 ? (
            <ScrollView
              key={key}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
              className="max-h-[90%] "
            >
              {messageList.map((message: any, index: number) => {
                if (isValidObject(userDetails) && isValidObject(message)) {
                  if (message.sender !== userDetails.id) {
                    return (
                      <View
                        className="my-1 ml-[-45%] w-[50%] self-center rounded-[5px] bg-white p-1"
                        key={index}
                      >
                        <Typography style={{ color: '#30649c' }} className="">
                          {message.senderName ? message.senderName : ''}
                        </Typography>
                        <Typography className="">
                          {message.body ? message.body.trim() : ''}
                        </Typography>
                        <Typography
                          style={{ fontSize: 8 }}
                          className="text-right"
                        >
                          {message.createdOn
                            ? formatTimeToUserLocalTime(
                                message.createdOn,
                                userAddress,
                                memberAddress
                              )
                            : ''}
                        </Typography>
                      </View>
                    )
                  } else {
                    return (
                      <View
                        className="my-1 mr-[-45%] w-[50%] self-center rounded-[5px] bg-[#dfedcc] p-2"
                        key={index}
                      >
                        <Typography className="">
                          {message.body ? message.body : ''}
                        </Typography>
                        <Typography
                          style={{ fontSize: 8 }}
                          className="text-right"
                        >
                          {message.createdOn
                            ? formatTimeToUserLocalTime(
                                message.createdOn,
                                userAddress,
                                memberAddress
                              )
                            : ''}
                        </Typography>
                      </View>
                    )
                  }
                }
              })}
            </ScrollView>
          ) : (
            <View />
          )}
          <View className=" my-1 flex-row items-center">
            <View className="w-[85%] self-center">
              <TextInput
                defaultValue={message}
                multiline={true}
                placeholder={'Type a message'}
                className="rounded-[5px] border-[1px] border-gray-400 bg-white p-2"
                onChangeText={(value) => {
                  setMessage(value)
                }}
              />
            </View>
            <View className="ml-2 self-center">
              <TouchableOpacity
                className="h-[40px] w-[40px] items-center justify-center rounded-[20px] bg-[#0d9195]"
                onPress={() => {}}
              >
                <Feather
                  className=""
                  name={'send'}
                  size={20}
                  color={'white'}
                  onPress={() => {
                    updateMessageThread()
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
