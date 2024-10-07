'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import moment from 'moment'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_EVENT_DETAILS,
  GET_THREAD_PARTICIPANTS,
  CREATE_MESSAGE_THREAD,
  DELETE_EVENT_NOTE,
  CREATE_EVENT_NOTE,
  UPDATE_EVENT_NOTE,
  CREATE_EVENT_REMINDER,
  UPDATE_EVENT_REMINDER,
  DELETE_EVENT_REMINDER,
  RESEND_TRANSPORTATION_REQUEST_EVENT,
  CANCEL_TRANSPORTATION_REQUEST_EVENT,
  DELETE_TRANSPORTATION_EVENT,
  DELETE_EVENT,
  UPDATE_EVENT_STATUS
} from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { Location } from 'app/ui/location'
import { Note } from 'app/ui/note'
import { Reminder } from 'app/ui/reminder'
import { AddEditNote } from 'app/ui/addEditNote'
import { Transportation } from 'app/ui/transportation'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { AddEditTransport } from 'app/ui/addEditTransport'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'

let eventPrivileges = {}
let notePrivileges = {}
let transportationPrivileges = {}
export function EventDetailsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [key, setKey] = useState(0)
  const [eventStatus, setEventStatus] = useState('')
  const [isAddRemider, setIsAddReminder] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [participantsList, setParticipantsList] = useState([]) as any
  const [isAddTransportation, setIsAddTransportation] = useState(false)
  const [isShowTransportation, setIsShowTransportation] = useState(false)
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isShowReminder, setIsShowReminder] = useState(false)
  const [eventDetails, setEventDetails] = useState({}) as any
  const [noteData, setNoteData] = useState({})
  const [transportationData, setTransportationData] = useState({})
  const [notesList, setNotesList] = useState([])
  const [reminderData, setReminderData] = useState({})
  const [remindersList, setRemindersList] = useState([])
  const [transportationList, setTransportationList] = useState([])
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  let eventData =
    item.eventDetails && item.eventDetails !== undefined
      ? JSON.parse(item.eventDetails)
      : {}
  // console.log('eventDetails', JSON.stringify(eventDetails))
  const getEventDetails = useCallback(
    async (isFromCreateThread: any, noteData: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_EVENT_DETAILS}`
      let dataObject = {
        header: header,
        event: {
          id: eventData.id ? eventData.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            console.log('data', JSON.stringify(data.data))
            if (data.data.domainObjectPrivileges) {
              eventPrivileges = data.data.domainObjectPrivileges.Event
                ? data.data.domainObjectPrivileges.Event
                : {}
              notePrivileges = data.data.domainObjectPrivileges.EVENTNOTE
                ? data.data.domainObjectPrivileges.EVENTNOTE
                : data.data.domainObjectPrivileges.EventNote
                  ? data.data.domainObjectPrivileges.EventNote
                  : {}
              transportationPrivileges = data.data.domainObjectPrivileges
                .EVENTTRANSPORTATION
                ? data.data.domainObjectPrivileges.EVENTTRANSPORTATION
                : data.data.domainObjectPrivileges.EventTransportation
                  ? data.data.domainObjectPrivileges.EventTransportation
                  : {}
            }
            console.log('data.data.event', JSON.stringify(data.data.event))
            setEventDetails(data.data.event ? data.data.event : {})
            if (data.data.event.status) {
              setEventStatus(data.data.event.status.status)
            }
            if (data.data.event.noteList) {
              setNotesList(data.data.event.noteList)
            }
            if (data.data.event.reminderList) {
              setRemindersList(data.data.event.reminderList)
            }
            if (data.data.event.transportationList) {
              setTransportationList(data.data.event.transportationList)
            }
            setIsRender(!isRender)
            if (isFromCreateThread) {
              router.push(
                formatUrl('/circles/noteMessage', {
                  component: 'Event',
                  memberData: JSON.stringify(memberData),
                  noteData: JSON.stringify(noteData)
                })
              )
            }
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error', error)
        })
    },
    []
  )
  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/eventsList', {
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }
  useEffect(() => {
    if (!isAddNote) {
      getEventDetails(false, noteData)
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  let eventDate = '',
    event = '',
    status = '',
    description = ''
  let eventAddress = {}
  if (!_.isEmpty(eventDetails)) {
    if (eventDetails.date) {
      eventDate = formatTimeToUserLocalTime(eventDetails.date)
    }
    if (eventDetails.title) {
      event = eventDetails.title
    }
    if (eventDetails.status) {
      status = eventDetails.status.status
    }
    if (eventDetails.location) {
      eventAddress = eventDetails.location
    }
    if (eventDetails.description) {
      description = eventDetails.description
    }
  }
  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
      </View>
    )
  }

  async function createUpdateNote(
    occurance: any,
    noteDetails: any,
    title: any,
    noteData: any
  ) {
    setLoading(true)
    let url = ''
    let dataObject = {
      header: header,
      note: {
        id: '',
        event: {
          id: eventDetails.id ? eventDetails.id : ''
        },
        note: noteDetails,
        shortDescription: title
      }
    }
    if (_.isEmpty(noteData)) {
      url = `${BASE_URL}${CREATE_EVENT_NOTE}`
    } else {
      dataObject.note.id = noteData.id ? noteData.id : ''
      url = `${BASE_URL}${UPDATE_EVENT_NOTE}`
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsAddNote(false)
          getEventDetails(false, noteData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const cancelClicked = () => {
    setIsAddNote(false)
    setIsAddReminder(false)
    setIsAddTransportation(false)
    setIsMessageThread(false)
  }
  const editNote = (noteData: any) => {
    // console.log('noteData', JSON.stringify(noteData))
    setNoteData(noteData)
    setIsAddNote(true)
  }
  async function deleteNote(noteId: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_EVENT_NOTE}`
    let dataObject = {
      header: header,
      note: {
        id: noteId
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getEventDetails(false, noteData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const messageThreadClicked = (noteData: any) => {
    setNoteData(noteData)
    if (noteData.hasMsgThread) {
      router.push(
        formatUrl('/circles/noteMessage', {
          component: 'Event',
          memberData: JSON.stringify(memberData),
          noteData: JSON.stringify(noteData)
        })
      )
    } else {
      getThreadParticipants(noteData)
    }
  }
  async function getThreadParticipants(noteData: any) {
    setLoading(true)
    let url = `${BASE_URL}${GET_THREAD_PARTICIPANTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      messageThreadType: {
        type: 'Event'
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('in getThreadParticipants')
          const list = data.data.map((data: any, index: any) => {
            let object = data
            object.isSelected = false
            return object
          })
          setParticipantsList(list)
          setNoteData(noteData)
          setIsMessageThread(true)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  function createMessageThread(subject: any, noteData: any) {
    setLoading(true)
    setNoteData(noteData)
    let url = `${BASE_URL}${CREATE_MESSAGE_THREAD}`
    let list: object[] = []
    participantsList.map((data: any, index: any) => {
      if (data.isSelected === true) {
        let object = {
          user: {
            id: data.id
          }
        }
        list.push(object)
      }
    })
    let dataObject = {
      header: header,
      messageThread: {
        subject: subject,
        member: memberData.member ? memberData.member : '',
        noteId: noteData.id ? noteData.id : '',
        type: {
          type: 'Event'
        },
        participantList: list,
        eventNote: {
          id: noteData.id ? noteData.id : ''
        },
        messageList: []
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsMessageThread(false)
          getEventDetails(true, noteData)
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
    participantsList[index].isSelected = !participantsList[index].isSelected
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }
  const editReminder = (remiderData: any) => {
    // console.log('remiderData', JSON.stringify(remiderData))
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  async function createUpdateReminder(
    title: string,
    date: any,
    reminderData: any
  ) {
    setLoading(true)
    let url = ''
    let dataObject = {
      header: header,
      reminder: {
        id: '',
        content: title,
        date: date,
        event: {
          id: eventDetails.id ? eventDetails.id : ''
        }
      }
    }
    if (_.isEmpty(reminderData)) {
      url = `${BASE_URL}${CREATE_EVENT_REMINDER}`
    } else {
      url = `${BASE_URL}${UPDATE_EVENT_REMINDER}`
      dataObject.reminder.id = reminderData.id
    }

    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // setTransportationData(data.data ? data.data : {})
          setIsAddReminder(false)
          setRemindersList(data.data ? data.data : [])
          setKey(Math.random())
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function deleteReminder(reminderData: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_EVENT_REMINDER}`
    let dataObject = {
      header: header,
      reminder: {
        id: reminderData.id ? reminderData.id : '',
        event: {
          id: reminderData.apointmentId ? reminderData.apointmentId : ''
        }
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setRemindersList(data.data ? data.data : [])
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function createUpdateTransportation(url: any, dataObject: any) {
    setTransportationList([])
    setLoading(true)
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          cancelClicked()
          getEventDetails(false, noteData)
          setIsRender(!isRender)
          setIsShowTransportation(true)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const editTransportation = (transportationData: any) => {
    setTransportationData(transportationData)
    setIsAddTransportation(true)
  }
  async function deleteEvent() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_EVENT}`
    let dataObject = {
      header: header,
      event: {
        id: eventDetails.id ? eventDetails.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/eventsList', {
              memberData: JSON.stringify(memberData)
            })
          )
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function deleteResendCancelTransportation(
    count: any,
    transportData: any
  ) {
    setLoading(true)
    let url = ''
    let dataObject = {}
    if (count === 0) {
      url = `${BASE_URL}${DELETE_TRANSPORTATION_EVENT}`
    } else if (count === 1) {
      url = `${BASE_URL}${RESEND_TRANSPORTATION_REQUEST_EVENT}`
    } else {
      setTransportationList([])
      url = `${BASE_URL}${CANCEL_TRANSPORTATION_REQUEST_EVENT}`
    }
    if (count === 0 || count === 1) {
      dataObject = {
        header: header,
        transportation: {
          id: transportData.id ? transportData.id : ''
        }
      }
    } else {
      dataObject = {
        header: header,
        transportationVo: {
          id: transportData.id ? transportData.id : ''
        }
      }
    }

    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getEventDetails(false, noteData)
          setIsShowTransportation(true)
          if (count !== 0) {
            Alert.alert('', data.message)
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
  }
  async function updateStatus(status: any) {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_EVENT_STATUS}`
    let dataObject = {
      header: header,
      event: {
        id: eventDetails.id ? eventDetails.id : '',
        status: {
          status: status
        },
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getEventDetails(false, noteData)
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
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Event Details" memberData={memberData} />

      <View className="h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[5] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View style={{ justifyContent: 'flex-end' }} className="flex-row">
              {getUserPermission(eventPrivileges).createPermission ? (
                <Button
                  className="w-[50%]"
                  title="Create Similar"
                  variant="border"
                  onPress={() => {
                    router.push(
                      formatUrl('/circles/addEditEvent', {
                        memberData: JSON.stringify(memberData),
                        eventDetails: JSON.stringify(eventDetails),
                        isFromCreateSimilar: 'true'
                      })
                    )
                  }}
                />
              ) : (
                <View />
              )}
              {getUserPermission(eventPrivileges).updatePermission ? (
                <Button
                  className="ml-[5px] w-[30%]"
                  title="Edit"
                  variant="border"
                  onPress={() => {
                    router.push(
                      formatUrl('/circles/addEditEvent', {
                        memberData: JSON.stringify(memberData),
                        eventDetails: JSON.stringify(eventDetails)
                      })
                    )
                  }}
                />
              ) : (
                <View />
              )}
            </View>
            <View className="w-full">
              <View className="mt-2 flex-row">
                <Typography className=" w-[95%] text-[15px] font-bold text-black">
                  {event}
                </Typography>
              </View>
              {getDetailsView('Date', eventDate)}
              {getDetailsView('Status', status)}
              {getDetailsView('Description', description)}
              {(status === 'Scheduled' || status === 'ReScheduled') &&
              (getUserPermission(eventPrivileges).createPermission ||
                getUserPermission(eventPrivileges).updatePermission ||
                getUserPermission(eventPrivileges).deletePermission) ? (
                <View className="mt-5 w-full flex-row justify-center">
                  {moment(eventDetails.date ? eventDetails.date : '')
                    .utc()
                    .isBefore(moment().utc()) ? (
                    <Button
                      className="w-[50%] bg-[#ef6603]"
                      title="Mark Completed"
                      variant="default"
                      onPress={() => {
                        updateStatus('Completed')
                      }}
                    />
                  ) : (
                    <View />
                  )}

                  <Button
                    className="ml-3 w-[50%] bg-[#ef6603]"
                    title="Mark Cancelled"
                    variant="default"
                    onPress={() => {
                      Alert.alert(
                        'Do you really want to cancel event?',
                        'It cannot be recovered once cancelled.',
                        [
                          {
                            text: 'Ok',
                            onPress: () => {
                              updateStatus('Cancelled')
                            }
                          },
                          { text: 'Cancel', onPress: () => {} }
                        ]
                      )
                    }}
                  />
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <Typography className="font-[15px] font-bold text-[#287CFA]">
              {'Location Details'}
            </Typography>
            <View className="w-full">
              <Location data={eventAddress}></Location>
            </View>
          </View>

          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setIsShowNotes(!isShowNotes)
                }}
                className="w-[60%] flex-row"
              >
                <Typography className="font-400 text-[14px] font-bold text-black">
                  {'Notes'}
                  {notesList.length > 0 ? ' (' + notesList.length + ') ' : ''}
                </Typography>
                {notesList.length > 0 ? (
                  <Feather
                    className=""
                    name={!isShowNotes ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'black'}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
              {getUserPermission(notePrivileges).createPermission ? (
                <Button
                  className=""
                  title="Add Note"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setNoteData({})
                    setIsAddNote(true)
                  }}
                />
              ) : (
                <View />
              )}
            </View>

            {notesList.length > 0 && isShowNotes ? (
              <ScrollView className="">
                {notesList.map((data: any, index: number) => {
                  return (
                    <View key={index}>
                      <Note
                        component={'Event'}
                        data={data}
                        editNote={editNote}
                        deleteNote={deleteNote}
                        messageThreadClicked={messageThreadClicked}
                        notePrivileges={notePrivileges}
                      />
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>

          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setIsShowReminder(!isShowReminder)
                }}
                className="w-[50%] flex-row"
              >
                <Typography className="font-400 text-[14px] font-bold text-black">
                  {'Reminders'}
                  {remindersList.length > 0
                    ? ' (' + remindersList.length + ') '
                    : ''}
                </Typography>
                {remindersList.length > 0 ? (
                  <Feather
                    className=""
                    name={!isShowReminder ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'black'}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
              {moment(eventDetails.date ? eventDetails.date : '')
                .utc()
                .isAfter(moment().utc()) ? (
                <Button
                  className=""
                  title="Add Reminder"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setReminderData({})
                    setIsAddReminder(true)
                  }}
                />
              ) : (
                <View />
              )}
            </View>

            {remindersList.length > 0 && isShowReminder ? (
              <ScrollView key={key} className="">
                {remindersList.map((data: any, index: number) => {
                  return (
                    <View key={index}>
                      <Reminder
                        data={data}
                        editReminder={editReminder}
                        deleteReminder={deleteReminder}
                      />
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>

          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setIsShowTransportation(!isShowTransportation)
                }}
                className="w-[50%] flex-row"
              >
                <Typography className="font-400 text-[14px] font-bold text-black">
                  {'Transportation'}
                  {transportationList.length > 0
                    ? ' (' + transportationList.length + ') '
                    : ''}
                </Typography>
                {transportationList.length > 0 ? (
                  <Feather
                    className=""
                    name={!isShowTransportation ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'black'}
                  />
                ) : (
                  <View />
                )}
              </TouchableOpacity>
              {moment(eventDetails.date ? eventDetails.date : '')
                .utc()
                .isAfter(moment().utc()) &&
              getUserPermission(transportationPrivileges).createPermission ? (
                <Button
                  className=""
                  title="Transportation"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setTransportationData({})
                    setIsAddTransportation(true)
                  }}
                />
              ) : (
                <View />
              )}
            </View>
            {transportationList.length > 0 && isShowTransportation ? (
              <ScrollView className="">
                {transportationList.map((data: any, index: number) => {
                  return (
                    <View key={index}>
                      <Transportation
                        component={'Event'}
                        data={data}
                        editTransportation={editTransportation}
                        deleteResendCancelTransportation={
                          deleteResendCancelTransportation
                        }
                      />
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>
          {getUserPermission(eventPrivileges).deletePermission ? (
            <View className="mx-5 my-5">
              <Button
                className=""
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Event?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteEvent()
                      },
                      { text: 'Cancel', onPress: () => {} }
                    ]
                  )
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
      {isAddNote ? (
        <View className="h-full w-full">
          <AddEditNote
            component={'Event'}
            noteData={noteData}
            cancelClicked={cancelClicked}
            createUpdateNote={createUpdateNote}
          />
        </View>
      ) : (
        <View />
      )}
      {isAddRemider ? (
        <View className="h-full w-full">
          <AddEditReminder
            component={'Event'}
            reminderData={reminderData}
            cancelClicked={cancelClicked}
            createUpdateReminder={createUpdateReminder}
          />
        </View>
      ) : (
        <View />
      )}
      {isAddTransportation ? (
        <View className="h-full w-full">
          <AddEditTransport
            component={'Event'}
            address={
              eventDetails.location && eventDetails.location.address
                ? eventDetails.location.address
                : {}
            }
            date={eventDetails.date ? eventDetails.date : ''}
            transportData={transportationData}
            appointmentId={eventDetails.id}
            cancelClicked={cancelClicked}
            createUpdateTransportation={createUpdateTransportation}
          />
        </View>
      ) : (
        <View />
      )}
      {isMessageThread ? (
        <View className="h-full w-full">
          <AddMessageThread
            participantsList={participantsList}
            noteData={noteData}
            cancelClicked={cancelClicked}
            isParticipantSelected={isParticipantSelected}
            createMessageThread={createMessageThread}
            isUpdateParticipants={false}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
