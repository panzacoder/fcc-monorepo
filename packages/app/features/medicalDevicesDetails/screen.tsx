'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { AddEditMedicalDevice } from 'app/ui/addEditMedicalDevice'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_MEDICAL_DEVICE_DETAILS,
  GET_THREAD_PARTICIPANTS,
  CREATE_MESSAGE_THREAD,
  DELETE_MEDICAL_DEVICE_NOTE,
  CREATE_MEDICAL_DEVICE_NOTE,
  UPDATE_MEDICAL_DEVICE_NOTE,
  DELETE_MEDICAL_DEVICE,
  DELETE_MEDICAL_DEVICE_REMINDER,
  CREATE_MEDICAL_DEVICE_REMINDER,
  UPDATE_MEDICAL_DEVICE_REMINDER,
  UPDATE_MEDICAL_DEVICE
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { Location } from 'app/ui/location'
import { Note } from 'app/ui/note'
import { Reminder } from 'app/ui/reminder'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'

let medicalDevicePrivileges = {}
let notePrivileges = {}
export function MedicalDevicesDetailsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [isShowReminder, setIsShowReminder] = useState(false)
  const [reminderData, setReminderData] = useState({})
  const [remindersList, setRemindersList] = useState([])
  const [isAddDevice, setIsAddDevice] = useState(false)
  const [isAddRemider, setIsAddReminder] = useState(false)
  const [participantsList, setParticipantsList] = useState([]) as any
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [medicalDevicesDetails, setMedicalDevicesDetails] = useState({}) as any
  const [noteData, setNoteData] = useState({})
  const [notesList, setNotesList] = useState([])
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  let medicalDeviceData =
    item.medicalDevicesDetails && item.medicalDevicesDetails !== undefined
      ? JSON.parse(item.medicalDevicesDetails)
      : {}
  // console.log('medicalDevicesDetails', JSON.stringify(medicalDevicesDetails))
  const getMedicalDevicesDetails = useCallback(
    async (isFromCreateThread: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEDICAL_DEVICE_DETAILS}`
      let dataObject = {
        header: header,
        purchase: {
          id: medicalDeviceData.id ? medicalDeviceData.id : ''
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // console.log('data', JSON.stringify(data.data))
            if (data.data.domainObjectPrivileges) {
              medicalDevicePrivileges = data.data.domainObjectPrivileges
                .Purchase
                ? data.data.domainObjectPrivileges.Purchase
                : {}
              notePrivileges = data.data.domainObjectPrivileges.PURCHASENOTE
                ? data.data.domainObjectPrivileges.PURCHASENOTE
                : {}
            }

            setMedicalDevicesDetails(
              data.data.purchase ? data.data.purchase : {}
            )
            if (data.data.purchase.noteList) {
              setNotesList(data.data.purchase.noteList)
            }
            if (data.data.purchase.reminderList) {
              setRemindersList(data.data.purchase.reminderList)
            }
            setIsRender(!isRender)
            if (isFromCreateThread) {
              router.push(
                formatUrl('/circles/noteMessage', {
                  component: 'Medical Device',
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

  useEffect(() => {
    if (!isAddNote) {
      getMedicalDevicesDetails(false)
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
      medicalDeviceDate = formatTimeToUserLocalTime(medicalDevicesDetails.date)
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
    setLoading(true)
    let url = ''
    let dataObject = {
      header: header,
      reminder: {
        id: '',
        content: title,
        date: date,
        purchase: {
          id: medicalDevicesDetails.id ? medicalDevicesDetails.id : ''
        }
      }
    }
    if (_.isEmpty(reminderData)) {
      url = `${BASE_URL}${CREATE_MEDICAL_DEVICE_REMINDER}`
    } else {
      url = `${BASE_URL}${UPDATE_MEDICAL_DEVICE_REMINDER}`
      dataObject.reminder.id = reminderData.id
    }

    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsAddReminder(false)
          setRemindersList(
            data.data.purchase.reminderList
              ? data.data.purchase.reminderList
              : []
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
        purchase: {
          id: medicalDevicesDetails.id ? medicalDevicesDetails.id : ''
        },
        occurance: {
          occurance: occurance
        },
        note: noteDetails,
        shortDescription: title
      }
    }
    if (_.isEmpty(noteData)) {
      url = `${BASE_URL}${CREATE_MEDICAL_DEVICE_NOTE}`
    } else {
      dataObject.note.id = noteData.id ? noteData.id : ''
      url = `${BASE_URL}${UPDATE_MEDICAL_DEVICE_NOTE}`
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsAddNote(false)
          getMedicalDevicesDetails(false)
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
    setIsMessageThread(false)
    setIsAddDevice(false)
  }
  async function createUpdateMedicalDevice(object: any) {
    console.log('in createUpdateMedicalDevice', JSON.stringify(object))
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_MEDICAL_DEVICE}`
    let dataObject: any = {
      header: header,
      purchase: {
        id: medicalDevicesDetails.id ? medicalDevicesDetails.id : '',
        date: object.date ? object.date : '',
        description: object.description ? object.description : '',
        type: object.selectedType ? object.selectedType : '',
        isPrescribedBy: object.isPrescribed ? object.isPrescribed : false,
        member: {
          id: memberData.member ? memberData.member : ''
        },
        doctor: {
          id: object.doctorId ? object.doctorId : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsAddDevice(false)
          getDevicesList(false)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  const editNote = (noteData: any) => {
    // console.log('noteData', JSON.stringify(noteData))
    setNoteData(noteData)
    setIsAddNote(true)
  }
  async function deleteNote(noteId: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_MEDICAL_DEVICE_NOTE}`
    let dataObject = {
      header: header,
      note: {
        id: noteId
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getMedicalDevicesDetails(false)
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
    // console.log('messageThreadClicked', JSON.stringify(noteData))
    setNoteData(noteData)
    if (noteData.hasMsgThread) {
      // console.log('noteData', noteData)
      router.push(
        formatUrl('/circles/noteMessage', {
          component: 'Medical Device',
          memberData: JSON.stringify(memberData),
          noteData: JSON.stringify(noteData)
        })
      )
    } else {
      getThreadParticipants()
    }
  }
  async function getThreadParticipants() {
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
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsMessageThread(false)
          getMedicalDevicesDetails(true)
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
  async function deleteMedicalDevice() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_MEDICAL_DEVICE}`
    let dataObject = {
      header: header,
      purchase: {
        id: medicalDevicesDetails.id ? medicalDevicesDetails.id : ''
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          router.push(
            formatUrl('/circles/medicalDevicesList', {
              memberData: JSON.stringify(memberData)
            })
          )
          // router.back()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const editReminder = (remiderData: any) => {
    // console.log('remiderData', JSON.stringify(remiderData))
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  async function deleteReminder(reminderData: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_MEDICAL_DEVICE_REMINDER}`
    let dataObject = {
      header: header,
      reminder: {
        id: reminderData.id ? reminderData.id : '',
        purchase: {
          id: reminderData.id ? reminderData.id : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setRemindersList(
            data.data.purchase.reminderList
              ? data.data.purchase.reminderList
              : []
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
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className="w-full">
              <View className="flex-row">
                <Typography className=" font-400 w-[80%] text-[15px] text-[#86939e]">
                  {medicalDevice}
                </Typography>
                {getUserPermission(medicalDevicePrivileges).updatePermission ? (
                  <Button
                    className=""
                    title="Edit"
                    variant="border"
                    onPress={() => {
                      // router.push(
                      //   formatUrl('/circles/addEditIncident', {
                      //     memberData: JSON.stringify(memberData),
                      //     medicalDevicesDetails: JSON.stringify(
                      //       medicalDevicesDetails
                      //     )
                      //   })
                      // )
                      setIsAddDevice(true)
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>
              {getDetailsView('Date:', medicalDeviceDate)}
              {getDetailsView('Purchase Type:', type)}
              {getDetailsView('Prescribed By:', prescriber)}
              {getDetailsView('Description:', description)}
            </View>
          </View>
          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <Typography className="font-[15px] font-bold text-[#287CFA]">
              {'Location Details'}
            </Typography>
            <View className="w-full">
              <Location data={deviceAddress}></Location>
            </View>
          </View>

          <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[60%] flex-row">
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
                    onPress={() => {
                      setIsShowNotes(!isShowNotes)
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>
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
                        component={'Medical Device'}
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
              <View className="w-[50%] flex-row">
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
                    onPress={() => {
                      setIsShowReminder(!isShowReminder)
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>
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
        <View className="h-full w-full justify-center self-center">
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
        <View className="h-full w-full justify-center self-center">
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
        <View className="h-full w-full justify-center self-center">
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
      {isAddDevice ? (
        <View className="h-full w-full justify-center self-center">
          <AddEditMedicalDevice
            medicalDeviceDetails={medicalDevicesDetails}
            cancelClicked={cancelClicked}
            createUpdateMedicalDevice={createUpdateMedicalDevice}
            memberData={memberData}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
