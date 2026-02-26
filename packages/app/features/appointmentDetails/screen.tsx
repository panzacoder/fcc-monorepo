'use client'
import { useState, useEffect } from 'react'
import { View, Alert, Linking, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import type { ComponentProps } from 'react'
import { isBefore } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  formatTimeToUserLocalTime,
  convertPhoneNumberToUsaPhoneNumberFormat,
  isEmpty
} from 'app/ui/utils'
import { useAppSelector } from 'app/store'
import { formatUrl } from 'app/utils/format-url'
import { Location } from 'app/ui/location'
import { Button } from 'app/ui/button'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { logger } from 'app/utils/logger'
import { useAppointmentDetailsData } from './hooks/useAppointmentDetailsData'
import { AppointmentNotesSection } from './components/AppointmentNotesSection'
import { AppointmentRemindersSection } from './components/AppointmentRemindersSection'
import { AppointmentTransportationSection } from './components/AppointmentTransportationSection'

interface NoteItem {
  id: number | string
  shortDescription?: string
  note?: string
  occurance?: { occurance: string }
  hasMsgThread?: boolean
}

interface ReminderItem {
  id: number | string
  content?: string
  date?: string
  apointmentId?: number | string
}

interface TransportItem {
  id: number | string
  apointmentId?: number | string
  [key: string]: unknown
}

interface AppointmentDetailData {
  id?: number | string
  date?: string
  description?: string
  purpose?: string
  type?: { type: string }
  status?: { status: string }
  member?: { id: number | string }
  doctorLocation?: {
    id?: number | string
    doctor?: {
      salutation?: string
      firstName?: string
      lastName?: string
      specialist?: string
      phone?: string
      email?: string
      website?: string
      websiteuser?: string
    }
    address?: Record<string, unknown>
    [key: string]: unknown
  }
  facilityLocation?: {
    id?: number | string
    facility?: {
      name?: string
      type?: string
      phone?: string
      email?: string
      website?: string
      websiteuser?: string
    }
    address?: Record<string, unknown>
    [key: string]: unknown
  }
  noteList?: NoteItem[]
  reminderList?: ReminderItem[]
  transportationList?: TransportItem[]
}

export function AppointmentDetailsScreen() {
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const item = useLocalSearchParams<Record<string, string>>()
  const router = useRouter()
  let appointmentInfo = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  const [memberData, setMemberData] = useState<Record<string, unknown>>(
    item.memberData ? JSON.parse(item.memberData as string) : {}
  )
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [notesList, setNotesList] = useState<NoteItem[]>([])
  const [remindersList, setRemindersList] = useState<ReminderItem[]>([])
  const [transportationList, setTransportationList] = useState<TransportItem[]>(
    []
  )
  const [appointmentDetails, setAppointmentDetails] = useState<
    Partial<AppointmentDetailData>
  >({})
  const appointmentId = appointmentInfo.id ? Number(appointmentInfo.id) : 0

  const hookData = useAppointmentDetailsData(header, appointmentId, {
    member: {
      id: memberData.member ? (memberData.member as number | string) : ''
    },
    messageThreadType: { type: 'Appointment' }
  })

  const {
    data,
    isLoading,
    refetch,
    appointmentPrivileges,
    notePrivileges,
    transportationPrivileges
  } = hookData

  useEffect(() => {
    if (hookData.allMemberDetailsData) {
      const result = hookData.allMemberDetailsData as {
        memberList?: Array<{
          member: number | string
          [key: string]: unknown
        }>
      }
      if (result.memberList) {
        result.memberList.forEach((member) => {
          if (memberData.member === member.member) {
            setMemberData(member)
            logger.debug('setMemberData', JSON.stringify(member))
          }
        })
      }
    }
  }, [hookData.allMemberDetailsData])

  useEffect(() => {
    if (data) {
      if (data.appointmentWithPreviousAppointment?.appointment) {
        const details = data.appointmentWithPreviousAppointment
          .appointment as AppointmentDetailData
        setAppointmentDetails(details)
        setNotesList(details.noteList ?? [])
        setRemindersList(details.reminderList ?? [])
        setTransportationList(details.transportationList ?? [])
      }
      setIsDataReceived(true)
    }
  }, [data])

  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/appointmentsList', {
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

  let doctorFacilityName = '',
    specialist = '',
    phone = '',
    email = '',
    website = '',
    websiteUser = '',
    apptDate = '',
    status = '',
    purpose = '',
    description = ''
  let doctorFacilityAddress: Record<string, unknown> = {}

  if (!isEmpty(appointmentDetails)) {
    if (appointmentDetails.date) {
      apptDate = formatTimeToUserLocalTime(
        appointmentDetails.date,
        userAddress,
        memberAddress
      )
    }
    status = appointmentDetails.status?.status ?? ''
    purpose = appointmentDetails.purpose ?? ''
    description = appointmentDetails.description ?? ''

    if (appointmentDetails.doctorLocation) {
      doctorFacilityAddress = appointmentDetails.doctorLocation
      doctorFacilityAddress.component = 'Appointment'
    } else if (appointmentDetails.facilityLocation) {
      doctorFacilityAddress = appointmentDetails.facilityLocation
      doctorFacilityAddress.component = 'Appointment'
    }

    const doc = appointmentDetails.doctorLocation?.doctor
    const fac = appointmentDetails.facilityLocation?.facility
    if (doc) {
      if (doc.salutation) doctorFacilityName += doc.salutation + '. '
      if (doc.firstName) doctorFacilityName += doc.firstName
      if (doc.lastName) doctorFacilityName += ' ' + doc.lastName
      specialist = doc.specialist ?? ''
      phone = doc.phone
        ? convertPhoneNumberToUsaPhoneNumberFormat(doc.phone) ?? ''
        : ''
      email = doc.email ?? ''
      website = doc.website ?? ''
      websiteUser = doc.websiteuser ?? ''
    } else if (fac) {
      doctorFacilityName = fac.name ?? ''
      specialist = fac.type ?? ''
      phone = fac.phone
        ? convertPhoneNumberToUsaPhoneNumberFormat(fac.phone) ?? ''
        : ''
      email = fac.email ?? ''
      website = fac.website ?? ''
      websiteUser = fac.websiteuser ?? ''
    }
  }

  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'

  function getDetailsView(
    title: string,
    value: string,
    isIcon?: boolean,
    iconValue?: ComponentProps<typeof Feather>['name']
  ) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
        {isIcon && iconValue ? (
          <Feather
            onPress={() => {
              if (title === 'Phone' && value !== '') {
                Linking.openURL(`tel:${value}`)
              } else if (title === 'Email' && value !== '') {
                Linking.openURL(`mailto:${value}`)
              } else if (title === 'Website' && value !== '') {
                Linking.openURL(
                  `http://${String(value).replace(/(^\w+:|^)\/\//, '')}`
                )
              }
            }}
            className="ml-[-10px]"
            name={iconValue}
            size={20}
            color={'black'}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }

  async function sendInvite() {
    hookData.sendCalendarInvite.mutate(
      {
        appointment: {
          id: appointmentDetails.id ? appointmentDetails.id : ''
        }
      },
      {
        onSuccess: () => {
          Alert.alert(
            '',
            `Send to\n${
              memberData.email ? memberData.email : ''
            } . \n\nCheck your email for the appointment invite. `
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to send calendar invite')
        }
      }
    )
  }

  async function deleteAppointment() {
    hookData.deleteAppointment.mutate(
      {
        appointment: {
          id: appointmentDetails.id ? Number(appointmentDetails.id) : 0
        }
      },
      {
        onSuccess: () => {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/appointmentsList', {
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete appointment')
        }
      }
    )
  }

  async function updateStatus(statusValue: string) {
    hookData.updateStatus.mutate(
      {
        appointment: {
          id: appointmentDetails.id ? appointmentDetails.id : '',
          status: { status: statusValue },
          member: {
            id: memberData.member ? (memberData.member as number | string) : ''
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
    hookData.deleteAppointment.isPending ||
    hookData.createNote.isPending ||
    hookData.updateNote.isPending ||
    hookData.deleteNote.isPending ||
    hookData.createReminder.isPending ||
    hookData.updateReminder.isPending ||
    hookData.deleteReminder.isPending ||
    hookData.updateStatus.isPending ||
    hookData.sendCalendarInvite.isPending ||
    hookData.createMessageThread.isPending ||
    hookData.deleteTransportation.isPending ||
    hookData.resendTransportation.isPending ||
    hookData.cancelTransportation.isPending

  return (
    <View className="flex-1 ">
      <PtsLoader loading={isLoading || isMutating} />
      <PtsBackHeader title="Appointment Details" memberData={memberData} />
      {isDataReceived ? (
        <View className=" h-full w-full flex-1 py-2">
          <ScrollView persistentScrollbar={true} className="flex-1">
            <View className="border-primary mt-[5] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View style={{ justifyContent: 'flex-end' }} className="flex-row">
                {getUserPermission(appointmentPrivileges).createPermission ? (
                  <Button
                    className="w-[50%]"
                    title="Create Similar"
                    variant="border"
                    onPress={() => {
                      router.push(
                        formatUrl('/circles/addEditAppointment', {
                          memberData: JSON.stringify(memberData),
                          appointmentDetails:
                            JSON.stringify(appointmentDetails),
                          component:
                            appointmentDetails.type?.type ===
                            'Doctor Appointment'
                              ? 'Doctor'
                              : 'Facility',
                          isFromCreateSimilar: 'true'
                        })
                      )
                    }}
                  />
                ) : (
                  <View />
                )}
                {getUserPermission(appointmentPrivileges).updatePermission ? (
                  <Button
                    className="ml-[5px] w-[30%]"
                    title="Edit"
                    variant="border"
                    onPress={() => {
                      router.push(
                        formatUrl('/circles/addEditAppointment', {
                          memberData: JSON.stringify(memberData),
                          appointmentDetails:
                            JSON.stringify(appointmentDetails),
                          component: 'Appointment'
                        })
                      )
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>
              <View className=" w-full flex-row items-center">
                <View className="mt-2 w-full flex-row">
                  <Typography className="max-w-[50%] text-[16px] font-bold text-black">
                    {doctorFacilityName}
                  </Typography>
                  <View className="ml-2 h-[25] w-[2px]  bg-[#86939e]" />
                  <Typography className="font-400 text-primary ml-2 max-w-[50%] text-[16px]">
                    {specialist}
                  </Typography>
                </View>
              </View>
              {phone !== '' ? (
                getDetailsView('Phone', phone, true, 'phone')
              ) : (
                <View />
              )}
              {email !== '' ? (
                getDetailsView('Email', email, true, 'mail')
              ) : (
                <View />
              )}
              {website !== '' ? (
                getDetailsView('Website', website, true, 'globe')
              ) : (
                <View />
              )}
              {websiteUser !== '' ? (
                getDetailsView('Username', websiteUser)
              ) : (
                <View />
              )}
              {phone !== '' ||
              email !== '' ||
              website !== '' ||
              websiteUser !== '' ? (
                <View className="my-3 h-[1px] w-full self-center bg-[##86939e]" />
              ) : (
                <View />
              )}
              {getDetailsView('Date', apptDate)}
              {getDetailsView('Purpose', purpose)}
              {getDetailsView('Status', status)}
              {getDetailsView('Description', description)}
              {(status === 'Scheduled' || status === 'ReScheduled') &&
              (getUserPermission(appointmentPrivileges).createPermission ||
                getUserPermission(appointmentPrivileges).updatePermission ||
                getUserPermission(appointmentPrivileges).deletePermission) ? (
                <View className="mt-5 w-full flex-row justify-center">
                  {isBefore(
                    new Date(appointmentDetails.date ?? ''),
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
                        'Do you really want to cancel appointment?',
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

            <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <Typography className="font-[15px] font-bold text-[#287CFA]">
                {'Location Details'}
              </Typography>
              <View className="w-full">
                <Location data={doctorFacilityAddress}></Location>
              </View>
            </View>

            <AppointmentNotesSection
              appointmentId={appointmentId}
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

            <AppointmentRemindersSection
              appointmentId={appointmentId}
              appointmentDate={appointmentDetails.date ?? ''}
              remindersList={remindersList}
              createReminderMutation={hookData.createReminder}
              updateReminderMutation={hookData.updateReminder}
              deleteReminderMutation={hookData.deleteReminder}
              onRefetch={refetch}
            />

            <AppointmentTransportationSection
              appointmentId={appointmentDetails.id ?? ''}
              appointmentDate={appointmentDetails.date ?? ''}
              transportationList={transportationList}
              transportationPrivileges={transportationPrivileges}
              address={
                (doctorFacilityAddress.address ?? {}) as Record<string, unknown>
              }
              deleteTransportationMutation={hookData.deleteTransportation}
              resendTransportationMutation={hookData.resendTransportation}
              cancelTransportationMutation={hookData.cancelTransportation}
              onRefetch={refetch}
            />

            {getUserPermission(appointmentPrivileges).deletePermission ? (
              <View className="mx-5 my-5 flex-row self-center">
                <Button
                  className="w-[50%]"
                  title="Send Me Invite"
                  variant="outline"
                  leadingIcon="calendar"
                  onPress={() => {
                    sendInvite()
                  }}
                />
                <Button
                  className="ml-5 w-[45%]"
                  title="Delete"
                  variant="borderRed"
                  onPress={() => {
                    Alert.alert(
                      'Are you sure about deleting Appointment?',
                      'It cannot be recovered once deleted.',
                      [
                        {
                          text: 'Ok',
                          onPress: () => deleteAppointment()
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
      ) : (
        <View />
      )}
    </View>
  )
}
