'use client'

import { useState, useEffect, useRef } from 'react'
import { View, Alert, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import moment from 'moment'
import {
  useEventDetails as useEventDetailsQuery,
  useDeleteEvent,
  useCreateEventNote,
  useUpdateEventNote,
  useDeleteEventNote,
  useCreateEventReminder,
  useUpdateEventReminder,
  useDeleteEventReminder,
  useUpdateEventStatus
} from 'app/data/events'
import {
  useThreadParticipants,
  useCreateMessageThread
} from 'app/data/messages'
import {
  useDeleteTransportationEvent,
  useResendTransportationRequestEvent,
  useCancelTransportationRequestEvent
} from 'app/data/transportation'
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
import { useAppSelector } from 'app/redux/hooks'

export function EventDetailsScreen() {
  const eventPrivilegesRef = useRef<any>({})
  const notePrivilegesRef = useRef<any>({})
  const transportationPrivilegesRef = useRef<any>({})
  const router = useRouter()
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
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
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  let eventData =
    item.eventDetails && item.eventDetails !== undefined
      ? JSON.parse(item.eventDetails)
      : {}

  const eventId = eventData.id ? eventData.id : ''
  const memberId = memberData.member ? memberData.member : ''

  const {
    data: eventDetailsData,
    isLoading: isDetailsLoading,
    refetch: refetchDetails
  } = useEventDetailsQuery(header, { eventId, memberId })

  const deleteEventMutation = useDeleteEvent(header)
  const createNoteMutation = useCreateEventNote(header)
  const updateNoteMutation = useUpdateEventNote(header)
  const deleteNoteMutation = useDeleteEventNote(header)
  const createReminderMutation = useCreateEventReminder(header)
  const updateReminderMutation = useUpdateEventReminder(header)
  const deleteReminderMutation = useDeleteEventReminder(header)
  const updateStatusMutation = useUpdateEventStatus(header)
  const createMessageThreadMutation = useCreateMessageThread(header)
  const deleteTransportationEventMutation = useDeleteTransportationEvent(header)
  const resendTransportationRequestEventMutation =
    useResendTransportationRequestEvent(header)
  const cancelTransportationRequestEventMutation =
    useCancelTransportationRequestEvent(header)

  const { refetch: refetchParticipants } = useThreadParticipants(header, {
    member: { id: memberData.member ? memberData.member : '' },
    messageThreadType: { type: 'Event' }
  })

  useEffect(() => {
    if (eventDetailsData) {
      const data = eventDetailsData as any
      if (data.domainObjectPrivileges) {
        eventPrivilegesRef.current = data.domainObjectPrivileges.Event
          ? data.domainObjectPrivileges.Event
          : {}
        notePrivilegesRef.current = data.domainObjectPrivileges.EVENTNOTE
          ? data.domainObjectPrivileges.EVENTNOTE
          : data.domainObjectPrivileges.EventNote
            ? data.domainObjectPrivileges.EventNote
            : {}
        transportationPrivilegesRef.current = data.domainObjectPrivileges
          .EVENTTRANSPORTATION
          ? data.domainObjectPrivileges.EVENTTRANSPORTATION
          : data.domainObjectPrivileges.EventTransportation
            ? data.domainObjectPrivileges.EventTransportation
            : {}
      }
      setEventDetails(data.event ? data.event : {})
      if (data.event && data.event.status) {
        setEventStatus(data.event.status.status)
      }
      if (data.event && data.event.noteList) {
        setNotesList(data.event.noteList)
      }
      if (data.event && data.event.reminderList) {
        setRemindersList(data.event.reminderList)
      }
      if (data.event && data.event.transportationList) {
        setTransportationList(data.event.transportationList)
      }
    }
  }, [eventDetailsData])

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
      eventDate = formatTimeToUserLocalTime(
        eventDetails.date,
        userAddress,
        memberAddress
      )
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
    const notePayload: Record<string, unknown> = {
      event: {
        id: eventDetails.id ? eventDetails.id : ''
      },
      note: noteDetails,
      shortDescription: title
    }

    if (_.isEmpty(noteData)) {
      createNoteMutation.mutate(
        { note: notePayload },
        {
          onSuccess: () => {
            setIsAddNote(false)
            refetchDetails()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create note')
          }
        }
      )
    } else {
      notePayload.id = noteData.id ? noteData.id : ''
      updateNoteMutation.mutate(
        { note: notePayload },
        {
          onSuccess: () => {
            setIsAddNote(false)
            refetchDetails()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update note')
          }
        }
      )
    }
  }
  const cancelClicked = () => {
    setIsAddNote(false)
    setIsAddReminder(false)
    setIsAddTransportation(false)
    setIsMessageThread(false)
  }
  const editNote = (noteData: any) => {
    setNoteData(noteData)
    setIsAddNote(true)
  }
  async function deleteNote(noteId: any) {
    deleteNoteMutation.mutate(
      { note: { id: noteId } },
      {
        onSuccess: () => {
          refetchDetails()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete note')
        }
      }
    )
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
      refetchParticipants().then(({ data }) => {
        if (data) {
          const list = (data as any[]).map((item: any) => {
            let object = item
            object.isSelected = false
            return object
          })
          setParticipantsList(list)
          setNoteData(noteData)
          setIsMessageThread(true)
        }
      })
    }
  }
  function createMessageThread(subject: any, noteData: any) {
    setNoteData(noteData)
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
    createMessageThreadMutation.mutate(
      {
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
      },
      {
        onSuccess: () => {
          setIsMessageThread(false)
          refetchDetails()
          router.push(
            formatUrl('/circles/noteMessage', {
              component: 'Event',
              memberData: JSON.stringify(memberData),
              noteData: JSON.stringify(noteData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to create message thread')
        }
      }
    )
  }
  function isParticipantSelected(index: any) {
    participantsList[index].isSelected = !participantsList[index].isSelected
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }
  const editReminder = (remiderData: any) => {
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  async function createUpdateReminder(
    title: string,
    date: any,
    reminderData: any
  ) {
    const reminderPayload: Record<string, unknown> = {
      content: title,
      date: date,
      event: {
        id: eventDetails.id ? eventDetails.id : ''
      }
    }

    if (_.isEmpty(reminderData)) {
      createReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data: any) => {
            setIsAddReminder(false)
            setRemindersList(data ? data : [])
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create reminder')
          }
        }
      )
    } else {
      reminderPayload.id = reminderData.id
      updateReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data: any) => {
            setIsAddReminder(false)
            setRemindersList(data ? data : [])
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update reminder')
          }
        }
      )
    }
  }
  async function deleteReminder(reminderData: any) {
    deleteReminderMutation.mutate(
      {
        reminder: {
          id: reminderData.id ? reminderData.id : '',
          event: {
            id: reminderData.apointmentId ? reminderData.apointmentId : ''
          }
        }
      },
      {
        onSuccess: (data: any) => {
          setRemindersList(data ? data : [])
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete reminder')
        }
      }
    )
  }
  const editTransportation = (transportationData: any) => {
    setTransportationData(transportationData)
    setIsAddTransportation(true)
  }
  async function deleteEvent() {
    deleteEventMutation.mutate(
      { event: { id: eventDetails.id ? eventDetails.id : 0 } },
      {
        onSuccess: () => {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/eventsList', {
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete event')
        }
      }
    )
  }
  async function deleteResendCancelTransportation(
    count: any,
    transportData: any
  ) {
    const transportId = transportData.id ? transportData.id : ''
    const onSuccess = () => {
      refetchDetails()
      setIsShowTransportation(true)
    }
    if (count === 0) {
      deleteTransportationEventMutation.mutate(
        { transportation: { id: transportId } },
        {
          onSuccess,
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to delete transportation')
          }
        }
      )
    } else if (count === 1) {
      resendTransportationRequestEventMutation.mutate(
        { transportation: { id: transportId } },
        {
          onSuccess: () => {
            onSuccess()
            Alert.alert('', 'Request resent successfully')
          },
          onError: (error) => {
            Alert.alert(
              '',
              error.message || 'Failed to resend transportation request'
            )
          }
        }
      )
    } else {
      setTransportationList([])
      cancelTransportationRequestEventMutation.mutate(
        { transportationVo: { id: transportId } },
        {
          onSuccess: () => {
            onSuccess()
            Alert.alert('', 'Transportation request cancelled')
          },
          onError: (error) => {
            Alert.alert(
              '',
              error.message || 'Failed to cancel transportation request'
            )
          }
        }
      )
    }
  }
  async function updateStatus(status: any) {
    updateStatusMutation.mutate(
      {
        event: {
          id: eventDetails.id ? eventDetails.id : '',
          status: {
            status: status
          },
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      },
      {
        onSuccess: () => {
          refetchDetails()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to update status')
        }
      }
    )
  }

  const isMutating =
    deleteEventMutation.isPending ||
    createNoteMutation.isPending ||
    updateNoteMutation.isPending ||
    deleteNoteMutation.isPending ||
    createReminderMutation.isPending ||
    updateReminderMutation.isPending ||
    deleteReminderMutation.isPending ||
    updateStatusMutation.isPending ||
    createMessageThreadMutation.isPending ||
    deleteTransportationEventMutation.isPending ||
    resendTransportationRequestEventMutation.isPending ||
    cancelTransportationRequestEventMutation.isPending
  return (
    <View className="flex-1">
      <PtsLoader loading={isDetailsLoading || isMutating} />
      <PtsBackHeader title="Event Details" memberData={memberData} />

      <View className="h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[5] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View style={{ justifyContent: 'flex-end' }} className="flex-row">
              {getUserPermission(eventPrivilegesRef.current)
                .createPermission ? (
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
              {getUserPermission(eventPrivilegesRef.current)
                .updatePermission ? (
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
              (getUserPermission(eventPrivilegesRef.current).createPermission ||
                getUserPermission(eventPrivilegesRef.current)
                  .updatePermission ||
                getUserPermission(eventPrivilegesRef.current)
                  .deletePermission) ? (
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
              {getUserPermission(notePrivilegesRef.current).createPermission ? (
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
                        notePrivileges={notePrivilegesRef.current}
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
              <ScrollView className="">
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
              getUserPermission(transportationPrivilegesRef.current)
                .createPermission ? (
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
          {getUserPermission(eventPrivilegesRef.current).deletePermission ? (
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
