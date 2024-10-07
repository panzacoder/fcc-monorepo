'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard
} from 'react-native'
import { SafeAreaView } from 'app/ui/safe-area-view'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import messaging from '@react-native-firebase/messaging'
import messageListAction from 'app/redux/messageList/messageListAction'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import * as Notifications from 'expo-notifications'
import { Typography } from 'app/ui/typography'
import { CallPostService } from 'app/utils/fetchServerData'
import { formatTimeToUserLocalTime, isValidObject } from 'app/ui/utils'
import store from 'app/redux/store'
import { useLocalSearchParams } from 'expo-router'
import { Feather } from 'app/ui/icons'
import {
  BASE_URL,
  GET_THREAD,
  UPDATE_MESSAGE_THREAD
} from 'app/utils/urlConstants'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})
export function NotificationNoteMessageScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [key, setKey] = useState(0)
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState(null) as any
  const [threadDetails, setThreadDetails] = useState(null) as any
  const header = store.getState().headerState.header
  const userDetails = store.getState().userProfileState.header
  const item = useLocalSearchParams<any>()
  let noteData =
    item.noteData && item.noteData !== undefined
      ? JSON.parse(item.noteData)
      : {}
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  const getNoteDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_THREAD}`
    let dataObject = {
      header: header,
      messageThread: {
        id: noteData.id ? noteData.id : ''
      }
    }

    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          if (data.data.messageThread) {
            let messageThread = data.data.messageThread
            setThreadDetails(messageThread)
            let messageList =
              messageThread.messageList !== undefined &&
              messageThread.messageList !== null
                ? messageThread.messageList
                : []
            setMessageList(messageList)
            store.dispatch(messageListAction.setMessageList(messageList))
          }
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
  async function updateMessageList(message: any) {
    let messageList: any = store.getState().messageList.messageList
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
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.scrollView.scrollToEnd({ animated: true })
      }
    )
    getNoteDetails()
    handleFcmMessage()
    return () => {
      keyboardDidShowListener.remove()
    }
  }, [])

  async function updateMessageThread() {
    if (message === '') {
      Alert.alert('', 'Please type a message')
    } else {
      setLoading(true)
      let url = `${BASE_URL}${UPDATE_MESSAGE_THREAD}`
      let list: object[] = []
      let object = {
        body: message,
        operation: 'Add'
      }
      list.push(object)
      let dataObject = {
        header: header,
        messageThread: {
          id: threadDetails.id ? threadDetails.id : '',
          messageList: list
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          setLoading(false)
          if (data.status === 'SUCCESS') {
            getNoteDetails()
            setMessage('')
          } else {
            Alert.alert('', data.message)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
  }
  return (
    <View className=" flex-1">
      <PtsLoader loading={isLoading} />
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
              ref={(ref) => {
                this.scrollView = ref
              }}
              onContentSizeChange={() =>
                this.scrollView.scrollToEnd({ animated: true })
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
                            ? formatTimeToUserLocalTime(message.createdOn)
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
                            ? formatTimeToUserLocalTime(message.createdOn)
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
