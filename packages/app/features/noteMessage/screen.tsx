'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView
} from 'react-native'
// import { ScrollView } from 'app/ui/scroll-view'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Typography } from 'app/ui/typography'
import { CallPostService } from 'app/utils/fetchServerData'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
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
export function NoteMessageScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [message, setMessage] = useState('')
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState([])
  const [messageList, setMessageList] = useState([])
  const [threadParticipantsList, setThreadParticipantsList] = useState(
    []
  ) as any
  const [threadDetails, setThreadDetails] = useState({}) as any
  const header = store.getState().headerState.header
  const userDetails = store.getState().userProfileState.header
  const item = useLocalSearchParams<any>()
  let noteData = item.noteData !== undefined ? JSON.parse(item.noteData) : {}
  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
  console.log('noteData', JSON.stringify(noteData))

  const getNoteDetails = useCallback(async () => {
    setLoading(true)

    let url = ''
    let dataObject = {}
    if (item.component === 'Appointment') {
      url = `${BASE_URL}${GET_APPOINTMENT_NOTE}`
      dataObject = {
        header: header,
        appointmentNote: {
          id: noteData.id ? noteData.id : ''
        }
      }
    } else if (item.component === 'General') {
      url = `${BASE_URL}${GET_THREAD}`
      dataObject = {
        header: header,
        messageThread: {
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
        setLoading(false)
        if (data.status === 'SUCCESS') {
          if (data.data.messageThread) {
            setThreadDetails(data.data.messageThread)
            setMessageList(
              data.data.messageThread.messageList
                ? data.data.messageThread.messageList
                : []
            )
            setParticipantsList(
              data.data.messageThread.participantList
                ? data.data.messageThread.participantList
                : []
            )
          }
          if (
            item.component === 'Medical Device' &&
            data.data.purchaseNote &&
            data.data.purchaseNote.messageThread
          ) {
            setThreadDetails(data.data.purchaseNote.messageThread)
            setMessageList(
              data.data.purchaseNote.messageThread.messageList
                ? data.data.purchaseNote.messageThread.messageList
                : []
            )
            setParticipantsList(
              data.data.purchaseNote.messageThread.participantList
                ? data.data.purchaseNote.messageThread.participantList
                : []
            )
          }
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
  useEffect(() => {
    getNoteDetails()
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
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('in getThreadParticipants', JSON.stringify(data.data))
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
    console.log('threadParticipantsList', threadParticipantsList)
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
    // console.log('dataObject', JSON.stringify(dataObject))
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
      // console.log('dataObject', JSON.stringify(dataObject))
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
  //unable to set some styling with nativewind, so used 'style' props instead.
  return (
    <SafeAreaView className="h-full flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Messages" memberData={memberData} />
      <Typography className="mt-5 text-left text-[16px] font-bold">
        {threadDetails.subject ? threadDetails.subject : ''}
      </Typography>
      <View
        style={{
          backgroundColor: '#005476',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5
        }}
        className="w-full flex-row items-center py-2"
      >
        <ScrollView horizontal={true} className="w-[85%] max-w-[85%] flex-row">
          {participantsList.map((data: any, index: number) => {
            return (
              <View key={index} className="ml-2">
                <TouchableOpacity
                  onPress={() => {
                    // console.log('fullName', data.participantName)
                    if (data.participantName) {
                      Alert.alert('', data.participantName)
                    }
                  }}
                >
                  <PtsNameInitials
                    fullName={data.participantName ? data.participantName : ''}
                  />
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
        {threadDetails.isCreatedByUser ? (
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
      {/* <Image
        src={require('app/assets/window.png')}
        className="mt-[5px] h-[70%] w-full self-center"
        resizeMode={'cover'}
        alt="logo"
      /> */}
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        className="h-[70%] max-h-[70%] w-full bg-[#e0d8d0]"
      >
        {messageList.map((data: any, index: number) => {
          if (data.sender !== userDetails.id) {
            return (
              <View
                className="my-1 ml-[-45%] w-[50%] self-center rounded-[5px] bg-white p-1"
                key={index}
              >
                <Typography style={{ color: '#30649c' }} className="">
                  {data.senderName ? data.senderName : ''}
                </Typography>
                <Typography className="">
                  {data.body ? data.body.trim() : ''}
                </Typography>
                <Typography style={{ fontSize: 8 }} className="text-right">
                  {data.createdOn
                    ? formatTimeToUserLocalTime(data.createdOn)
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
                  {data.body ? data.body : ''}
                </Typography>
                <Typography style={{ fontSize: 8 }} className="text-right">
                  {data.createdOn
                    ? formatTimeToUserLocalTime(data.createdOn)
                    : ''}
                </Typography>
              </View>
            )
          }
        })}
      </ScrollView>
      <View className="absolute bottom-0 my-1 flex-row items-center">
        <View className="w-[85%] self-center">
          <TextInput
            defaultValue={message}
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
      {/* </View> */}
      {isMessageThread ? (
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
    </SafeAreaView>
  )
}
