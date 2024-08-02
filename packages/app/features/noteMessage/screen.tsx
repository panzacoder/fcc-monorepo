'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  ToastAndroid
} from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import messaging from '@react-native-firebase/messaging'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import * as Notifications from 'expo-notifications'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Typography } from 'app/ui/typography'
import { CallPostService } from 'app/utils/fetchServerData'
import { formatTimeToUserLocalTime, isValidObject } from 'app/ui/utils'
import store from 'app/redux/store'
import { useLocalSearchParams } from 'expo-router'
import { Feather } from 'app/ui/icons'
import {
  BASE_URL,
  GET_APPOINTMENT_NOTE,
  GET_EVENT_NOTE,
  GET_INCIDENT_NOTE,
  GET_MEDICAL_DEVICE_NOTE,
  GET_THREAD,
  GET_THREAD_PARTICIPANTS,
  UPDATE_THREAD_PARTICIPANTS,
  UPDATE_MESSAGE_THREAD
} from 'app/utils/urlConstants'
import { AddMessageThread } from 'app/ui/addMessageThread'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})
export function NoteMessageScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [message, setMessage] = useState('')
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState(null) as any
  const [messageList, setMessageList] = useState(null) as any
  const [threadParticipantsList, setThreadParticipantsList] = useState(
    []
  ) as any
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
    let url = ''
    let dataObject = {} as any
    if (item.component === 'General') {
      url = `${BASE_URL}${GET_THREAD}`
      dataObject = {
        header: header,
        messageThread: {
          id: noteData.id ? noteData.id : ''
        }
      }
    } else if (item.component === 'Appointment') {
      url = `${BASE_URL}${GET_APPOINTMENT_NOTE}`
      dataObject = {
        header: header,
        appointmentNote: {
          id: noteData.id ? noteData.id : ''
        }
      }
    } else {
      if (item.component === 'Incident') {
        url = `${BASE_URL}${GET_INCIDENT_NOTE}`
      } else if (item.component === 'Medical Device') {
        url = `${BASE_URL}${GET_MEDICAL_DEVICE_NOTE}`
      } else {
        url = `${BASE_URL}${GET_EVENT_NOTE}`
      }
      dataObject = {
        header: header,
        note: {
          id: noteData.id ? noteData.id : ''
        }
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
            let participantList =
              messageThread.participantList !== undefined &&
              messageThread.participantList !== null
                ? messageThread.participantList
                : []
            let list: any[] = []
            participantList.map((data: any) => {
              if (data.participantName) {
                let object = {
                  participantName: data.participantName
                }
                list.push(object)
              }
            })
            setParticipantsList(list)
          }
          if (
            item.component === 'Medical Device' &&
            data.data.purchaseNote !== undefined &&
            data.data.purchaseNote &&
            data.data.purchaseNote.messageThread
          ) {
            let messageThread = data.data.purchaseNote.messageThread
              ? data.data.purchaseNote.messageThread
              : {}
            setThreadDetails(messageThread)
            let messageList = messageThread.messageList
              ? messageThread.messageList
              : []
            setMessageList(messageList)
            let participantList = messageThread.participantList
              ? messageThread.participantList
              : []
            let list: any[] = []
            participantList.map((data: any) => {
              if (data.participantName) {
                let object = {
                  participantName: data.participantName
                }
                list.push(object)
              }
            })
            setParticipantsList(list)
          }
          setLoading(false)
        } else {
          setLoading(false)
          Alert.alert('', data.message)
        }
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
        getNoteDetails()
      })
      await messaging().onMessage((message: any) => {
        getNoteDetails()
      })
    } catch (e) {}
  }, [])
  useEffect(() => {
    getNoteDetails()
    handleFcmMessage()
  }, [])

  async function getThreadParticipants() {
    setLoading(true)
    let url = `${BASE_URL}${GET_THREAD_PARTICIPANTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      messageThreadType: {
        type: item.component
          ? item.component === 'Medical Device'
            ? 'Purchase'
            : item.component
          : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          const list = data.data.map((data: any, index: any) => {
            let object = data
            let isParticipant = false
            participantsList.map((participant: any, index: any) => {
              if (participant.participantName === data.name) {
                isParticipant = true
              }
            })
            object.isSelected = isParticipant
            return object
          })
          setThreadParticipantsList(list)
          console.log('setThreadParticipantsList', list)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  function isParticipantSelected(index: any) {
    threadParticipantsList[index].isSelected =
      !threadParticipantsList[index].isSelected
    setIsRender(!isRender)
    setThreadParticipantsList(threadParticipantsList)
  }
  const cancelClicked = () => {
    setIsMessageThread(false)
  }
  async function updateMessageThreadParticipants() {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_THREAD_PARTICIPANTS}`
    let list: object[] = []
    threadParticipantsList.map((data: any, index: any) => {
      if (data.isSelected === true) {
        let object = {
          user: {
            id: data.id
          },
          operation: 'ADD'
        }
        list.push(object)
      }
    })
    let dataObject = {
      header: header,
      messageThread: {
        id: threadDetails.id ? threadDetails.id : '',
        type: {
          type: item.component
            ? item.component === 'Medical Device'
              ? 'Purchase'
              : item.component
            : ''
        },
        participantList: list
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getNoteDetails()
          getThreadParticipants()
          setIsMessageThread(false)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
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
        <View
          style={{
            backgroundColor: '#005476',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
          className="w-full flex-row items-center py-2"
        >
          {isValidObject(participantsList) && participantsList.length > 0 ? (
            <ScrollView
              horizontal={true}
              className="w-[85%] max-w-[85%] flex-row"
            >
              {participantsList.map((participant: any, index: number) => {
                return (
                  <View key={index} className="ml-2">
                    <TouchableOpacity
                      onPress={() => {
                        // console.log('fullName', data.participantName)
                        if (participant.participantName) {
                          Alert.alert('', participant.participantName)
                        }
                      }}
                    >
                      <PtsNameInitials
                        fullName={
                          participant.participantName
                            ? participant.participantName
                            : ''
                        }
                      />
                    </TouchableOpacity>
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}
          <View>
            {isValidObject(threadDetails) &&
            true === threadDetails.isCreatedByUser ? (
              <View>
                <Feather
                  className="mr-2"
                  name={'user-plus'}
                  size={20}
                  color={'white'}
                  onPress={() => {
                    getThreadParticipants()
                    setIsMessageThread(true)
                  }}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
        <View className=" h-[90%] w-full bg-[#e0d8d0]">
          {isValidObject(messageList) && messageList.length > 0 ? (
            <ScrollView className="max-h-[90%] ">
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
      {true === isMessageThread ? (
        <View className="mt-2 h-[90%] w-full">
          <AddMessageThread
            participantsList={threadParticipantsList}
            noteData={noteData}
            cancelClicked={cancelClicked}
            isParticipantSelected={isParticipantSelected}
            createMessageThread={updateMessageThreadParticipants}
            isUpdateParticipants={true}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
