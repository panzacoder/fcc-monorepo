'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ScrollView
} from 'react-native'
import { SafeAreaView } from 'app/ui/safe-area-view'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import messaging from '@react-native-firebase/messaging'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import * as Notifications from 'expo-notifications'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Typography } from 'app/ui/typography'
import messageListAction from 'app/redux/messageList/messageListAction'
import { formatTimeToUserLocalTime, isValidObject } from 'app/ui/utils'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { useLocalSearchParams } from 'expo-router'
import { logger } from 'app/utils/logger'
import { Feather } from 'app/ui/icons'
import {
  useThread,
  useThreadParticipants,
  useUpdateThreadParticipants,
  useUpdateMessageThread,
  messageKeys
} from 'app/data/messages'
import { useAppointmentNote, appointmentKeys } from 'app/data/appointments'
import { useEventNote, eventKeys } from 'app/data/events'
import { useIncidentNote, incidentKeys } from 'app/data/incidents'
import {
  useMedicalDeviceNote,
  medicalDeviceKeys
} from 'app/data/medical-devices'
import { useQueryClient } from '@tanstack/react-query'
import { AddMessageThread } from 'app/ui/addMessageThread'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})
export function NoteMessageScreen() {
  const scrollViewRef = useRef<ScrollView>(null)
  const [isLoading, setLoading] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [message, setMessage] = useState('')
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState(null) as any
  const [messageList, setMessageList] = useState(null) as any
  const [key, setKey] = useState(0)
  const [threadParticipantsList, setThreadParticipantsList] = useState(
    []
  ) as any
  const [threadDetails, setThreadDetails] = useState(null) as any
  const [fetchParticipants, setFetchParticipants] = useState(false)
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

  const isGeneral = item.component === 'General'
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

  const participantsParams = {
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

  const { data: threadParticipantsData, isLoading: isParticipantsLoading } =
    useThreadParticipants(header, participantsParams)

  const updateParticipantsMutation = useUpdateThreadParticipants(header)
  const updateThreadMutation = useUpdateMessageThread(header)

  const noteId = noteData.id ? Number(noteData.id) : 0
  const isAppointment = !isGeneral && item.component === 'Appointment'
  const isEvent =
    !isGeneral &&
    item.component !== 'Appointment' &&
    item.component !== 'Incident' &&
    item.component !== 'Medical Device'
  const isIncident = !isGeneral && item.component === 'Incident'
  const isMedicalDevice = !isGeneral && item.component === 'Medical Device'

  const { data: appointmentNoteData, isLoading: isAppointmentNoteLoading } =
    useAppointmentNote(header, isAppointment ? noteId : 0)

  const { data: eventNoteData, isLoading: isEventNoteLoading } = useEventNote(
    header,
    { note: { id: isEvent ? noteId : 0 } }
  )

  const { data: incidentNoteData, isLoading: isIncidentNoteLoading } =
    useIncidentNote(header, isIncident ? noteId : 0)

  const { data: medicalDeviceNoteData, isLoading: isMedicalDeviceNoteLoading } =
    useMedicalDeviceNote(header, isMedicalDevice ? noteId : 0)

  function invalidateNonGeneralNote() {
    if (isAppointment) {
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.note(noteId)
      })
    } else if (isIncident) {
      queryClient.invalidateQueries({
        queryKey: incidentKeys.note(noteId)
      })
    } else if (isMedicalDevice) {
      queryClient.invalidateQueries({
        queryKey: medicalDeviceKeys.note(noteId)
      })
    } else {
      queryClient.invalidateQueries({
        queryKey: eventKeys.note(noteId)
      })
    }
  }

  function processMessageThread(messageThread: any) {
    setThreadDetails(messageThread)
    let msgList =
      messageThread.messageList !== undefined &&
      messageThread.messageList !== null
        ? messageThread.messageList
        : []
    setMessageList(msgList)
    dispatch(messageListAction.setMessageList(msgList))
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

  useEffect(() => {
    if (isGeneral && threadData) {
      const data = threadData as any
      if (data.messageThread) {
        processMessageThread(data.messageThread)
      }
      setIsDataReceived(true)
    }
  }, [threadData])

  useEffect(() => {
    if (isGeneral) return
    let noteResult: any = null
    if (isAppointment) noteResult = appointmentNoteData
    else if (isIncident) noteResult = incidentNoteData
    else if (isMedicalDevice) noteResult = medicalDeviceNoteData
    else if (isEvent) noteResult = eventNoteData
    if (!noteResult) return
    if (noteResult.messageThread) {
      processMessageThread(noteResult.messageThread)
    }
    if (
      isMedicalDevice &&
      noteResult.purchaseNote !== undefined &&
      noteResult.purchaseNote &&
      noteResult.purchaseNote.messageThread
    ) {
      let messageThread = noteResult.purchaseNote.messageThread
        ? noteResult.purchaseNote.messageThread
        : {}
      processMessageThread(messageThread)
    }
    setIsDataReceived(true)
  }, [
    appointmentNoteData,
    eventNoteData,
    incidentNoteData,
    medicalDeviceNoteData
  ])

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

  useEffect(() => {
    if (fetchParticipants && threadParticipantsData) {
      const data = threadParticipantsData as any
      const list = data.map((data: any, index: any) => {
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
      logger.debug('setThreadParticipantsList', list)
      setFetchParticipants(false)
    }
  }, [fetchParticipants, threadParticipantsData])

  async function getThreadParticipants() {
    setFetchParticipants(true)
    queryClient.invalidateQueries({
      queryKey: messageKeys.participants(participantsParams)
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
    updateParticipantsMutation.mutate(
      {
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
      },
      {
        onSuccess: () => {
          setLoading(false)
          if (isGeneral) {
            queryClient.invalidateQueries({
              queryKey: messageKeys.detail(threadParams)
            })
          } else {
            invalidateNonGeneralNote()
          }
          getThreadParticipants()
          setIsMessageThread(false)
        },
        onError: (error) => {
          setLoading(false)
          logger.debug(error)
        }
      }
    )
  }
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
            if (isGeneral) {
              queryClient.invalidateQueries({
                queryKey: messageKeys.detail(threadParams)
              })
            } else {
              invalidateNonGeneralNote()
            }
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

  const nonGeneralNoteLoading =
    (isAppointment && isAppointmentNoteLoading) ||
    (isEvent && isEventNoteLoading) ||
    (isIncident && isIncidentNoteLoading) ||
    (isMedicalDevice && isMedicalDeviceNoteLoading)

  const combinedLoading =
    isLoading ||
    (isGeneral && isThreadLoading) ||
    nonGeneralNoteLoading ||
    isParticipantsLoading

  return (
    <View className=" flex-1">
      <PtsLoader loading={combinedLoading} />
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
        <View key={key} className=" h-[90%] w-full bg-[#e0d8d0]">
          {isValidObject(messageList) && messageList.length > 0 ? (
            <ScrollView
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
          {isDataReceived ? (
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
          ) : (
            <View />
          )}
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
