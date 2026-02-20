'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Alert, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import moment from 'moment'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_THREAD_PARTICIPANTS,
  CREATE_MESSAGE_THREAD
} from 'app/utils/urlConstants'
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
import { useLocalSearchParams } from 'expo-router'
import { Note } from 'app/ui/note'
import { Reminder } from 'app/ui/reminder'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useAppSelector } from 'app/redux/hooks'

export function MedicalDevicesDetailsScreen() {
  const medicalDevicePrivilegesRef = useRef<any>({})
  const notePrivilegesRef = useRef<any>({})
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [isShowReminder, setIsShowReminder] = useState(false)
  const [reminderData, setReminderData] = useState({})
  const [remindersList, setRemindersList] = useState([])
  const [isAddRemider, setIsAddReminder] = useState(false)
  const [participantsList, setParticipantsList] = useState([]) as any
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [medicalDevicesDetails, setMedicalDevicesDetails] = useState({}) as any
  const [noteData, setNoteData] = useState({})
  const [notesList, setNotesList] = useState([])
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

  const navigateAfterThreadRef = useRef<{ noteData: any } | null>(null)

  useEffect(() => {
    if (medicalDeviceDetailsData) {
      const data = medicalDeviceDetailsData as any
      if (data.domainObjectPrivileges) {
        medicalDevicePrivilegesRef.current = data.domainObjectPrivileges
          .Purchase
          ? data.domainObjectPrivileges.Purchase
          : {}
        notePrivilegesRef.current = data.domainObjectPrivileges.PURCHASENOTE
          ? data.domainObjectPrivileges.PURCHASENOTE
          : data.domainObjectPrivileges.PurchaseNote
            ? data.domainObjectPrivileges.PurchaseNote
            : {}
      }

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
  if (!_.isEmpty(medicalDevicesDetails)) {
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
    date: any,
    reminderData: any
  ) {
    const reminderPayload: Record<string, unknown> = {
      content: title,
      date: date,
      purchase: {
        id: medicalDevicesDetails.id ? medicalDevicesDetails.id : ''
      }
    }

    if (_.isEmpty(reminderData)) {
      createReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data: any) => {
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
      reminderPayload.id = reminderData.id
      updateReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data: any) => {
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
    occurance: any,
    noteDetails: any,
    title: any,
    noteData: any
  ) {
    const notePayload: Record<string, unknown> = {
      purchase: {
        id: medicalDevicesDetails.id ? medicalDevicesDetails.id : ''
      },
      occurance: {
        occurance: occurance
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
          component: 'Medical Device',
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
        type: 'Purchase'
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
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
        logger.debug(error)
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
          type: 'Purchase'
        },
        participantList: list,
        medicalDeviceNote: {
          id: noteData.id ? noteData.id : ''
        },
        messageList: []
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsMessageThread(false)
          navigateAfterThreadRef.current = { noteData }
          refetchDetails()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  function isParticipantSelected(index: any) {
    participantsList[index].isSelected = !participantsList[index].isSelected
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
  const editReminder = (remiderData: any) => {
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  async function deleteReminder(reminderData: any) {
    deleteReminderMutation.mutate(
      {
        reminder: {
          id: reminderData.id ? reminderData.id : '',
          purchase: {
            id: reminderData.id ? reminderData.id : ''
          }
        }
      },
      {
        onSuccess: (data: any) => {
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
    deleteReminderMutation.isPending

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading || isDetailsLoading || isMutating} />
      <PtsBackHeader title="Medical Device Details" memberData={memberData} />
      <View className=" h-full w-full flex-1 py-2 ">
        <ScrollView className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View style={{ justifyContent: 'flex-end' }} className="flex-row">
              {getUserPermission(medicalDevicePrivilegesRef.current)
                .createPermission ? (
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
              {getUserPermission(medicalDevicePrivilegesRef.current)
                .updatePermission ? (
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
                        component={'Medical Device'}
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
              {moment(
                medicalDevicesDetails.date ? medicalDevicesDetails.date : ''
              )
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
          {getUserPermission(medicalDevicePrivilegesRef.current)
            .deletePermission ? (
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
