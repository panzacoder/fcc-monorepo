'use client'

import { useState, useEffect } from 'react'
import { View, Alert, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { isBefore } from 'date-fns'
import type { ComponentProps } from 'react'
import type {
  EventDetail,
  EventDetailResponse,
  EventNote,
  EventReminder
} from 'app/data/events/types'
import type { Transportation } from 'app/ui/transportation'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Location } from 'app/ui/location'
import { formatUrl } from 'app/utils/format-url'
import { formatTimeToUserLocalTime, isEmpty } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { useAppSelector } from 'app/store'
import { useEventDetailsData } from './hooks/useEventDetailsData'
import { EventNotesSection } from './components/EventNotesSection'
import { EventRemindersSection } from './components/EventRemindersSection'
import { EventTransportationSection } from './components/EventTransportationSection'

type TransportationDisplayData = ComponentProps<typeof Transportation>['data']

export function EventDetailsScreen() {
  const router = useRouter()
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const item = useLocalSearchParams<Record<string, string>>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? (JSON.parse(item.memberData as string) as {
          member?: number | string
          firstname?: string
          lastname?: string
          email?: string
        })
      : ({} as {
          member?: number | string
          firstname?: string
          lastname?: string
          email?: string
        })
  let eventData =
    item.eventDetails && item.eventDetails !== undefined
      ? (JSON.parse(item.eventDetails as string) as { id: number | string })
      : ({} as { id?: number | string })

  const eventId = eventData.id ? eventData.id : ''
  const memberId = memberData.member ? memberData.member : ''

  const [eventDetails, setEventDetails] = useState<Partial<EventDetail>>({})
  const [eventStatus, setEventStatus] = useState('')
  const [notesList, setNotesList] = useState<EventNote[]>([])
  const [remindersList, setRemindersList] = useState<EventReminder[]>([])
  const [transportationList, setTransportationList] = useState<
    TransportationDisplayData[]
  >([])

  const hookData = useEventDetailsData(
    header,
    { eventId, memberId },
    {
      member: { id: memberData.member ? memberData.member : '' },
      messageThreadType: { type: 'Event' }
    }
  )

  const {
    data,
    isLoading,
    refetch,
    eventPrivileges,
    notePrivileges,
    transportationPrivileges
  } = hookData

  useEffect(() => {
    if (data) {
      const response = data as EventDetailResponse
      setEventDetails(response.event ? response.event : {})
      if (response.event?.status) {
        setEventStatus(response.event.status.status)
      }
      if (response.event?.noteList) {
        setNotesList(response.event.noteList)
      }
      if (response.event?.reminderList) {
        setRemindersList(response.event.reminderList)
      }
      if (response.event?.transportationList) {
        setTransportationList(
          response.event
            .transportationList as unknown as TransportationDisplayData[]
        )
      }
    }
  }, [data])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let eventDate = '',
    event = '',
    status = '',
    description = ''
  let eventAddress = {}
  if (!isEmpty(eventDetails)) {
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

  let titleStyle = 'font-normal w-[30%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-normal ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'

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

  async function deleteEvent() {
    hookData.deleteEvent.mutate(
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

  async function updateStatus(statusValue: string) {
    hookData.updateStatus.mutate(
      {
        event: {
          id: Number(eventDetails.id ?? 0),
          status: { status: statusValue },
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      },
      {
        onSuccess: () => {
          refetch()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to update status')
        }
      }
    )
  }

  const isMutating =
    hookData.deleteEvent.isPending ||
    hookData.createNote.isPending ||
    hookData.updateNote.isPending ||
    hookData.deleteNote.isPending ||
    hookData.createReminder.isPending ||
    hookData.updateReminder.isPending ||
    hookData.deleteReminder.isPending ||
    hookData.updateStatus.isPending ||
    hookData.createMessageThread.isPending ||
    hookData.deleteTransportation.isPending ||
    hookData.resendTransportation.isPending ||
    hookData.cancelTransportation.isPending

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading || isMutating} />
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
                  {isBefore(
                    new Date(eventDetails.date ? eventDetails.date : ''),
                    new Date()
                  ) ? (
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

          <EventNotesSection
            eventId={eventId}
            notesList={notesList}
            notePrivileges={notePrivileges}
            memberData={memberData}
            createNoteMutation={hookData.createNote}
            updateNoteMutation={hookData.updateNote}
            deleteNoteMutation={hookData.deleteNote}
            createMessageThreadMutation={hookData.createMessageThread}
            refetchParticipants={hookData.refetchParticipants}
            onRefetch={refetch}
          />

          <EventRemindersSection
            eventId={eventId}
            eventDate={eventDetails.date ?? ''}
            remindersList={remindersList}
            createReminderMutation={hookData.createReminder}
            updateReminderMutation={hookData.updateReminder}
            deleteReminderMutation={hookData.deleteReminder}
            onRefetch={refetch}
          />

          <EventTransportationSection
            eventId={eventDetails.id ?? 0}
            eventDate={eventDetails.date ?? ''}
            transportationList={transportationList}
            transportationPrivileges={transportationPrivileges}
            address={
              eventDetails.location?.address
                ? eventDetails.location.address
                : {}
            }
            deleteTransportationMutation={hookData.deleteTransportation}
            resendTransportationMutation={hookData.resendTransportation}
            cancelTransportationMutation={hookData.cancelTransportation}
            onRefetch={refetch}
          />

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
    </View>
  )
}
