'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ComponentProps
} from 'react'
import { usePermissions } from 'app/utils/usePermissions'
import { View, Alert, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import { isAfter } from 'date-fns'
import {
  useMedicalDeviceDetails,
  useDeleteMedicalDevice,
  useCreateMedicalDeviceNote,
  useUpdateMedicalDeviceNote,
  useDeleteMedicalDeviceNote,
  useCreateMedicalDeviceReminder,
  useUpdateMedicalDeviceReminder,
  useDeleteMedicalDeviceReminder
} from 'app/data/medical-devices'
import {
  useThreadParticipants,
  useCreateMessageThread
} from 'app/data/messages'
import type { ThreadParticipant } from 'app/data/messages/types'
import type {
  MedicalDeviceDetails,
  MedicalDeviceNote,
  MedicalDeviceReminder,
  MedicalDeviceDetailsResponse
} from 'app/data/medical-devices/types'
import { useLocalSearchParams } from 'expo-router'
import { Note } from 'app/ui/note'
import { Reminder } from 'app/ui/reminder'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { formatTimeToUserLocalTime, isEmpty } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPermissions'
import { useAppSelector } from 'app/redux/hooks'

export function MedicalDevicesDetailsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [isShowReminder, setIsShowReminder] = useState(false)
  const [reminderData, setReminderData] = useState<{
    date?: Date
    content?: string
    note?: string
  }>({})
  const [remindersList, setRemindersList] = useState<MedicalDeviceReminder[]>(
    []
  )
  const [isAddRemider, setIsAddReminder] = useState(false)
  const [participantsList, setParticipantsList] = useState<ThreadParticipant[]>(
    []
  )
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [medicalDevicesDetails, setMedicalDevicesDetails] = useState<
    Partial<MedicalDeviceDetails>
  >({})
  const [noteData, setNoteData] = useState<Partial<MedicalDeviceNote>>({})
  const [notesList, setNotesList] = useState<MedicalDeviceNote[]>([])
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
      ? JSON.parse(item.memberData)
      : {}
  let medicalDeviceData =
    item.medicalDevicesDetails && item.medicalDevicesDetails !== undefined
      ? JSON.parse(item.medicalDevicesDetails)
      : {}

  const medicalDeviceId = medicalDeviceData.id
    ? Number(medicalDeviceData.id)
    : 0
  const {
    data: medicalDeviceDetailsData,
    isLoading: isDetailsLoading,
    refetch: refetchDetails
  } = useMedicalDeviceDetails(header, medicalDeviceId)

  const deleteMedicalDeviceMutation = useDeleteMedicalDevice(header)
  const createNoteMutation = useCreateMedicalDeviceNote(header)
  const updateNoteMutation = useUpdateMedicalDeviceNote(header)
  const deleteNoteMutation = useDeleteMedicalDeviceNote(header)
  const createReminderMutation = useCreateMedicalDeviceReminder(header)
  const updateReminderMutation = useUpdateMedicalDeviceReminder(header)
  const deleteReminderMutation = useDeleteMedicalDeviceReminder(header)
  const createMessageThreadMutation = useCreateMessageThread(header)

  const threadParticipantsParams = {
    member: {
      id: memberData.member ? memberData.member : ''
    },
    messageThreadType: {
      type: 'Purchase'
    }
  }
  const {
    data: threadParticipantsData,
    isLoading: isParticipantsLoading,
    refetch: refetchParticipants
  } = useThreadParticipants(header, threadParticipantsParams)

  const navigateAfterThreadRef = useRef<{ noteData: MedicalDeviceNote } | null>(
    null
  )

  const medDevData_ = medicalDeviceDetailsData as
    | MedicalDeviceDetailsResponse
    | undefined
  const medicalDevicePrivileges = usePermissions(
    medDevData_?.domainObjectPrivileges,
    'Purchase'
  )
  const notePrivileges = usePermissions(
    medDevData_?.domainObjectPrivileges,
    'PURCHASENOTE',
    'PurchaseNote'
  )

  useEffect(() => {
    if (medicalDeviceDetailsData) {
      const data = medicalDeviceDetailsData as MedicalDeviceDetailsResponse
      setMedicalDevicesDetails(data.purchase ? data.purchase : {})
      if (data.purchase && data.purchase.noteList) {
        setNotesList(data.purchase.noteList)
      }
      if (data.purchase && data.purchase.reminderList) {
        setRemindersList(data.purchase.reminderList)
      }
      setIsRender((prev) => !prev)

      if (navigateAfterThreadRef.current) {
        const navNoteData = navigateAfterThreadRef.current.noteData
        navigateAfterThreadRef.current = null
        router.push(
          formatUrl('/circles/noteMessage', {
            component: 'Medical Device',
            memberData: JSON.stringify(memberData),
            noteData: JSON.stringify(navNoteData)
          })
        )
      }
    }
  }, [medicalDeviceDetailsData])

  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/medicalDevicesList', {
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
  let medicalDeviceDate = '',
    medicalDevice = '',
    type = '',
    prescriber = '',
    description = ''
  let deviceAddress = {}
  if (!isEmpty(medicalDevicesDetails)) {
    if (medicalDevicesDetails.date) {
      medicalDeviceDate = formatTimeToUserLocalTime(
        medicalDevicesDetails.date,
        userAddress,
        memberAddress
      )
    }
    if (medicalDevicesDetails.title) {
      medicalDevice = medicalDevicesDetails.title
    }
    if (medicalDevicesDetails.type) {
      type = medicalDevicesDetails.type
    }
    if (medicalDevicesDetails.doctor) {
      prescriber = medicalDevicesDetails.doctor.salutation
        ? medicalDevicesDetails.doctor.salutation
        : ''
      prescriber += medicalDevicesDetails.doctor.firstName
        ? ' ' + medicalDevicesDetails.doctor.firstName
        : ''
      prescriber += medicalDevicesDetails.doctor.middleName
        ? ' ' + medicalDevicesDetails.doctor.middleName
        : ''
      prescriber += medicalDevicesDetails.doctor.lastName
        ? ' ' + medicalDevicesDetails.doctor.lastName
        : ''
    }
    if (medicalDevicesDetails.description) {
      description = medicalDevicesDetails.description
    }
    if (medicalDevicesDetails.location) {
      deviceAddress = medicalDevicesDetails.location
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
  async function createUpdateReminder(
    title: string,
    date: Date,
    reminderData: { id?: number; date?: Date; content?: string; note?: string }
  ) {
    const reminderPayload = {
      content: title,
      date: String(date),
      purchase: {
        id: medicalDevicesDetails.id
          ? medicalDevicesDetails.id
          : ('' as number | string)
      }
    }

    if (isEmpty(reminderData)) {
      createReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data) => {
            setIsAddReminder(false)
            if (data.purchase && data.purchase.reminderList) {
              setRemindersList(data.purchase.reminderList)
            } else {
              refetchDetails()
            }
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create reminder')
          }
        }
      )
    } else {
      const updatePayload = { ...reminderPayload, id: reminderData.id }
      updateReminderMutation.mutate(
        { reminder: updatePayload },
        {
          onSuccess: (data) => {
            setIsAddReminder(false)
            if (data.purchase && data.purchase.reminderList) {
              setRemindersList(data.purchase.reminderList)
            } else {
              refetchDetails()
            }
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update reminder')
          }
        }
      )
    }
  }
  async function createUpdateNote(
    occurance: string,
    noteDetails: string,
    title: string,
    noteData: {
      id?: number | string
      shortDescription?: string
      note?: string
      occurance?: { occurance: string }
    }
  ) {
    const notePayload = {
      purchase: {
        id: medicalDevicesDetails.id
          ? medicalDevicesDetails.id
          : ('' as number | string)
      },
      occurance: {
        occurance: occurance
      },
      note: noteDetails,
      shortDescription: title
    }

    if (isEmpty(noteData)) {
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
      const updateNotePayload = {
        ...notePayload,
        id: noteData.id ? noteData.id : ('' as number | string)
      }
      updateNoteMutation.mutate(
        { note: updateNotePayload },
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
    setIsMessageThread(false)
  }

  const editNote = (noteData: MedicalDeviceNote) => {
    setNoteData(noteData)
    setIsAddNote(true)
  }
  async function deleteNote(noteId: number) {
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
  const messageThreadClicked = (noteData: MedicalDeviceNote) => {
    setNoteData(noteData)
    if (noteData.hasMsgThread) {
      router.push(
        formatUrl('/circles/noteMessage', {
          component: 'Medical Device',
          memberData: JSON.stringify(memberData),
          noteData: JSON.stringify(noteData)
        })
      )
    } else {
      getThreadParticipants(noteData)
    }
  }
  async function getThreadParticipants(noteData: MedicalDeviceNote) {
    setLoading(true)
    try {
      const result = await refetchParticipants()
      setLoading(false)
      if (result.data) {
        const list = (result.data as ThreadParticipant[]).map((item) => {
          let object = item
          object.isSelected = false
          return object
        })
        setParticipantsList(list)
        setNoteData(noteData)
        setIsMessageThread(true)
      }
    } catch (error: unknown) {
      setLoading(false)
      logger.debug(error)
    }
  }
  function createMessageThread(subject: string, noteData: MedicalDeviceNote) {
    setNoteData(noteData)
    let list: { user: { id: number } }[] = []
    participantsList.map((data, index) => {
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
            type: 'Purchase'
          },
          participantList: list,
          messageList: []
        }
      },
      {
        onSuccess: () => {
          setIsMessageThread(false)
          navigateAfterThreadRef.current = { noteData }
          refetchDetails()
        },
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }
  function isParticipantSelected(index: number) {
    const participant = participantsList[index]
    if (participant) {
      participant.isSelected = !participant.isSelected
    }
    setIsRender(!isRender)
    setParticipantsList(participantsList)
  }
  async function deleteMedicalDevice() {
    deleteMedicalDeviceMutation.mutate(
      {
        purchase: {
          id: medicalDevicesDetails.id ? medicalDevicesDetails.id : 0
        }
      },
      {
        onSuccess: () => {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/medicalDevicesList', {
              memberData: JSON.stringify(memberData)
            })
          )
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete medical device')
        }
      }
    )
  }
  const editReminder = (remiderData: MedicalDeviceReminder) => {
    setReminderData(
      remiderData as unknown as { date?: Date; content?: string; note?: string }
    )
    setIsAddReminder(true)
  }
  async function deleteReminder(reminderData: MedicalDeviceReminder) {
    deleteReminderMutation.mutate(
      {
        reminder: {
          id: reminderData.id ? reminderData.id : 0,
          purchase: {
            id: reminderData.id ? reminderData.id : 0
          }
        }
      },
      {
        onSuccess: (data) => {
          if (data.purchase && data.purchase.reminderList) {
            setRemindersList(data.purchase.reminderList)
          } else {
            refetchDetails()
          }
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete reminder')
        }
      }
    )
  }

  const isMutating =
    deleteMedicalDeviceMutation.isPending ||
    createNoteMutation.isPending ||
    updateNoteMutation.isPending ||
    deleteNoteMutation.isPending ||
    createReminderMutation.isPending ||
    updateReminderMutation.isPending ||
    deleteReminderMutation.isPending ||
    createMessageThreadMutation.isPending

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading || isDetailsLoading || isMutating} />
      <PtsBackHeader title="Medical Device Details" memberData={memberData} />
      <View className=" h-full w-full flex-1 py-2 ">
        <ScrollView className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View style={{ justifyContent: 'flex-end' }} className="flex-row">
              {getUserPermission(medicalDevicePrivileges).createPermission ? (
                <Button
                  className="w-[50%]"
                  title="Create Similar"
                  variant="border"
                  onPress={() => {
                    router.push(
                      formatUrl('/circles/addEditMedicalDevice', {
                        memberData: JSON.stringify(memberData),
                        medicalDeviceDetails: JSON.stringify(
                          medicalDevicesDetails
                        ),
                        isFromCreateSimilar: 'true'
                      })
                    )
                  }}
                />
              ) : (
                <View />
              )}
              {getUserPermission(medicalDevicePrivileges).updatePermission ? (
                <Button
                  className="ml-[5px] w-[30%]"
                  title="Edit"
                  variant="border"
                  onPress={() => {
                    router.push(
                      formatUrl('/circles/addEditMedicalDevice', {
                        memberData: JSON.stringify(memberData),
                        medicalDeviceDetails: JSON.stringify(
                          medicalDevicesDetails
                        )
                      })
                    )
                  }}
                />
              ) : (
                <View />
              )}
            </View>
            <View className="w-full">
              <View className="flex-row">
                <Typography className=" font-400 w-[80%] text-[15px] text-black">
                  {medicalDevice}
                </Typography>
              </View>
              {getDetailsView('Date', medicalDeviceDate)}
              {getDetailsView('Purchase Type', type)}
              {getDetailsView('Prescribed By', prescriber)}
              {getDetailsView('Description', description)}
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
                {notesList.map((data, index) => {
                  return (
                    <View key={index}>
                      <Note
                        component={'Medical Device'}
                        data={data}
                        editNote={
                          editNote as ComponentProps<typeof Note>['editNote']
                        }
                        deleteNote={
                          deleteNote as ComponentProps<
                            typeof Note
                          >['deleteNote']
                        }
                        messageThreadClicked={
                          messageThreadClicked as ComponentProps<
                            typeof Note
                          >['messageThreadClicked']
                        }
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
              {isAfter(
                new Date(
                  medicalDevicesDetails.date ? medicalDevicesDetails.date : ''
                ),
                new Date()
              ) ? (
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
                {remindersList.map((data, index) => {
                  return (
                    <View key={index}>
                      <Reminder
                        data={data}
                        editReminder={
                          editReminder as ComponentProps<
                            typeof Reminder
                          >['editReminder']
                        }
                        deleteReminder={
                          deleteReminder as ComponentProps<
                            typeof Reminder
                          >['deleteReminder']
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
          {getUserPermission(medicalDevicePrivileges).deletePermission ? (
            <View className="mx-5 my-5">
              <Button
                className=""
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Medical Device?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteMedicalDevice()
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
            component={'Medical Device'}
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
            component={'Medical Device'}
            reminderData={reminderData}
            cancelClicked={cancelClicked}
            createUpdateReminder={createUpdateReminder}
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
            createMessageThread={
              createMessageThread as ComponentProps<
                typeof AddMessageThread
              >['createMessageThread']
            }
            isUpdateParticipants={false}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
