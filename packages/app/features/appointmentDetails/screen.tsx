'use client'
import _ from 'lodash'
import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Alert,
  TouchableOpacity,
  Linking,
  BackHandler
} from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import moment from 'moment'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_APPOINTMENT_DETAILS,
  DELETE_APPOINTMENT_REMINDER,
  CREATE_APPOINTMENT_REMINDER,
  UPDATE_APPOINTMENT_REMINDER,
  CREATE_APPOINTMENT_NOTE,
  DELETE_APPOINTMENT_NOTE,
  UPDATE_APPOINTMENT_NOTE,
  UPDATE_APPOINTMENT_STATUS,
  DELETE_APPOINTMENT,
  GET_THREAD_PARTICIPANTS,
  CREATE_MESSAGE_THREAD,
  RESEND_TRANSPORTATION_REQUEST,
  DELETE_TRANSPORTATION,
  CANCEL_TRANSPORTATION_REQUEST,
  SEND_CALENDAR_INVITE,
  GET_MEMBER_DETAILS
} from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import {
  formatTimeToUserLocalTime,
  convertPhoneNumberToUsaPhoneNumberFormat
} from 'app/ui/utils'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { Location } from 'app/ui/location'
import { Note } from 'app/ui/note'
import { Reminder } from 'app/ui/reminder'
import { Transportation } from 'app/ui/transportation'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { AddEditTransport } from 'app/ui/addEditTransport'
import { AddMessageThread } from 'app/ui/addMessageThread'
import { Button } from 'app/ui/button'
import { getUserPermission } from 'app/utils/getUserPemissions'
let appointmentPrivileges = {}
let notePrivileges = {}
let transportationPrivileges = {}
export function AppointmentDetailsScreen() {
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let appointmentInfo = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  // let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  // console.log('appointmentInfo', '' + JSON.stringify(appointmentInfo))
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [memberData, setMemberData] = useState(
    item.memberData ? JSON.parse(item.memberData) : {}
  )
  const [isMessageThread, setIsMessageThread] = useState(false)
  const [isAddRemider, setIsAddReminder] = useState(false)
  const [isAddTransportation, setIsAddTransportation] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [noteData, setNoteData] = useState({})
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isShowReminder, setIsShowReminder] = useState(false)
  const [isShowTransportation, setIsShowTransportation] = useState(false)
  const [reminderData, setReminderData] = useState({})
  const [transportationData, setTransportationData] = useState({})
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [notesList, setNotesList] = useState([])
  const [participantsList, setParticipantsList] = useState([]) as any
  const [remindersList, setRemindersList] = useState([])
  const [transportationList, setTransportationList] = useState([])
  const [appointmentDetails, setAppointmentDetails] = useState({}) as any
  const getAppointmentDetails = useCallback(
    async (isFromCreateThread: any, noteData: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_APPOINTMENT_DETAILS}`
      let dataObject = {
        header: header,
        appointment: {
          id: appointmentInfo.id ? appointmentInfo.id : ''
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // console.log('appointmentInfo', '' + JSON.stringify(data.data))
            if (data.data.domainObjectPrivileges) {
              appointmentPrivileges = data.data.domainObjectPrivileges
                .Appointment
                ? data.data.domainObjectPrivileges.Appointment
                : {}
              notePrivileges = data.data.domainObjectPrivileges.APPOINTMENTNOTE
                ? data.data.domainObjectPrivileges.APPOINTMENTNOTE
                : data.data.domainObjectPrivileges.AppointmentNote
                  ? data.data.domainObjectPrivileges.AppointmentNote
                  : {}
              transportationPrivileges = data.data.domainObjectPrivileges
                .APPOINTMENTTRANSPORTATION
                ? data.data.domainObjectPrivileges.APPOINTMENTTRANSPORTATION
                : data.data.domainObjectPrivileges.AppointmentTransportation
                  ? data.data.domainObjectPrivileges.AppointmentTransportation
                  : {}
            }
            if (
              data.data.appointmentWithPreviousAppointment &&
              data.data.appointmentWithPreviousAppointment.appointment
            ) {
              let details =
                data.data.appointmentWithPreviousAppointment.appointment
              setAppointmentDetails(details)
              if (
                data.data.appointmentWithPreviousAppointment.appointment
                  .noteList
              ) {
                let notesList =
                  data.data.appointmentWithPreviousAppointment.appointment
                    .noteList
                setNotesList(notesList)
              }
              if (
                data.data.appointmentWithPreviousAppointment.appointment
                  .reminderList
              ) {
                let reminderList =
                  data.data.appointmentWithPreviousAppointment.appointment
                    .reminderList
                setRemindersList(reminderList)
              }
              if (
                data.data.appointmentWithPreviousAppointment.appointment
                  .transportationList
              ) {
                let transportationList =
                  data.data.appointmentWithPreviousAppointment.appointment
                    .transportationList
                setTransportationList(transportationList)
              }
            }
            if (isFromCreateThread) {
              router.push(
                formatUrl('/circles/noteMessage', {
                  component: 'Appointment',
                  memberData: JSON.stringify(memberData),
                  noteData: JSON.stringify(noteData)
                })
              )
            }
          } else {
            Alert.alert('', data.message)
          }
          setIsDataReceived(true)
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
      formatUrl('/circles/appointmentsList', {
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }
  const getMemberDetails = useCallback(async () => {
    let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          data.data.memberList.map((data: any, index: any) => {
            if (memberData.member === data.member) {
              setMemberData(data)
              console.log('setMemberData', JSON.stringify(data))
            }
          })
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }, [])
  useEffect(() => {
    getMemberDetails()
    if (!isAddNote) {
      getAppointmentDetails(false, noteData)
    }

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
  let doctorFacilityAddress = {} as any
  if (!_.isEmpty(appointmentDetails)) {
    if (appointmentDetails.date) {
      apptDate = formatTimeToUserLocalTime(appointmentDetails.date)
    }
    if (appointmentDetails.status && appointmentDetails.status.status) {
      status = appointmentDetails.status.status
    }
    if (appointmentDetails.purpose) {
      purpose = appointmentDetails.purpose
    }
    if (appointmentDetails.description) {
      description = appointmentDetails.description
    }
    if (appointmentDetails.doctorLocation) {
      doctorFacilityAddress = appointmentDetails.doctorLocation
      doctorFacilityAddress.component = 'Appointment'
    } else if (appointmentDetails.facilityLocation) {
      doctorFacilityAddress = appointmentDetails.facilityLocation
      doctorFacilityAddress.component = 'Appointment'
    }
    if (
      appointmentDetails.doctorLocation &&
      appointmentDetails.doctorLocation.doctor
    ) {
      if (appointmentDetails.doctorLocation.doctor.salutation) {
        doctorFacilityName +=
          appointmentDetails.doctorLocation.doctor.salutation + '. '
      }
      if (appointmentDetails.doctorLocation.doctor.firstName) {
        doctorFacilityName += appointmentDetails.doctorLocation.doctor.firstName
      }
      if (appointmentDetails.doctorLocation.doctor.lastName) {
        doctorFacilityName +=
          ' ' + appointmentDetails.doctorLocation.doctor.lastName
      }
      if (appointmentDetails.doctorLocation.doctor.specialist) {
        specialist = appointmentDetails.doctorLocation.doctor.specialist
      }
      if (appointmentDetails.doctorLocation.doctor.phone) {
        phone = convertPhoneNumberToUsaPhoneNumberFormat(
          appointmentDetails.doctorLocation.doctor.phone
        )
      }
      if (appointmentDetails.doctorLocation.doctor.email) {
        email = appointmentDetails.doctorLocation.doctor.email
      }
      if (appointmentDetails.doctorLocation.doctor.website) {
        website = appointmentDetails.doctorLocation.doctor.website
      }
      if (appointmentDetails.doctorLocation.doctor.websiteuser) {
        websiteUser = appointmentDetails.doctorLocation.doctor.websiteuser
      }
    } else if (
      appointmentDetails.facilityLocation &&
      appointmentDetails.facilityLocation.facility
    ) {
      if (appointmentDetails.facilityLocation.facility.name) {
        doctorFacilityName += appointmentDetails.facilityLocation.facility.name
      }
      if (appointmentDetails.facilityLocation.facility.type) {
        specialist = appointmentDetails.facilityLocation.facility.type
      }
      if (appointmentDetails.facilityLocation.facility.phone) {
        phone = convertPhoneNumberToUsaPhoneNumberFormat(
          appointmentDetails.facilityLocation.facility.phone
        )
      }
      if (appointmentDetails.facilityLocation.facility.email) {
        email = appointmentDetails.facilityLocation.facility.email
      }
      if (appointmentDetails.facilityLocation.facility.website) {
        website = appointmentDetails.facilityLocation.facility.website
      }
      if (appointmentDetails.facilityLocation.facility.websiteuser) {
        websiteUser = appointmentDetails.facilityLocation.facility.websiteuser
      }
    }
  }
  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
  const cancelClicked = () => {
    setIsAddNote(false)
    setIsAddReminder(false)
    setIsAddTransportation(false)
    setIsMessageThread(false)
  }
  async function sendInvite() {
    setLoading(true)
    let url = `${BASE_URL}${SEND_CALENDAR_INVITE}`
    let dataObject = {
      header: header,
      appointment: {
        id: appointmentDetails.id ? appointmentDetails.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          Alert.alert(
            '',
            `Send to\n${
              memberData.email ? memberData.email : ''
            } . \n\nCheck your email for the appointment invite. `
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
          type: 'Appointment'
        },
        participantList: list,
        appointmentNote: {
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
          getAppointmentDetails(true, noteData)
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
  async function getThreadParticipants(noteData: any) {
    setLoading(true)
    let url = `${BASE_URL}${GET_THREAD_PARTICIPANTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      messageThreadType: {
        type: 'Appointment'
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
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
        console.log(error)
      })
  }
  async function deleteAppointment() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_APPOINTMENT}`
    let dataObject = {
      header: header,
      appointment: {
        id: appointmentDetails.id ? appointmentDetails.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/appointmentsList', {
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
  async function deleteNote(noteId: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_APPOINTMENT_NOTE}`
    let dataObject = {
      header: header,
      appointmentNote: {
        id: noteId
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getAppointmentDetails(false, noteData)
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
      appointmentNote: {
        id: '',
        appointment: {
          id: appointmentDetails.id ? appointmentDetails.id : ''
        },
        occurance: {
          occurance: occurance
        },
        note: noteDetails,
        shortDescription: title
      }
    }
    if (_.isEmpty(noteData)) {
      url = `${BASE_URL}${CREATE_APPOINTMENT_NOTE}`
    } else {
      dataObject.appointmentNote.id = noteData.id ? noteData.id : ''
      url = `${BASE_URL}${UPDATE_APPOINTMENT_NOTE}`
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsAddNote(false)
          getAppointmentDetails(false, noteData)
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
    setLoading(true)
    setIsShowTransportation(false)
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          cancelClicked()
          getAppointmentDetails(false, noteData)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
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
        appointment: {
          id: appointmentDetails.id ? appointmentDetails.id : ''
        }
      }
    }
    if (_.isEmpty(reminderData)) {
      url = `${BASE_URL}${CREATE_APPOINTMENT_REMINDER}`
    } else {
      url = `${BASE_URL}${UPDATE_APPOINTMENT_REMINDER}`
      dataObject.reminder.id = reminderData.id
    }

    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // setTransportationData(data.data ? data.data : {})
          setIsAddReminder(false)
          setRemindersList(data.data.reminderList ? data.data.reminderList : [])
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function updateStatus(status: any) {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_APPOINTMENT_STATUS}`
    let dataObject = {
      header: header,
      appointment: {
        id: appointmentDetails.id ? appointmentDetails.id : '',
        status: {
          status: status
        },
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          refreshData()
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
    let url = `${BASE_URL}${DELETE_APPOINTMENT_REMINDER}`
    let dataObject = {
      header: header,
      reminder: {
        id: reminderData.id ? reminderData.id : '',
        appointment: {
          id: reminderData.apointmentId ? reminderData.apointmentId : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setRemindersList(data.data.reminderList ? data.data.reminderList : [])
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const editNote = (noteData: any) => {
    setNoteData(noteData)
    setIsAddNote(true)
  }
  const messageThreadClicked = (noteData: any) => {
    setNoteData(noteData)
    if (noteData.hasMsgThread) {
      router.push(
        formatUrl('/circles/noteMessage', {
          component: 'Appointment',
          memberData: JSON.stringify(memberData),
          noteData: JSON.stringify(noteData)
        })
      )
    } else {
      getThreadParticipants(noteData)
    }
  }
  const editReminder = (remiderData: any) => {
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  async function deleteResendCancelTransportation(
    count: any,
    transportData: any
  ) {
    setLoading(true)
    let url = ''
    let dataObject = {}
    if (count === 0) {
      url = `${BASE_URL}${DELETE_TRANSPORTATION}`
    } else if (count === 1) {
      url = `${BASE_URL}${RESEND_TRANSPORTATION_REQUEST}`
    } else {
      setTransportationList([])
      url = `${BASE_URL}${CANCEL_TRANSPORTATION_REQUEST}`
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
          refreshData()
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
  const editTransportation = (transportationData: any) => {
    // console.log('remiderData', JSON.stringify(transportationData))
    setTransportationData(transportationData)
    setIsAddTransportation(true)
  }
  async function refreshData() {
    getAppointmentDetails(false, noteData)
  }
  function getWebsite(url: string) {
    let newUrl = String(url).replace(/(^\w+:|^)\/\//, '')
    return newUrl
  }
  function getDetailsView(
    title: string,
    value: string,
    isIcon: boolean,
    iconValue: any
  ) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
        {isIcon ? (
          <Feather
            onPress={() => {
              if (title === 'Phone' && value !== '') {
                Linking.openURL(`tel:${value}`)
              } else if (title === 'Email' && value !== '') {
                Linking.openURL(`mailto:${value}`)
              } else if (title === 'Website' && value !== '') {
                Linking.openURL(`http://${getWebsite(value)}`)
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

  return (
    <View className="flex-1 ">
      <PtsLoader loading={isLoading} />
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
                            appointmentDetails.type.type ===
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
                getDetailsView('Username', websiteUser, false, 'copy')
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
              {getDetailsView('Date', apptDate, false, '')}
              {getDetailsView('Purpose', purpose, false, '')}
              {getDetailsView('Status', status, false, '')}
              {getDetailsView('Description', description, false, '')}
              {(status === 'Scheduled' || status === 'ReScheduled') &&
              (getUserPermission(appointmentPrivileges).createPermission ||
                getUserPermission(appointmentPrivileges).updatePermission ||
                getUserPermission(appointmentPrivileges).deletePermission) ? (
                <View className="mt-5 w-full flex-row justify-center">
                  {moment(
                    appointmentDetails.date ? appointmentDetails.date : ''
                  )
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
                          component={'Appointment'}
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
                {moment(appointmentDetails.date ? appointmentDetails.date : '')
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
                    data.apointmentId = appointmentDetails.id
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
                      name={
                        !isShowTransportation ? 'chevron-down' : 'chevron-up'
                      }
                      size={20}
                      color={'black'}
                    />
                  ) : (
                    <View />
                  )}
                </TouchableOpacity>
                {moment(appointmentDetails.date ? appointmentDetails.date : '')
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
                    data.apointmentId = appointmentDetails.id
                    return (
                      <View key={index}>
                        <Transportation
                          component={'Appointment'}
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
      {isAddNote ? (
        <View className="mt-[20] h-full w-full">
          <AddEditNote
            component={'Appointment'}
            noteData={noteData}
            cancelClicked={cancelClicked}
            createUpdateNote={createUpdateNote}
          />
        </View>
      ) : (
        <View />
      )}
      {isAddRemider ? (
        <View className="mt-[20] h-full w-full">
          <AddEditReminder
            component={'Appointment'}
            reminderData={reminderData}
            cancelClicked={cancelClicked}
            createUpdateReminder={createUpdateReminder}
          />
        </View>
      ) : (
        <View />
      )}
      {isAddTransportation ? (
        <View className="h-[95%] w-full">
          <AddEditTransport
            component={'Appointment'}
            address={
              doctorFacilityAddress.address ? doctorFacilityAddress.address : {}
            }
            transportData={transportationData}
            date={
              appointmentDetails.date ? appointmentDetails.date : new Date()
            }
            appointmentId={appointmentDetails.id}
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
